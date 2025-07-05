<template>
  <div class="manage-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        <span>返回</span>
      </button>
      <h1 class="page-title">管理主题</h1>
    </div>

    <!-- 主题列表 -->
    <div class="themes-content">
      <div v-if="importedThemes.length === 0" class="empty-state">
        <i class="fas fa-folder-open"></i>
        <h3>暂无导入的主题</h3>
        <p>点击下方按钮开始导入你的第一个主题</p>
        <button class="btn btn-primary" @click="goToImport">
          <i class="fas fa-plus"></i>
          导入主题
        </button>
      </div>

      <div v-else class="themes-grid">
        <div 
          v-for="themeData in importedThemes" 
          :key="themeData.theme.id"
          class="theme-card"
        >
          <!-- 主题图片 -->
          <div class="theme-image">
            <img 
              :src="themeData.theme.image" 
              :alt="themeData.theme.title"
              @error="handleImageError"
            >
            <div class="theme-overlay">
              <button class="play-btn" @click="previewTheme(themeData)">
                <i class="fas fa-play"></i>
              </button>
            </div>
          </div>

          <!-- 主题信息 -->
          <div class="theme-info">
            <h3 class="theme-title">{{ themeData.theme.title }}</h3>
            <p class="theme-description">{{ themeData.theme.description || '暂无描述' }}</p>
            
            <div class="theme-stats">
              <span class="stat">
                <i class="fas fa-book"></i>
                {{ themeData.theme.wordCount }} 个单词
              </span>
              <span class="stat">
                <i class="fas fa-calendar"></i>
                {{ formatDate(themeData.theme.createdAt) }}
              </span>
            </div>

            <!-- 操作按钮 -->
            <div class="theme-actions">
              <button class="action-btn primary" @click="previewTheme(themeData)">
                <i class="fas fa-eye"></i>
                预览
              </button>
              <button class="action-btn secondary" @click="downloadTheme(themeData)">
                <i class="fas fa-download"></i>
                下载
              </button>
              <button class="action-btn danger" @click="deleteTheme(themeData.theme.id)">
                <i class="fas fa-trash"></i>
                删除
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加新主题按钮 -->
      <div v-if="importedThemes.length > 0" class="add-theme-section">
        <button class="add-theme-btn" @click="goToImport">
          <i class="fas fa-plus"></i>
          <span>导入新主题</span>
        </button>
      </div>
    </div>

    <!-- 预览模态框 -->
    <div v-if="showPreview" class="modal-overlay" @click="closePreview">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ previewThemeData.theme.title }}</h2>
          <button class="close-btn" @click="closePreview">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="preview-stats">
            <div class="stat-item">
              <span class="stat-label">单词数量</span>
              <span class="stat-value">{{ previewThemeData.theme.wordCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">创建时间</span>
              <span class="stat-value">{{ formatDate(previewThemeData.theme.createdAt) }}</span>
            </div>
          </div>

          <div class="preview-words">
            <h3>单词列表</h3>
            <div class="words-list">
              <div 
                v-for="(word, index) in previewThemeData.words.slice(0, 10)" 
                :key="index"
                class="word-item"
              >
                <span class="word-text">{{ word.word }}</span>
                <span class="word-translation">{{ word.translation }}</span>
              </div>
              <div v-if="previewThemeData.words.length > 10" class="more-words">
                <p>... 还有 {{ previewThemeData.words.length - 10 }} 个单词</p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closePreview">关闭</button>
          <button class="btn btn-primary" @click="startLearning(previewThemeData.theme.id)">
            开始学习
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '../utils/eventBus'

export default {
  name: 'Manage',
  data() {
    return {
      importedThemes: [],
      showPreview: false,
      previewThemeData: null
    }
  },
  async mounted() {
    await this.loadImportedThemes()
  },
  methods: {
    goBack() {
      this.$router.push('/settings')
    },
    
    goToImport() {
      this.$router.push('/import')
    },
    
    async loadImportedThemes() {
      try {
        // 尝试从API加载主题
        const response = await fetch('http://localhost:3001/api/word-files')
        if (response.ok) {
          const themes = await response.json()
          this.importedThemes = themes.map(theme => ({
            theme: theme,
            words: [] // 这里暂时不加载单词数据，只在预览时加载
          }))
        } else {
          // 回退到localStorage
          const themes = localStorage.getItem('importedThemes')
          this.importedThemes = themes ? JSON.parse(themes) : []
        }
      } catch (error) {
        console.warn('无法从API加载主题，使用localStorage数据:', error)
        // 回退到localStorage
        const themes = localStorage.getItem('importedThemes')
        this.importedThemes = themes ? JSON.parse(themes) : []
      }
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    
    handleImageError(event) {
      event.target.src = '/default-theme.jpg'
    },
    
    previewTheme(themeData) {
      this.previewThemeData = themeData
      this.showPreview = true
    },
    
    closePreview() {
      this.showPreview = false
      this.previewThemeData = null
    },
    
    startLearning(themeId) {
      this.closePreview()
      this.$router.push(`/words/${themeId}`)
    },
    
    downloadTheme(themeData) {
      const dataStr = JSON.stringify(themeData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `${themeData.theme.title.replace(/[^a-zA-Z0-9]/g, '_')}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    
    async deleteTheme(themeId) {
      if (confirm('确定要删除这个主题吗？此操作不可恢复。')) {
        try {
          console.log('开始删除主题:', themeId)
          
          // 删除服务器上的文件
          const response = await fetch(`http://localhost:3001/api/word-file/${themeId}`, {
            method: 'DELETE'
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`删除服务器文件失败: ${errorData.error || response.statusText}`)
          }
          
          const result = await response.json()
          console.log('删除结果:', result)
          
          // 重新加载主题列表（从服务器获取最新数据）
          await this.loadImportedThemes()
          
          // 通知其他组件主题已删除
          eventBus.emit('themeDeleted', themeId)
          
          alert('主题删除成功！')
          
        } catch (error) {
          console.error('删除主题失败:', error)
          alert(`删除主题失败: ${error.message}`)
        }
      }
    }
  }
}
</script>

<style scoped>
.manage-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  padding: 20px 0;
  border-bottom: 2px solid #f0f0f0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.back-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #6c757d;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  color: #495057;
}

.empty-state p {
  font-size: 1rem;
  margin: 0 0 30px 0;
}

/* 主题网格 */
.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

/* 主题卡片 */
.theme-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.theme-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.theme-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.theme-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.theme-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.theme-card:hover .theme-overlay {
  opacity: 1;
}

.play-btn {
  width: 60px;
  height: 60px;
  background: #4361ee;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.play-btn:hover {
  background: #3a0ca3;
  transform: scale(1.1);
}

.theme-info {
  padding: 25px;
}

.theme-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.theme-description {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.theme-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #495057;
}

.stat i {
  color: #4361ee;
}

.theme-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.action-btn.primary {
  background: #4361ee;
  color: white;
}

.action-btn.primary:hover {
  background: #3a0ca3;
}

.action-btn.secondary {
  background: #6c757d;
  color: white;
}

.action-btn.secondary:hover {
  background: #5a6268;
}

.action-btn.danger {
  background: #dc3545;
  color: white;
}

.action-btn.danger:hover {
  background: #c82333;
}

/* 添加主题按钮 */
.add-theme-section {
  text-align: center;
  padding: 40px 0;
}

.add-theme-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: #4361ee;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-theme-btn:hover {
  background: #3a0ca3;
  transform: translateY(-2px);
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px 30px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.close-btn {
  width: 35px;
  height: 35px;
  background: #f8f9fa;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.modal-body {
  padding: 30px;
}

.preview-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 8px;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
}

.preview-words h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
}

.words-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.word-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.word-text {
  font-weight: 600;
  color: #2c3e50;
}

.word-translation {
  color: #6c757d;
  font-size: 0.9rem;
}

.more-words {
  text-align: center;
  padding: 15px;
  color: #6c757d;
  font-style: italic;
}

.modal-footer {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding: 25px 30px;
  border-top: 1px solid #f0f0f0;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-primary {
  background: #4361ee;
  color: white;
}

.btn-primary:hover {
  background: #3a0ca3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .manage-page {
    padding: 15px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .themes-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .theme-stats {
    flex-direction: column;
    gap: 10px;
  }
  
  .theme-actions {
    flex-direction: column;
  }
  
  .preview-stats {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}
</style> 