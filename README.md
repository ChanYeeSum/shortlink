# ShortLink - 短链接服务

基于 GitHub Pages + Actions 的纯静态短链接服务，无需服务器。

## 功能特性

- 短链接生成：将长链接转换为简短链接
- 链接跳转：访问短链接自动跳转到原始链接
- 数据持久化：链接数据存储在 JSON 文件中，提交到仓库
- 自动化：通过 GitHub Issue + Actions 自动创建短链接

## 技术栈

- **前端**: 原生 HTML/CSS/JavaScript
- **部署**: GitHub Pages
- **自动化**: GitHub Actions + Issues

## 项目结构

```
shortlink/
├── docs/
│   ├── index.html         # 首页
│   ├── 404.html           # 短链接跳转处理
│   ├── style.css          # 样式
│   └── data/
│       └── links.json     # 链接数据
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions 工作流
└── README.md
```

## 使用方法

### 创建短链接

1. 访问首页：https://chanyeesum.github.io/shortlink/
2. 填写原始链接 URL 和可选的短链接代码
3. 点击"创建短链接"，跳转到 GitHub Issue 页面
4. 提交 Issue（会自动添加 `shortlink` 标签）
5. GitHub Actions 自动处理 Issue 并更新链接数据
6. 等待几秒后即可使用短链接

### 访问短链接

访问 `https://chanyeesum.github.io/shortlink/{code}` 即可跳转到原始链接。

## 配置说明

### 1. 启用 GitHub Pages

进入仓库 Settings → Pages → Source 选择 `GitHub Actions`

### 2. 创建标签

在 Issues 中创建 `shortlink` 标签

### 3. 自定义域名（可选）

在 `docs/` 目录添加 `CNAME` 文件，内容为你的域名。

## 工作原理

1. **静态部署**：前端代码部署到 GitHub Pages
2. **404 处理**：GitHub Pages 在找不到文件时显示 404.html，JS 代码解析路径并从 links.json 查找对应链接跳转
3. **Issue 自动化**：用户通过提交 Issue 创建短链接，GitHub Actions 解析 Issue 内容并更新 links.json

## 本地预览

直接用浏览器打开 `docs/index.html` 或使用本地服务器：

```bash
npx serve docs
```

## 许可证

MIT
