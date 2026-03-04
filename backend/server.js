const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// JSON 数据库文件路径
const DATA_FILE = path.join(__dirname, 'data', 'links.json');

// 确保 data 目录存在
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 初始化/读取数据
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error loading data:', err.message);
  }
  return { links: [] };
}

// 保存数据
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// 创建短链接
app.post('/api/shorten', (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // 验证URL格式
  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // 生成短码
  const shortCode = nanoid(6);
  
  const data = loadData();
  const newLink = {
    id: data.links.length + 1,
    short_code: shortCode,
    original_url: url,
    created_at: new Date().toISOString(),
    clicks: 0
  };
  
  data.links.unshift(newLink);
  saveData(data);
  
  res.json({
    shortCode,
    shortUrl: `${BASE_URL}/${shortCode}`,
    originalUrl: url
  });
});

// 获取链接统计
app.get('/api/stats', (req, res) => {
  const data = loadData();
  res.json(data.links.slice(0, 100));
});

// 短链接跳转
app.get('/:code', (req, res) => {
  const { code } = req.params;
  
  const data = loadData();
  const link = data.links.find(l => l.short_code === code);
  
  if (!link) {
    return res.status(404).send(`
      <html>
        <head><title>404 - Link Not Found</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>404</h1>
          <p>Link not found</p>
          <a href="/">Go Home</a>
        </body>
      </html>
    `);
  }
  
  // 更新点击次数
  link.clicks = (link.clicks || 0) + 1;
  saveData(data);
  
  res.redirect(link.original_url);
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 ShortLink service running at ${BASE_URL}`);
  console.log(`📁 Data file: ${DATA_FILE}`);
});
