<template>
  <div>
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">WordMaster</h1>
        <p class="page-subtitle">主题英语单词学习</p>
      </div>
      <button class="settings-btn" @click="goToSettings">
        <i class="fas fa-cog"></i>
      </button>
    </div>

    <section class="hero">
      <h1>通过主题高效学习英语词汇</h1>
      <p>探索精心分类的主题词汇库，掌握每个单词的发音、词义、用法和例句，让英语学习更加系统高效</p>
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="搜索单词或主题..."
          v-model="searchQuery"
          @input="handleSearch"
        >
        <button @click="handleSearch">搜索</button>
      </div>
    </section>

    <div class="section-title">
      <h2>学习主题</h2>
    </div>

    <!-- 空状态 -->
    <div v-if="themes.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-book-open"></i>
      </div>
      <h3>暂无学习主题</h3>
      <p>点击设置按钮导入你的第一个主题</p>
      <button class="import-btn" @click="goToSettings">
        <i class="fas fa-plus"></i>
        导入主题
      </button>
    </div>

    <!-- 主题列表 -->
    <div v-else class="themes-grid">
      <div 
        v-for="theme in filteredThemes" 
        :key="theme.id"
        class="theme-card fade-in"
        @click="goToWords(theme.id)"
      >
        <div 
          class="theme-image" 
          :style="{ backgroundImage: theme.image, backgroundColor: theme.color }"
        ></div>
        <div class="theme-content">
          <h3>{{ theme.title }}</h3>
          <p>{{ theme.description }}</p>
          <div class="word-count">
            <i class="fas fa-book"></i>
            <span>{{ theme.wordCount }} 个单词</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '../utils/eventBus'

export default {
  name: 'Home',
  data() {
    return {
      themes: [],
      searchQuery: ''
    }
  },
  computed: {
    filteredThemes() {
      if (!this.searchQuery) {
        return this.themes
      }
      const query = this.searchQuery.toLowerCase()
      return this.themes.filter(theme => 
        theme.title.toLowerCase().includes(query) ||
        theme.description.toLowerCase().includes(query)
      )
    }
  },
  async mounted() {
    await this.loadThemes()
    document.querySelectorAll('.section-title').forEach(title => {
      title.classList.add('fade-in')
    })
    
    // 监听主题删除事件
    eventBus.on('themeDeleted', this.handleThemeDeleted)
  },
  
  beforeUnmount() {
    // 清理事件监听
    eventBus.off('themeDeleted', this.handleThemeDeleted)
  },
  methods: {
    async loadThemes() {
      try {
        // 只从后端API加载主题
        const response = await fetch('http://localhost:3001/api/word-files')
        if (response.ok) {
          const importedThemes = await response.json()
          this.themes = importedThemes.map(theme => ({
            id: theme.id,
            title: theme.title,
            description: theme.description || '导入的主题',
            image: theme.image,
            color: '#4361ee',
            wordCount: theme.wordCount
          }))
        } else {
          console.warn('API响应错误:', response.status)
          this.themes = []
        }
      } catch (error) {
        console.error('加载主题失败:', error)
        this.themes = []
      }
    },
    goToWords(themeId) {
      this.$router.push(`/words/${themeId}`)
    },
    goToSettings() {
      this.$router.push('/settings')
    },
    handleSearch() {
      // 搜索功能已通过计算属性实现
    },
    
    handleThemeDeleted(themeId) {
      console.log('收到主题删除事件:', themeId)
      // 重新加载主题列表
      this.loadThemes()
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.loadThemes()
    })
  }
}
</script>

<style scoped>
/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  margin-bottom: 30px;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  margin: 0;
}

.settings-btn {
  width: 50px;
  height: 50px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #6c757d;
  transition: all 0.3s ease;
}

.settings-btn:hover {
  background: #e9ecef;
  color: #495057;
  transform: rotate(90deg);
}

/* 英雄区域 */
.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  margin-bottom: 40px;
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.hero p {
  font-size: 1.2rem;
  margin: 0 0 30px 0;
  opacity: 0.9;
  line-height: 1.6;
}

.search-bar {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  background: white;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-bar input {
  flex: 1;
  padding: 15px 25px;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-bar button {
  padding: 15px 30px;
  background: #4361ee;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.search-bar button:hover {
  background: #3a0ca3;
}

/* 主题网格 */
.section-title {
  text-align: center;
  margin-bottom: 40px;
}

.section-title h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px dashed #e9ecef;
}

.empty-icon {
  font-size: 4rem;
  color: #6c757d;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.empty-state p {
  font-size: 1rem;
  color: #6c757d;
  margin: 0 0 30px 0;
}

.import-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #4361ee;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.import-btn:hover {
  background: #3a0ca3;
  transform: translateY(-2px);
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.theme-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.theme-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.theme-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.theme-content {
  padding: 25px;
}

.theme-content h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.theme-content p {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.word-count {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #4361ee;
  font-weight: 600;
}

.word-count i {
  font-size: 1rem;
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .hero {
    padding: 40px 20px;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .search-bar {
    flex-direction: column;
    border-radius: 12px;
  }
  
  .search-bar input,
  .search-bar button {
    border-radius: 0;
  }
  
  .themes-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style> 