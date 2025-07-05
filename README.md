# WordMaster - 主题英语单词学习应用

一个现代化的英语单词学习应用，支持主题分类、发音播放、Excel导入等功能。

## 功能特性

- 🎯 **主题学习** - 按主题分类学习单词
- 🔊 **发音播放** - 使用Web Speech API播放英语发音
- 📊 **Excel导入** - 支持Excel文件批量导入单词数据
- 📱 **响应式设计** - 支持桌面和移动设备
- 🎨 **现代UI** - 美观的用户界面
- 💾 **数据管理** - 支持主题的增删改查

## 技术栈

- **前端**: Vue 3 + Vite + Vue Router
- **后端**: Express.js (Node.js)
- **数据存储**: JSON文件 + 本地存储
- **构建工具**: Vite

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/你的用户名/wordmaster.git
cd wordmaster
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
# 启动前端和后端
npm run dev:full

# 或者分别启动
npm run server  # 后端 (端口 3001)
npm run dev     # 前端 (端口 3000)
```

### 4. 访问应用

- 前端: http://localhost:3000
- 后端API: http://localhost:3001

## 项目结构

```
wordmaster/
├── src/
│   ├── components/     # Vue组件
│   ├── views/         # 页面组件
│   ├── data/          # 静态数据
│   ├── utils/         # 工具函数
│   ├── App.vue        # 根组件
│   └── main.js        # 入口文件
├── word/              # 主题数据文件
├── server-simple.js   # 后端服务器
├── package.json       # 项目配置
└── README.md          # 项目说明
```

## 使用说明

### 导入主题

1. 点击右上角设置按钮
2. 选择"导入主题"
3. 填写主题信息并上传Excel文件
4. Excel文件格式要求：
   - 列名：word, phonetic, translation, partOfSpeech, collocations, example, exampleTranslation
   - 支持.xlsx和.xls格式

### 学习单词

1. 在首页选择主题
2. 查看单词卡片，包含发音、翻译、词性、搭配、例句
3. 点击发音按钮播放英语发音

### 管理主题

1. 在设置页面选择"主题管理"
2. 查看所有导入的主题
3. 支持下载和删除操作

## 部署

### 构建生产版本

```bash
npm run build
```

### 部署到服务器

1. 将构建后的`dist`文件夹上传到服务器
2. 配置服务器支持SPA路由
3. 确保后端API可访问

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License 