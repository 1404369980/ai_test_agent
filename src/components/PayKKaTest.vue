<template>
  <div class="paykka-test">
    <div class="container">
      <div class="header-with-back">
        <button @click="$emit('back')" class="back-button">← 返回首页</button>
        <h1 class="title">PayKKa 交易接口测试</h1>
      </div>
      
      <div class="test-panel">
        <div class="form-section">
          <h2>交易参数配置</h2>
          
          <div class="form-group">
            <label>API 地址</label>
            <input 
              v-model="apiConfig.baseUrl" 
              type="text" 
              placeholder="https://api.paykka.com"
              class="input-field"
            />
          </div>

          <div class="form-group">
            <label>商户ID (Merchant ID)</label>
            <select 
              v-model="selectedMerchantId" 
              @change="onMerchantChange"
              class="input-field"
            >
              <option value="">-- 请选择商户 --</option>
              <option v-for="config in merchantConfigs" :key="config.merchantId" :value="config.merchantId">
                {{ config.name || config.merchantId }}
              </option>
            </select>
            <small class="field-desc">从已配置的商户中选择，选择后将自动填充App ID和私钥</small>
          </div>

          <div class="form-group">
            <label>API密钥 (API Key)</label>
            <input 
              v-model="apiConfig.apiKey" 
              type="password" 
              placeholder="请输入API密钥"
              class="input-field"
            />
          </div>

          <div class="divider"></div>

          <h3>交易信息</h3>

          <div class="form-row">
            <div class="form-group">
              <label>订单号 (Order No)</label>
              <input 
                v-model="transactionData.orderNo" 
                type="text" 
                placeholder="自动生成"
                class="input-field"
              />
              <button @click="generateOrderNo" class="btn-small">生成</button>
            </div>

            <div class="form-group">
              <label>交易金额 (Amount)</label>
              <input 
                v-model.number="transactionData.amount" 
                type="number" 
                step="0.01"
                placeholder="0.00"
                class="input-field"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>币种 (Currency)</label>
              <select v-model="transactionData.currency" class="input-field">
                <option value="USD">USD - 美元</option>
                <option value="EUR">EUR - 欧元</option>
                <option value="GBP">GBP - 英镑</option>
                <option value="CNY">CNY - 人民币</option>
                <option value="JPY">JPY - 日元</option>
              </select>
            </div>

            <div class="form-group">
              <label>交易类型 (Transaction Type)</label>
              <select v-model="transactionData.transactionType" class="input-field">
                <option value="payment">支付 (Payment)</option>
                <option value="refund">退款 (Refund)</option>
                <option value="query">查询 (Query)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>商品描述 (Description)</label>
            <textarea 
              v-model="transactionData.description" 
              placeholder="请输入商品描述"
              class="input-field textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label>回调地址 (Callback URL)</label>
            <input 
              v-model="transactionData.callbackUrl" 
              type="text" 
              placeholder="https://your-domain.com/callback"
              class="input-field"
            />
          </div>

          <div class="button-group">
            <button @click="submitTransaction" :disabled="loading" class="btn-primary">
              {{ loading ? '处理中...' : '提交交易' }}
            </button>
            <button @click="resetForm" class="btn-secondary">重置表单</button>
            <button @click="testConnection" :disabled="loading" class="btn-info">测试连接</button>
          </div>
        </div>

        <div class="result-section">
          <h2>测试结果</h2>
          
          <div v-if="!result" class="empty-state">
            <p>暂无测试结果，请提交交易进行测试</p>
          </div>

          <div v-else class="result-content">
            <div class="result-header">
              <span class="status-badge" :class="result.status">
                {{ result.status === 'success' ? '成功' : result.status === 'error' ? '失败' : '进行中' }}
              </span>
              <span class="timestamp">{{ result.timestamp }}</span>
            </div>

            <div class="result-body">
              <div class="result-item">
                <label>请求URL:</label>
                <code>{{ result.requestUrl }}</code>
              </div>

              <div class="result-item">
                <label>请求参数:</label>
                <pre class="code-block">{{ formatJson(result.requestData) }}</pre>
              </div>

              <div class="result-item">
                <label>响应数据:</label>
                <pre class="code-block">{{ formatJson(result.responseData) }}</pre>
              </div>

              <div v-if="result.error" class="result-item error">
                <label>错误信息:</label>
                <pre class="code-block error-text">{{ result.error }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { payKKaApi } from '../services/paykkaApi'
import { getAllConfigs, getConfigByMerchantId } from '../services/configManager'

defineEmits(['back'])

const loading = ref(false)

// 商户配置相关
const merchantConfigs = ref([])
const selectedMerchantId = ref('')

// 加载商户配置列表
const loadMerchantConfigs = () => {
  merchantConfigs.value = getAllConfigs()
  // 如果有默认配置，自动选择
  if (merchantConfigs.value.length > 0 && !selectedMerchantId.value) {
    const defaultConfig = merchantConfigs.value.find(c => c.merchantId === apiConfig.merchantId) || merchantConfigs.value[0]
    selectedMerchantId.value = defaultConfig.merchantId
    onMerchantChange()
  }
}

// 商户选择变化时，自动填充配置
const onMerchantChange = () => {
  if (!selectedMerchantId.value) {
    return
  }
  
  const config = getConfigByMerchantId(selectedMerchantId.value)
  if (config) {
    apiConfig.merchantId = config.merchantId
    // PayKKaTest使用apiKey，这里用privateKey填充
    apiConfig.apiKey = config.privateKey
  }
}

const apiConfig = reactive({
  baseUrl: 'https://api.paykka.com',
  merchantId: '',
  apiKey: ''
})

const transactionData = reactive({
  orderNo: '',
  amount: 0,
  currency: 'USD',
  transactionType: 'payment',
  description: '',
  callbackUrl: ''
})

const result = ref(null)

// 生成订单号
const generateOrderNo = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  transactionData.orderNo = `PK${timestamp}${random}`
}

// 格式化JSON
const formatJson = (obj) => {
  if (!obj) return ''
  return JSON.stringify(obj, null, 2)
}

// 重置表单
const resetForm = () => {
  transactionData.orderNo = ''
  transactionData.amount = 0
  transactionData.currency = 'USD'
  transactionData.transactionType = 'payment'
  transactionData.description = ''
  transactionData.callbackUrl = ''
  result.value = null
}

// 测试连接
const testConnection = async () => {
  loading.value = true
  try {
    const response = await payKKaApi.testConnection(apiConfig.baseUrl)
    result.value = {
      status: 'success',
      timestamp: new Date().toLocaleString('zh-CN'),
      requestUrl: `${apiConfig.baseUrl}/health`,
      requestData: {},
      responseData: response
    }
  } catch (error) {
    result.value = {
      status: 'error',
      timestamp: new Date().toLocaleString('zh-CN'),
      requestUrl: `${apiConfig.baseUrl}/health`,
      requestData: {},
      responseData: null,
      error: error.message
    }
  } finally {
    loading.value = false
  }
}

// 提交交易
const submitTransaction = async () => {
  // 验证必填字段
  if (!apiConfig.merchantId || !apiConfig.apiKey) {
    alert('请填写商户ID和API密钥')
    return
  }

  if (!transactionData.orderNo) {
    generateOrderNo()
  }

  if (!transactionData.amount || transactionData.amount <= 0) {
    alert('请输入有效的交易金额')
    return
  }

  loading.value = true

  try {
    const requestData = {
      merchantId: apiConfig.merchantId,
      orderNo: transactionData.orderNo,
      amount: transactionData.amount,
      currency: transactionData.currency,
      transactionType: transactionData.transactionType,
      description: transactionData.description,
      callbackUrl: transactionData.callbackUrl,
      timestamp: Date.now()
    }

    const response = await payKKaApi.submitTransaction(
      apiConfig.baseUrl,
      apiConfig.merchantId,
      apiConfig.apiKey,
      requestData
    )

    result.value = {
      status: 'success',
      timestamp: new Date().toLocaleString('zh-CN'),
      requestUrl: `${apiConfig.baseUrl}/api/transaction`,
      requestData: requestData,
      responseData: response
    }
  } catch (error) {
    result.value = {
      status: 'error',
      timestamp: new Date().toLocaleString('zh-CN'),
      requestUrl: `${apiConfig.baseUrl}/api/transaction`,
      requestData: transactionData,
      responseData: null,
      error: error.message
    }
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载商户配置
onMounted(() => {
  loadMerchantConfigs()
})
</script>

<style scoped>
.paykka-test {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.header-with-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
}

.back-button {
  position: absolute;
  left: 0;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateX(-2px);
}

.title {
  color: white;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  flex: 1;
}

.test-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.form-section h2,
.result-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.form-section h3 {
  color: #555;
  margin: 1.5rem 0 1rem 0;
  font-size: 1.2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
}

.textarea {
  resize: vertical;
  font-family: inherit;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.divider {
  height: 1px;
  background: #e0e0e0;
  margin: 1.5rem 0;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary,
.btn-info,
.btn-small {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-primary {
  background: #667eea;
  color: white;
  flex: 1;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  flex: 1;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-info {
  background: #17a2b8;
  color: white;
  flex: 1;
}

.btn-info:hover:not(:disabled) {
  background: #138496;
}

.btn-small {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.btn-small:hover {
  background: #5568d3;
}

.result-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 3rem 0;
}

.result-content {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.9rem;
}

.status-badge.success {
  background: #d4edda;
  color: #155724;
}

.status-badge.error {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.timestamp {
  color: #666;
  font-size: 0.9rem;
}

.result-item {
  margin-bottom: 1.5rem;
}

.result-item label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.code-block {
  background: #f4f4f4;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.6;
  border: 1px solid #e0e0e0;
  max-height: 300px;
  overflow-y: auto;
}

.result-item.error .code-block {
  background: #fff5f5;
  border-color: #fc8181;
}

.error-text {
  color: #c53030;
}

code {
  background: #f4f4f4;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9rem;
  word-break: break-all;
}

@media (max-width: 1024px) {
  .test-panel {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .button-group {
    flex-direction: column;
  }
}
</style>
