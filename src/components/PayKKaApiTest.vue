<template>
  <div class="paykka-test">
    <div class="container">
      <div class="header-with-back">
        <button @click="goBack" class="back-button">← 返回首页</button>
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
          <div class="form-group">
            <div class="json-header">
              <label>生成的请求参数 (Request Parameters)</label>
              <button @click="toggleJsonCollapse" class="btn-toggle-collapse" :title="isJsonCollapsed ? '展开' : '折叠'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path v-if="isJsonCollapsed" d="M9 18l6-6-6-6"/>
                  <path v-else d="M18 15l-6-6-6 6"/>
                </svg>
                {{ isJsonCollapsed ? '展开' : '折叠' }}
              </button>
            </div>
            <div v-show="!isJsonCollapsed" class="json-display-container">
              <textarea 
                v-model="editableJson" 
                class="json-edit"
                :placeholder="requestParamsJson"
                spellcheck="false"
              ></textarea>
              <div class="json-actions">
                <button @click="updateFormFromJson" class="btn-update" title="更新表单">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  更新表单
                </button>
                <button @click="copyJson" class="btn-copy" title="复制JSON">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  复制
                </button>
                <button @click="resetJson" class="btn-reset" title="重置JSON">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                  重置
                </button>
              </div>
            </div>
          </div>

          <div class="divider"></div>

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
    
    <!-- Toast 提示 -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import Toast from './Toast.vue'
import { payKKaApi } from '../services/paykkaApi'
import { showError, showSuccess } from '../utils/toast'
import { useNavigation } from '../composables/useNavigation'
import { useMerchantConfig } from '../composables/useMerchantConfig'

const { goHome: goBack } = useNavigation()

const loading = ref(false)

// API配置
const apiConfig = reactive({
  baseUrl: 'https://api.paykka.com',
  merchantId: '',
  apiKey: ''
})

// 使用商户配置 composable
const { merchantConfigs, selectedMerchantId, onMerchantChange, loadMerchantConfigs } = useMerchantConfig(apiConfig, { autoLoad: false })

// 商户选择变化时，更新 apiKey
watch(selectedMerchantId, () => {
  if (selectedMerchantId.value) {
    const config = merchantConfigs.value.find(c => c.merchantId === selectedMerchantId.value)
    if (config) {
      apiConfig.apiKey = config.privateKey // PayKKaApiTest使用apiKey，这里用privateKey填充
    }
  }
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

// JSON展示相关
const isJsonCollapsed = ref(false)
const editableJson = ref('')
const isManuallyEditingJson = ref(false) // 标记用户是否正在手动编辑JSON

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

// 计算生成的请求参数JSON
const requestParamsJson = computed(() => {
  const params = {
    merchantId: apiConfig.merchantId || '(未填写)',
    orderNo: transactionData.orderNo || '(未填写，将自动生成)',
    amount: transactionData.amount || 0,
    currency: transactionData.currency || 'USD',
    transactionType: transactionData.transactionType || 'payment',
    description: transactionData.description || '(未填写)',
    callbackUrl: transactionData.callbackUrl || '(未填写)',
    timestamp: Date.now()
  }
  return formatJson(params)
})

// 使用 watch 来同步JSON - 当表单数据变化时自动更新
watch(requestParamsJson, (newValue) => {
  // 如果用户没有手动编辑JSON，则自动同步更新
  if (!isManuallyEditingJson.value) {
    editableJson.value = newValue
  }
}, { immediate: true })

// 监听 editableJson 的变化，检测用户是否在手动编辑
watch(editableJson, (newValue) => {
  // 如果 editableJson 与 requestParamsJson 不同，说明用户正在手动编辑
  if (newValue && newValue.trim() !== '' && newValue !== requestParamsJson.value) {
    isManuallyEditingJson.value = true
  }
})

// 切换JSON折叠状态
const toggleJsonCollapse = () => {
  isJsonCollapsed.value = !isJsonCollapsed.value
}

// 重置JSON为当前表单值
const resetJson = () => {
  isManuallyEditingJson.value = false
  editableJson.value = requestParamsJson.value
}

// 从JSON更新表单
const updateFormFromJson = () => {
  try {
    const jsonText = editableJson.value.trim()
    if (!jsonText) {
      showError('JSON内容为空')
      return
    }
    
    const params = JSON.parse(jsonText)
    
    // 更新表单字段
    if (params.orderNo && params.orderNo !== '(未填写，将自动生成)') {
      transactionData.orderNo = params.orderNo
    }
    if (params.amount !== undefined && params.amount !== '(未填写)') {
      transactionData.amount = params.amount
    }
    if (params.currency && params.currency !== '(未填写)') {
      transactionData.currency = params.currency
    }
    if (params.transactionType && params.transactionType !== '(未填写)') {
      transactionData.transactionType = params.transactionType
    }
    if (params.description && params.description !== '(未填写)') {
      transactionData.description = params.description
    }
    if (params.callbackUrl && params.callbackUrl !== '(未填写)') {
      transactionData.callbackUrl = params.callbackUrl
    }
    if (params.merchantId && params.merchantId !== '(未填写)') {
      apiConfig.merchantId = params.merchantId
    }
    
    // 同步更新 editableJson，并清除手动编辑标记
    isManuallyEditingJson.value = false
    editableJson.value = requestParamsJson.value
    showSuccess('表单已更新')
  } catch (error) {
    showError(`JSON格式错误: ${error.message}`)
  }
}

// 降级复制方案（用于不支持 Clipboard API 的环境，如局域网 IP）
const fallbackCopyToClipboard = (text) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.width = '2em'
  textArea.style.height = '2em'
  textArea.style.padding = '0'
  textArea.style.border = 'none'
  textArea.style.outline = 'none'
  textArea.style.boxShadow = 'none'
  textArea.style.background = 'transparent'
  textArea.style.opacity = '0'
  textArea.style.zIndex = '-1'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    const successful = document.execCommand('copy')
    if (!successful) {
      throw new Error('execCommand copy failed')
    }
  } catch (err) {
    document.body.removeChild(textArea)
    throw err
  }
  
  document.body.removeChild(textArea)
}

// 复制JSON到剪贴板
const copyJson = async () => {
  try {
    const textToCopy = editableJson.value || requestParamsJson.value
    // 优先使用 Clipboard API（需要 HTTPS 或 localhost）
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy)
      showSuccess('JSON已复制到剪贴板')
    } else {
      // 降级方案：使用传统方法（适用于局域网 IP 等非安全上下文）
      fallbackCopyToClipboard(textToCopy)
      showSuccess('JSON已复制到剪贴板')
    }
  } catch (err) {
    // 如果 Clipboard API 失败，使用降级方案
    try {
      const textToCopy = editableJson.value || requestParamsJson.value
      fallbackCopyToClipboard(textToCopy)
      showSuccess('JSON已复制到剪贴板')
    } catch (e) {
      showError('复制失败，请手动复制')
    }
  }
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
    showError('请填写商户ID和API密钥')
    return
  }

  if (!transactionData.orderNo) {
    generateOrderNo()
  }

  if (!transactionData.amount || transactionData.amount <= 0) {
    showError('请输入有效的交易金额')
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

.json-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.json-header label {
  margin-bottom: 0;
}

.btn-toggle-collapse {
  padding: 0.4rem 0.8rem;
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s;
}

.btn-toggle-collapse:hover {
  background: #e0e0e0;
  border-color: #bbb;
}

.btn-toggle-collapse svg {
  width: 14px;
  height: 14px;
}

.json-display-container {
  position: relative;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.json-edit {
  width: 100%;
  min-height: 200px;
  max-height: 400px;
  padding: 1rem;
  margin: 0;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.85rem;
  line-height: 1.6;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  color: #333;
  resize: vertical;
  box-sizing: border-box;
}

.json-edit:focus {
  outline: 2px solid #667eea;
  outline-offset: -2px;
  background: #fff;
}

.json-actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f0f0f0;
  border-top: 1px solid #e0e0e0;
  justify-content: flex-end;
}

.btn-update,
.btn-copy,
.btn-reset {
  padding: 0.4rem 0.8rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s;
}

.btn-update:hover {
  background: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.btn-copy {
  background: #17a2b8;
}

.btn-copy:hover {
  background: #138496;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
}

.btn-reset {
  background: #6c757d;
}

.btn-reset:hover {
  background: #5a6268;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
}

.btn-update svg,
.btn-copy svg,
.btn-reset svg {
  width: 14px;
  height: 14px;
}

.json-display-container {
  position: relative;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.json-display {
  background: #f8f9fa;
  padding: 1rem;
  margin: 0;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.6;
  max-height: 400px;
  overflow-y: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  color: #333;
}

.btn-copy {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s;
  z-index: 10;
}

.btn-copy:hover {
  background: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.btn-copy svg {
  width: 14px;
  height: 14px;
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
