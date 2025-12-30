<template>
  <div class="payment-result">
    <div class="result-container">
      <div class="result-content" :class="resultType">
        <div class="result-icon">
          <svg v-if="resultType === 'success'" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="9 12 12 15 22 4"></polyline>
            <polyline points="9 12 12 15 22 4"></polyline>
          </svg>
          <svg v-else width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        
        <h1 class="result-title">
          {{ resultType === 'success' ? '支付成功' : '支付失败' }}
        </h1>
        
        <p class="result-message">
          {{ resultType === 'success' ? '您的支付已成功处理' : '支付处理失败，请重试' }}
        </p>
        
        <div class="result-info" v-if="queryParams">
          <h3>返回参数：</h3>
          <div class="params-list">
            <div v-for="(value, key) in queryParams" :key="key" class="param-item">
              <span class="param-key">{{ key }}:</span>
              <span class="param-value">{{ value }}</span>
            </div>
          </div>
        </div>
        
        <div class="result-actions">
          <button @click="goHome" class="btn-primary">返回首页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const resultType = ref('success') // 'success' 或 'cancel'
const queryParams = ref({})

onMounted(() => {
  // 从路由参数判断是成功还是失败
  if (route.path.includes('/payment/cancel') || route.path.includes('/payment/fail')) {
    resultType.value = 'cancel'
  } else {
    resultType.value = 'success'
  }
  
  // 获取所有查询参数
  queryParams.value = { ...route.query }
})

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.payment-result {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.result-container {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.result-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.result-icon {
  color: #10b981;
  margin-bottom: 1rem;
}

.result-content.cancel .result-icon {
  color: #ef4444;
}

.result-title {
  font-size: 2.5rem;
  color: #333;
  margin: 0;
  font-weight: 700;
}

.result-content.cancel .result-title {
  color: #ef4444;
}

.result-message {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
}

.result-info {
  width: 100%;
  text-align: left;
  margin-top: 1rem;
  padding: 1.5rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.result-info h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
}

.params-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.param-item {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  font-size: 0.9rem;
}

.param-key {
  font-weight: 600;
  color: #555;
  min-width: 120px;
}

.param-value {
  color: #333;
  word-break: break-all;
}

.result-actions {
  margin-top: 2rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .result-container {
    padding: 2rem 1.5rem;
  }
  
  .result-title {
    font-size: 2rem;
  }
  
  .param-item {
    flex-direction: column;  
    gap: 0.25rem;
  }
  
  .param-key {
    min-width: auto;
  }
}
</style>

