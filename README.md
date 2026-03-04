# ShortLink - 短链接服务

一个基于 Node.js + Express + SQLite 构建的短链接生成服务，支持 GitHub Actions CI/CD 自动部署。

## 功能特性

- 生成短链接：将长链接转换为简短的链接
- 链接跳转：访问短链接自动跳转到原始链接
- 点击统计：记录每个链接的访问次数
- 现代界面：响应式设计，支持移动端
- CI/CD：GitHub Actions 自动化构建和部署

## 技术栈

- **后端**: Node.js + Express
- **数据库**: SQLite (better-sqlite3)
- **前端**: 原生 HTML/CSS/JavaScript
- **CI/CD**: GitHub Actions

## 项目结构

```
shortlink/
├── backend/
│   └── server.js          # Express 服务器
├── frontend/
│   ├── index.html         # 前端页面
│   ├── style.css          # 样式文件
│   └── script.js          # 前端逻辑
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions 工作流
├── package.json           # 项目配置
└── README.md
```

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务

```bash
npm start
```

### 3. 访问应用

打开浏览器访问: http://localhost:3000

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `PORT` | 服务端口 | 3000 |
| `BASE_URL` | 服务基础URL | http://localhost:3000 |

## API 接口

### 创建短链接

```http
POST /api/shorten
Content-Type: application/json

{
  "url": "https://example.com/very/long/url"
}
```

响应:
```json
{
  "shortCode": "abc123",
  "shortUrl": "http://localhost:3000/abc123",
  "originalUrl": "https://example.com/very/long/url"
}
```

### 获取链接统计

```http
GET /api/stats
```

### 健康检查

```http
GET /api/health
```

## GitHub Actions CI/CD

项目配置了完整的 GitHub Actions 工作流：

1. **Test**: 代码推送后自动运行测试
2. **Build**: 构建部署包
3. **Deploy**: 生成部署说明（可扩展为自动部署）

### 部署到生产环境

你可以将构建产物部署到任何支持 Node.js 的平台：

- **Vercel**: 导入 GitHub 仓库自动部署
- **Railway**: 连接 GitHub 仓库
- **Render**: 创建新的 Web Service
- **传统服务器**: 下载构建产物，运行 `npm start`

## 许可证

MIT
