import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保word文件夹存在
const wordFolder = path.join(__dirname, 'word');
fs.mkdir(wordFolder, { recursive: true }).catch(console.error);

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ message: '服务器运行正常' });
});

// API路由：获取所有主题文件列表
app.get('/api/word-files', async (req, res) => {
  try {
    const files = await fs.readdir(wordFolder);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const themes = [];
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(wordFolder, file);
        const content = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(content);
        themes.push(data.theme);
      } catch (error) {
        console.error(`读取文件 ${file} 失败:`, error);
      }
    }
    
    res.json(themes);
    
  } catch (error) {
    console.error('获取主题列表失败:', error);
    res.status(500).json({ error: '获取主题列表失败' });
  }
});

// API路由：读取主题JSON文件
app.get('/api/word-file/:themeId', async (req, res) => {
  try {
    const { themeId } = req.params;
    const fileName = `theme_${themeId}.json`;
    const filePath = path.join(wordFolder, fileName);
    
    // 检查文件是否存在
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: '主题文件不存在' });
    }
    
    // 读取JSON文件
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    res.json(data);
    
  } catch (error) {
    console.error('读取文件失败:', error);
    res.status(500).json({ error: '读取文件失败' });
  }
});

// API路由：保存主题JSON文件
app.post('/api/save-word-file', async (req, res) => {
  try {
    const { themeId, data } = req.body;
    
    if (!themeId || !data) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    
    // 生成文件名
    const fileName = `theme_${themeId}.json`;
    const filePath = path.join(wordFolder, fileName);
    
    // 保存JSON文件
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    console.log(`主题文件已保存: ${filePath}`);
    res.json({ success: true, filePath: fileName });
    
  } catch (error) {
    console.error('保存文件失败:', error);
    res.status(500).json({ error: '保存文件失败' });
  }
});

// API路由：删除主题JSON文件
app.delete('/api/word-file/:themeId', async (req, res) => {
  try {
    const { themeId } = req.params;
    const fileName = `theme_${themeId}.json`;
    const filePath = path.join(wordFolder, fileName);
    
    // 检查文件是否存在
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: '主题文件不存在' });
    }
    
    // 删除JSON文件
    await fs.unlink(filePath);
    
    console.log(`主题文件已删除: ${filePath}`);
    res.json({ success: true, message: '主题文件删除成功' });
    
  } catch (error) {
    console.error('删除文件失败:', error);
    res.status(500).json({ error: '删除文件失败' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`Word文件夹路径: ${wordFolder}`);
}); 