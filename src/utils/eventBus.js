// 简单的事件总线
class EventBus {
  constructor() {
    this.events = {}
  }

  // 监听事件
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  // 移除监听
  off(event, callback) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(cb => cb !== callback)
  }

  // 触发事件
  emit(event, data) {
    if (!this.events[event]) return
    this.events[event].forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error('事件回调执行错误:', error)
      }
    })
  }

  // 清除所有事件
  clear() {
    this.events = {}
  }
}

// 创建全局事件总线实例
const eventBus = new EventBus()

export default eventBus 