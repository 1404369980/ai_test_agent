// Toast 提示工具
import { ref } from 'vue'

// 全局 toast 状态
const toastMessage = ref('')
const toastType = ref('info') // 'success', 'error', 'warning', 'info'
const showToast = ref(false)

// 显示 toast
export const showToastMessage = (message, type = 'info', duration = 3000) => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  // 自动隐藏
  setTimeout(() => {
    showToast.value = false
  }, duration)
}

// 成功提示
export const showSuccess = (message, duration = 3000) => {
  showToastMessage(message, 'success', duration)
}

// 错误提示
export const showError = (message, duration = 3000) => {
  showToastMessage(message, 'error', duration)
}

// 警告提示
export const showWarning = (message, duration = 3000) => {
  showToastMessage(message, 'warning', duration)
}

// 信息提示
export const showInfo = (message, duration = 3000) => {
  showToastMessage(message, 'info', duration)
}

// 导出响应式状态（用于组件中使用）
export const useToast = () => {
  return {
    toastMessage,
    toastType,
    showToast,
    showToastMessage,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

