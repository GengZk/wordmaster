<template>
  <div class="settings-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        <span>返回</span>
      </button>
      <h1 class="page-title">设置</h1>
    </div>

    <!-- 设置选项 -->
    <div class="settings-content">
      <div class="settings-section">
        <h2 class="section-title">数据管理</h2>
        
        <div class="setting-item">
          <div class="setting-info">
            <h3>清理本地数据</h3>
            <p>清理浏览器本地存储的数据，释放存储空间</p>
          </div>
          <button class="btn btn-danger" @click="clearLocalData">
            清理数据
          </button>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <h3>导入主题</h3>
            <p>从Excel文件导入新的主题和单词</p>
          </div>
          <button class="btn btn-primary" @click="goToImport">
            开始导入
          </button>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <h3>主题管理</h3>
            <p>查看、下载和删除已导入的主题</p>
          </div>
          <button class="btn btn-secondary" @click="goToManage">
            管理主题
          </button>
        </div>
      </div>

      <div class="settings-section">
        <h2 class="section-title">应用信息</h2>
        
        <div class="setting-item">
          <div class="setting-info">
            <i class="fas fa-info-circle setting-icon"></i>
            <div class="setting-text">
              <h3>版本</h3>
              <p>WordMaster v1.0.0</p>
            </div>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <i class="fas fa-code setting-icon"></i>
            <div class="setting-text">
              <h3>开发者</h3>
              <p>AI Assistant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  methods: {
    goBack() {
      this.$router.push('/')
    },
    goToImport() {
      this.$router.push('/import')
    },
    goToManage() {
      this.$router.push('/manage')
    },
         clearLocalData() {
       if (confirm('确定要清理所有本地数据吗？这将删除所有本地存储的主题数据。')) {
         try {
           // 清理localStorage中的主题数据
           localStorage.removeItem('importedThemes')
           
           // 清理其他可能的数据
           const keysToRemove = []
           for (let i = 0; i < localStorage.length; i++) {
             const key = localStorage.key(i)
             if (key && key.includes('theme') || key.includes('word')) {
               keysToRemove.push(key)
             }
           }
           
           keysToRemove.forEach(key => localStorage.removeItem(key))
           
           alert('本地数据清理完成！')
         } catch (error) {
           console.error('清理数据失败:', error)
           alert('清理数据失败，请重试')
         }
       }
     }
  }
}
</script>

<style scoped>
.settings-page {
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

/* 设置内容 */
.settings-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.settings-section {
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

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f8f9fa;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:hover {
  background: #f8f9fa;
  border-radius: 8px;
  padding-left: 15px;
  padding-right: 15px;
  margin: 0 -15px;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.setting-icon {
  width: 40px;
  height: 40px;
  background: #4361ee;
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.setting-text h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 5px 0;
}

.setting-text p {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
}

.arrow-icon {
  color: #6c757d;
  font-size: 1rem;
}

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #4361ee;
  color: white;
}

.btn-primary:hover {
  background: #3a0ca3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #495057;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-page {
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
  
  .settings-section {
    padding: 20px;
  }
  
  .setting-item {
    padding: 15px 0;
  }
}
</style> 