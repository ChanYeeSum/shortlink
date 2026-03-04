// DOM 元素
const form = document.getElementById('shortenForm');
const urlInput = document.getElementById('urlInput');
const result = document.getElementById('result');
const shortUrlLink = document.getElementById('shortUrlLink');
const copyBtn = document.getElementById('copyBtn');
const errorDiv = document.getElementById('error');
const statsContainer = document.getElementById('statsContainer');

// 创建短链接
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const url = urlInput.value.trim();
  if (!url) return;
  
  // 隐藏之前的结果和错误
  result.classList.add('hidden');
  errorDiv.classList.add('hidden');
  
  try {
    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create short link');
    }
    
    // 显示结果
    shortUrlLink.href = data.shortUrl;
    shortUrlLink.textContent = data.shortUrl;
    result.classList.remove('hidden');
    
    // 刷新统计
    loadStats();
    
  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.classList.remove('hidden');
  }
});

// 复制链接
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(shortUrlLink.textContent);
    copyBtn.textContent = '✅';
    setTimeout(() => {
      copyBtn.textContent = '📋';
    }, 2000);
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = shortUrlLink.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    copyBtn.textContent = '✅';
    setTimeout(() => {
      copyBtn.textContent = '📋';
    }, 2000);
  }
});

// 加载统计信息
async function loadStats() {
  try {
    const response = await fetch('/api/stats');
    const links = await response.json();
    
    if (links.length === 0) {
      statsContainer.innerHTML = '<p class="loading">暂无链接数据</p>';
      return;
    }
    
    const tableHTML = `
      <table>
        <thead>
          <tr>
            <th>短链接</th>
            <th>原始链接</th>
            <th>点击次数</th>
          </tr>
        </thead>
        <tbody>
          ${links.map(link => `
            <tr>
              <td><a href="/${link.short_code}" target="_blank">/${link.short_code}</a></td>
              <td><a href="${link.original_url}" target="_blank" title="${link.original_url}">${truncate(link.original_url, 40)}</a></td>
              <td><span class="click-count">${link.clicks}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    statsContainer.innerHTML = tableHTML;
  } catch (err) {
    statsContainer.innerHTML = '<p class="loading">加载失败，请刷新重试</p>';
  }
}

// 截断URL显示
function truncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen) + '...';
}

// 页面加载时获取统计
loadStats();
