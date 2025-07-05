<template>
  <div class="words-page">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
      <p>正在加载主题数据...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>加载失败</h3>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="loadThemeData">
        <i class="fas fa-redo"></i>
        重试
      </button>
    </div>

    <!-- 正常内容 -->
    <div v-else>
      <!-- 页面头部 -->
      <div class="page-header">
        <button class="back-btn" @click="goBack">
          <i class="fas fa-arrow-left"></i>
          <span>返回</span>
        </button>
        <h1 class="page-title">{{ currentTheme?.title || '单词学习' }}</h1>
        <div class="word-count">{{ currentWords.length }} 个单词</div>
      </div>

    <!-- 单词卡片网格 -->
    <div class="words-grid">
      <div 
        v-for="word in currentWords" 
        :key="word.word"
        class="word-card"
      >
        <!-- 卡片头部 -->
        <div class="card-header">
          <div class="word-info">
            <h2 class="word-text">{{ word.word }}</h2>
            <p class="phonetic">{{ word.phonetic }}</p>
          </div>
          <button 
            class="pronounce-btn"
            @click="playSound(word.word)"
            :disabled="isPlaying"
            :title="isPlaying ? '正在播放...' : '点击播放发音'"
          >
            <i :class="isPlaying ? 'fas fa-spinner fa-spin' : 'fas fa-volume-up'"></i>
          </button>
        </div>

        <!-- 翻译 -->
        <div class="translation">
          {{ word.translation }}
        </div>

        <!-- 词性标签 -->
        <div class="part-of-speech">
          <span class="tag">{{ word.partOfSpeech }}</span>
        </div>

        <!-- 常见搭配 -->
        <div class="collocations">
          <h4>常见搭配</h4>
          <div class="collocation-tags">
            <span 
              v-for="collocation in word.collocations" 
              :key="collocation"
              class="collocation-tag"
            >
              {{ collocation }}
            </span>
          </div>
        </div>

        <!-- 例句 -->
        <div class="example">
          <h4>例句</h4>
          <div class="example-content">
            <p class="english">{{ word.example }}</p>
            <p class="chinese">{{ word.exampleTranslation }}</p>
          </div>
        </div>
      </div>
    </div>

      <!-- 空状态 -->
      <div v-if="currentWords.length === 0" class="empty-state">
        <i class="fas fa-book-open"></i>
        <h3>暂无单词数据</h3>
        <p>该主题下还没有添加单词</p>
      </div>
    </div>
  </div>
</template>

<script>
import { words } from '../data/words.js'

export default {
  name: 'Words',
  data() {
    return {
      isPlaying: false,
      speechSynthesis: window.speechSynthesis,
      currentTheme: null,
      currentWords: [],
      isLoading: true,
      error: null
    }
  },
  computed: {
    themeId() {
      return parseInt(this.$route.params.themeId)
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    playSound(word) {
      if (this.isPlaying) return
      
      this.isPlaying = true
      
      // 创建语音合成对象
      const utterance = new SpeechSynthesisUtterance(word)
      
      // 设置语音参数
      utterance.lang = 'en-US' // 英语
      utterance.rate = 0.8 // 语速稍慢，便于学习
      utterance.pitch = 1.0 // 音调
      utterance.volume = 1.0 // 音量
      
      // 选择英语女声（如果可用）
      const voices = this.speechSynthesis.getVoices()
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Female')
      ) || voices.find(voice => voice.lang.includes('en'))
      
      if (englishVoice) {
        utterance.voice = englishVoice
      }
      
      // 播放完成后的回调
      utterance.onend = () => {
        this.isPlaying = false
      }
      
      // 播放错误时的回调
      utterance.onerror = (event) => {
        console.error('语音播放错误:', event)
        this.isPlaying = false
      }
      
      // 开始播放
      this.speechSynthesis.speak(utterance)
      
      // 如果语音合成不可用，使用备用方案
      if (!this.speechSynthesis.speaking) {
        setTimeout(() => {
          this.isPlaying = false
          console.log(`播放单词发音: ${word}`)
        }, 800)
      }
    },
    // 初始化语音合成
    initSpeechSynthesis() {
      // 确保语音合成可用
      if ('speechSynthesis' in window) {
        // 等待语音列表加载完成
        if (this.speechSynthesis.getVoices().length === 0) {
          this.speechSynthesis.addEventListener('voiceschanged', () => {
            console.log('语音列表已加载，可用语音数量:', this.speechSynthesis.getVoices().length)
          })
        }
      } else {
        console.warn('浏览器不支持语音合成')
      }
    },
    
    async loadThemeData() {
      try {
        this.isLoading = true
        this.error = null
        
        // 先尝试从默认数据加载
        const defaultWords = words[String(this.themeId)]
        
        if (defaultWords) {
          // 如果有默认单词数据，创建一个简单的主题对象
          this.currentTheme = {
            id: this.themeId,
            title: `主题 ${this.themeId}`,
            description: '默认主题',
            wordCount: defaultWords.length
          }
          this.currentWords = defaultWords
          this.isLoading = false
          return
        }
        
        // 如果默认数据不存在，尝试从API加载
        const response = await fetch(`http://localhost:3001/api/word-file/${this.themeId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            this.error = '主题不存在'
          } else {
            this.error = '加载主题数据失败'
          }
          this.isLoading = false
          return
        }
        
        const data = await response.json()
        this.currentTheme = data.theme
        this.currentWords = data.words
        this.isLoading = false
        
      } catch (error) {
        console.error('加载主题数据失败:', error)
        this.error = '加载主题数据失败'
        this.isLoading = false
      }
    }
  },
  async mounted() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    this.initSpeechSynthesis()
    await this.loadThemeData()
  },
}
</script>

<style scoped>
.words-page {
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
  flex: 1;
}

.word-count {
  background: #4361ee;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

/* 单词网格 */
.words-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

/* 单词卡片 */
.word-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.word-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.word-info {
  flex: 1;
}

.word-text {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.phonetic {
  font-size: 1.1rem;
  color: #6c757d;
  font-style: italic;
  margin: 0;
}

.pronounce-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #4361ee;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.pronounce-btn:hover {
  background: #3a0ca3;
  transform: scale(1.05);
}

.pronounce-btn:disabled {
  background: #4361ee;
  cursor: not-allowed;
  opacity: 0.8;
}

.pronounce-btn:disabled:hover {
  transform: none;
}

/* 翻译 */
.translation {
  font-size: 1.4rem;
  color: #3a0ca3;
  font-weight: 600;
  margin-bottom: 20px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

/* 词性标签 */
.part-of-speech {
  margin-bottom: 20px;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
}

/* 常见搭配 */
.collocations {
  margin-bottom: 20px;
}

.collocations h4 {
  font-size: 1rem;
  color: #495057;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.collocations h4::before {
  content: "🔗";
  font-size: 14px;
}

.collocation-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.collocation-tag {
  background: #f8f9fa;
  color: #495057;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  border: 1px solid #dee2e6;
}

/* 例句 */
.example {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #4361ee;
}

.example h4 {
  font-size: 1rem;
  color: #495057;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.example h4::before {
  content: "💬";
  font-size: 14px;
}

.example-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.english {
  font-size: 1rem;
  color: #2c3e50;
  margin: 0;
  font-style: italic;
}

.chinese {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: #6c757d;
}

.loading-spinner {
  font-size: 3rem;
  color: #4361ee;
  margin-bottom: 20px;
}

.loading-state p {
  font-size: 1.1rem;
  margin: 0;
}

/* 错误状态 */
.error-state {
  text-align: center;
  padding: 80px 20px;
  color: #6c757d;
}

.error-state i {
  font-size: 4rem;
  color: #dc3545;
  margin-bottom: 20px;
}

.error-state h3 {
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  color: #495057;
}

.error-state p {
  font-size: 1rem;
  margin: 0 0 30px 0;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #4361ee;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #3a0ca3;
  transform: translateY(-2px);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
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
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .words-page {
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
  
  .words-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .word-card {
    padding: 20px;
  }
  
  .word-text {
    font-size: 1.8rem;
  }
  
  .translation {
    font-size: 1.2rem;
  }
}
</style> 