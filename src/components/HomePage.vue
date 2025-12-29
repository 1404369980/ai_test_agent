<template>
  <div class="home-page">
    <div class="home-container">
      <h1 class="home-title">PayKKa 测试平台</h1>
      <p class="home-subtitle">选择要使用的测试功能</p>
      
      <div class="payment-products-section">
        <h2 class="section-title">支付产品测试</h2>
        <div class="button-grid">
          <button @click="goToApiTest" class="home-button api-test-btn">
            <div class="button-icon">🔌</div>
            <div class="button-content">
              <h3>API 接口测试</h3>
              <p>完全自主控制流程，通过API发起付款请求</p>
            </div>
          </button>
          
          <button @click="goToHostedTest" class="home-button hosted-test-btn">
            <div class="button-icon">🛒</div>
            <div class="button-content">
              <h3>Hosted 测试页面</h3>
              <p>跳转至我们的托管支付页面，快速完成收款</p>
            </div>
          </button>
          
          <button @click="goToDropInTest" class="home-button dropin-test-btn">
            <div class="button-icon">📦</div>
            <div class="button-content">
              <h3>Drop-in 测试页面</h3>
              <p>在您的网站嵌入可定制的支付组件</p>
            </div>
          </button>
          
          <button @click="goToComponentTest" class="home-button component-test-btn">
            <div class="button-icon">🎨</div>
            <div class="button-content">
              <h3>Component 测试页面</h3>
              <p>通过高度定制化的UI，无缝融入商户页面</p>
            </div>
          </button>
        </div>
      </div>
      
      <div class="config-section">
        <h2 class="section-title">系统配置</h2>
        <div class="button-grid">
          <button @click="goToUserConfig" class="home-button config-btn">
            <div class="button-icon">⚙️</div>
            <div class="button-content">
              <h3>商户配置</h3>
              <p>管理商户ID、App ID和私钥</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToApiTest = () => {
  router.push('/api-test')
}

const goToHostedTest = () => {
  router.push('/hosted-test')
}

const goToDropInTest = () => {
  router.push('/dropin-test')
}

const goToComponentTest = () => {
  router.push('/component-test')
}

const goToUserConfig = () => {
  router.push('/user-config')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.home-container {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.home-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.home-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.payment-products-section,
.config-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-align: left;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.home-button {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.home-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.api-test-btn:hover {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.hosted-test-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.dropin-test-btn:hover {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.component-test-btn:hover {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.config-btn:hover {
  background: linear-gradient(135deg, #f093fb 0%, #4facfe 100%);
  color: white;
}

.button-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.button-content {
  flex: 1;
}

.button-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
}

.home-button:hover .button-content h3 {
  color: white;
}

.button-content p {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
}

.home-button:hover .button-content p {
  color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 768px) {
  .home-container {
    padding: 2rem 1.5rem;
  }
  
  .home-title {
    font-size: 2rem;
  }
  
  .button-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .home-button {
    padding: 1.5rem;
  }
}
</style>

