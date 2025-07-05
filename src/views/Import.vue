<template>
  <div class="import-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        <span>返回</span>
      </button>
      <h1 class="page-title">导入主题</h1>
    </div>

    <!-- 导入表单 -->
    <div class="import-form">
      <div class="form-section">
        <h2 class="section-title">主题信息</h2>
        
        <div class="form-group">
          <label for="themeTitle">主题名称 *</label>
          <input 
            id="themeTitle"
            v-model="formData.title" 
            type="text" 
            placeholder="例如：商务英语、旅游英语、日常对话"
            class="form-input"
            required
          >
        </div>

        <div class="form-group">
          <label for="themeDescription">主题描述</label>
          <textarea 
            id="themeDescription"
            v-model="formData.description" 
            placeholder="描述这个主题的内容和用途"
            class="form-textarea"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label>主题图片</label>
          <div class="image-upload">
            <div 
              v-if="!formData.image" 
              class="upload-placeholder"
              @click="triggerImageUpload"
            >
              <i class="fas fa-image"></i>
              <p>点击上传图片</p>
              <span>支持 JPG、PNG 格式</span>
            </div>
            <div v-else class="image-preview">
              <img :src="formData.image" alt="主题图片" class="preview-image">
              <button class="remove-image" @click="removeImage">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <input 
              ref="imageInput"
              type="file" 
              accept="image/*"
              @change="handleImageUpload"
              style="display: none"
            >
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2 class="section-title">Excel文件</h2>
        
        <div class="form-group">
          <label>Excel文件 *</label>
          <div class="file-upload">
            <div 
              v-if="!formData.excelFile" 
              class="upload-placeholder"
              @click="triggerFileUpload"
            >
              <i class="fas fa-file-excel"></i>
              <p>点击上传Excel文件</p>
              <span>支持 .xlsx、.xls 格式</span>
            </div>
            <div v-else class="file-preview">
              <i class="fas fa-file-excel file-icon"></i>
              <div class="file-info">
                <p class="file-name">{{ formData.excelFile.name }}</p>
                <p class="file-size">{{ formatFileSize(formData.excelFile.size) }}</p>
              </div>
              <button class="remove-file" @click="removeFile">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <input 
              ref="fileInput"
              type="file" 
              accept=".xlsx,.xls"
              @change="handleFileUpload"
              style="display: none"
            >
          </div>
        </div>

        <div class="excel-template">
          <h3>Excel文件格式要求</h3>
          <p>请确保Excel文件包含以下列（表头）：</p>
          <div class="template-table">
            <div class="template-header">
              <span>单词</span>
              <span>发音</span>
              <span>翻译</span>
              <span>词性</span>
              <span>常见搭配</span>
              <span>例句</span>
            </div>
            <div class="template-example">
              <span>hello</span>
              <span>/həˈloʊ/</span>
              <span>你好</span>
              <span>int.</span>
              <span>hello world, say hello</span>
              <span>Hello, how are you?</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 预览数据 -->
      <div v-if="previewData.length > 0" class="form-section">
        <h2 class="section-title">数据预览</h2>
        <div class="preview-info">
          <p>共解析到 <strong>{{ previewData.length }}</strong> 个单词</p>
        </div>
        <div class="preview-table">
          <div class="preview-header">
            <span>单词</span>
            <span>发音</span>
            <span>翻译</span>
            <span>词性</span>
          </div>
          <div 
            v-for="(word, index) in previewData.slice(0, 5)" 
            :key="index"
            class="preview-row"
          >
            <span>{{ word.word }}</span>
            <span>{{ word.phonetic }}</span>
            <span>{{ word.translation }}</span>
            <span>{{ word.partOfSpeech }}</span>
          </div>
          <div v-if="previewData.length > 5" class="preview-more">
            <p>... 还有 {{ previewData.length - 5 }} 个单词</p>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <button 
          class="btn btn-secondary" 
          @click="goBack"
          :disabled="isImporting"
        >
          取消
        </button>
        <button 
          class="btn btn-primary" 
          @click="importData"
          :disabled="!canImport || isImporting"
        >
          <i v-if="isImporting" class="fas fa-spinner fa-spin"></i>
          <span v-else>导入主题</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'

export default {
  name: 'Import',
  data() {
    return {
      formData: {
        title: '',
        description: '',
        image: null,
        excelFile: null
      },
      previewData: [],
      isImporting: false
    }
  },
  computed: {
    canImport() {
      return this.formData.title && 
             this.formData.excelFile && 
             this.previewData.length > 0
    }
  },
  methods: {
    goBack() {
      this.$router.push('/settings')
    },
    
    triggerImageUpload() {
      this.$refs.imageInput.click()
    },
    
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.formData.image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    
    removeImage() {
      this.formData.image = null
      this.$refs.imageInput.value = ''
    },
    
    triggerFileUpload() {
      this.$refs.fileInput.click()
    },
    
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.formData.excelFile = file
        this.parseExcelFile(file)
      }
    },
    
    removeFile() {
      this.formData.excelFile = null
      this.previewData = []
      this.$refs.fileInput.value = ''
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    
    parseExcelFile(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          
          if (jsonData.length < 2) {
            alert('Excel文件至少需要包含表头和一行数据')
            return
          }
          
          const headers = jsonData[0]
          const requiredHeaders = ['单词', '发音', '翻译', '词性', '常见搭配', '例句']
          
          // 检查表头
          const missingHeaders = requiredHeaders.filter(header => 
            !headers.includes(header)
          )
          
          if (missingHeaders.length > 0) {
            alert(`Excel文件缺少必要的列：${missingHeaders.join(', ')}`)
            return
          }
          
          // 解析数据
          this.previewData = jsonData.slice(1).map(row => {
            const wordIndex = headers.indexOf('单词')
            const phoneticIndex = headers.indexOf('发音')
            const translationIndex = headers.indexOf('翻译')
            const partOfSpeechIndex = headers.indexOf('词性')
            const collocationsIndex = headers.indexOf('常见搭配')
            const exampleIndex = headers.indexOf('例句')
            
            return {
              word: row[wordIndex] || '',
              phonetic: row[phoneticIndex] || '',
              translation: row[translationIndex] || '',
              partOfSpeech: row[partOfSpeechIndex] || '',
              collocations: row[collocationsIndex] ? row[collocationsIndex].split(',').map(c => c.trim()) : [],
              example: row[exampleIndex] || '',
              exampleTranslation: '' // 可以后续添加
            }
          }).filter(word => word.word.trim() !== '')
          
          console.log('解析到的数据:', this.previewData)
          
        } catch (error) {
          console.error('解析Excel文件失败:', error)
          alert('解析Excel文件失败，请检查文件格式')
        }
      }
      reader.readAsArrayBuffer(file)
    },
    
    async importData() {
      if (!this.canImport) return
      
      this.isImporting = true
      
      try {
        // 生成主题ID
        const themeId = Date.now()
        
        // 创建主题对象
        const theme = {
          id: themeId,
          title: this.formData.title,
          description: this.formData.description,
          image: this.formData.image || '/default-theme.jpg',
          wordCount: this.previewData.length,
          createdAt: new Date().toISOString()
        }
        
        // 保存主题数据
        const themeData = {
          theme,
          words: this.previewData
        }
        
        // 只保存到后端API，不保存到localStorage
        await this.saveToWordFolder(themeData)
        
        alert(`成功导入主题 "${this.formData.title}"，包含 ${this.previewData.length} 个单词`)
        this.$router.push('/')
        
      } catch (error) {
        console.error('导入失败:', error)
        console.error('错误详情:', error.message)
        alert(`导入失败: ${error.message}\n请检查网络连接和服务器状态，然后重试`)
      } finally {
        this.isImporting = false
      }
    },
    
    async saveToWordFolder(themeData) {
      try {
        console.log('开始保存到word文件夹...')
        console.log('主题数据:', themeData)
        
        // 使用fetch API保存文件到word文件夹
        const response = await fetch('http://localhost:3001/api/save-word-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            themeId: themeData.theme.id,
            data: themeData
          })
        })
        
        console.log('API响应状态:', response.status)
        console.log('API响应头:', response.headers)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('API错误响应:', errorText)
          throw new Error(`保存文件失败: ${response.status} ${errorText}`)
        }
        
        const result = await response.json()
        console.log('API成功响应:', result)
        console.log(`主题 ${themeData.theme.title} 的JSON文件已保存到word文件夹`)
      } catch (error) {
        console.error('保存到word文件夹失败:', error)
        console.error('错误详情:', error.message)
        // 如果API不可用，回退到下载方式
        await this.saveToFile(themeData)
      }
    },
    
    async saveToFile(themeData) {
      // 创建下载链接
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
    }
  }
}
</script>

<style scoped>
.import-page {
  max-width: 800px;
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

/* 表单样式 */
.import-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 25px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 图片上传 */
.image-upload {
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.image-upload:hover {
  border-color: #4361ee;
}

.upload-placeholder {
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  color: #6c757d;
}

.upload-placeholder i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #dee2e6;
}

.upload-placeholder p {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.upload-placeholder span {
  font-size: 0.9rem;
}

.image-preview {
  position: relative;
  padding: 20px;
  text-align: center;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.remove-image {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 文件上传 */
.file-upload {
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.file-upload:hover {
  border-color: #4361ee;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
}

.file-icon {
  font-size: 2rem;
  color: #28a745;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 600;
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.file-size {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
}

.remove-file {
  width: 30px;
  height: 30px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Excel模板 */
.excel-template {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.excel-template h3 {
  font-size: 1.1rem;
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.excel-template p {
  margin: 0 0 15px 0;
  color: #6c757d;
}

.template-table {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  overflow: hidden;
}

.template-header,
.template-example {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1px;
  background: #dee2e6;
}

.template-header span,
.template-example span {
  background: white;
  padding: 8px 12px;
  font-size: 0.9rem;
  text-align: center;
}

.template-header span {
  background: #4361ee;
  color: white;
  font-weight: 600;
}

/* 预览数据 */
.preview-info {
  margin-bottom: 20px;
}

.preview-info p {
  font-size: 1rem;
  color: #2c3e50;
  margin: 0;
}

.preview-table {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.preview-header,
.preview-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: #dee2e6;
}

.preview-header span,
.preview-row span {
  background: white;
  padding: 12px;
  font-size: 0.9rem;
  text-align: center;
}

.preview-header span {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.preview-more {
  background: white;
  padding: 15px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

/* 操作按钮 */
.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-top: 20px;
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}

.btn-primary {
  background: #4361ee;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #3a0ca3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .import-page {
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
  
  .form-section {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .template-header,
  .template-example,
  .preview-header,
  .preview-row {
    grid-template-columns: 1fr;
    font-size: 0.8rem;
  }
}
</style> 