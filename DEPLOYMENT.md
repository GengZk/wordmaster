# WordMaster 部署指南

## 部署方案

本项目采用前后端分离部署：
- **前端**: Vue 3 + Vite → Vercel
- **后端**: Express.js → Render

## 1. 后端部署到 Render

### 步骤：
1. 访问 [Render](https://render.com/) 并注册账户
2. 点击 "New +" → "Web Service"
3. 连接你的 GitHub 仓库：`GengZk/wordmaster`
4. 配置部署设置：
   - **Name**: `wordmaster-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server-simple.js`
   - **Plan**: `Free`

### 环境变量：
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render会自动设置)

### 部署完成后：
- 你会得到一个类似 `https://wordmaster-backend.onrender.com` 的URL
- 记下这个URL，用于前端配置

## 2. 前端部署到 Vercel

### 步骤：
1. 访问 [Vercel](https://vercel.com/) 并注册账户
2. 点击 "New Project"
3. 导入你的 GitHub 仓库：`GengZk/wordmaster`
4. 配置部署设置：
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (默认)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 环境变量：
- `VITE_API_BASE`: 你的后端URL (例如: `https://wordmaster-backend.onrender.com`)

### 部署完成后：
- 你会得到一个类似 `https://wordmaster.vercel.app` 的URL
- 这就是你的应用访问地址

## 3. 测试部署

1. 访问前端URL
2. 尝试导入一个主题
3. 检查功能是否正常

## 4. 自定义域名（可选）

### Vercel 自定义域名：
1. 在 Vercel 项目设置中找到 "Domains"
2. 添加你的域名
3. 按照提示配置DNS

### Render 自定义域名：
1. 在 Render 服务设置中找到 "Custom Domains"
2. 添加你的域名
3. 配置DNS记录

## 5. 故障排除

### 常见问题：
1. **CORS错误**: 确保后端允许前端域名访问
2. **API请求失败**: 检查环境变量 `VITE_API_BASE` 是否正确
3. **文件上传失败**: 检查后端文件权限

### 日志查看：
- Vercel: 项目 → Functions → 查看日志
- Render: 服务 → Logs → 查看实时日志

## 6. 更新部署

代码推送到 GitHub 后，Vercel 和 Render 会自动重新部署。

---

**部署完成后，你的应用就可以被全世界访问了！** 🌍 