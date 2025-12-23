<template>
  <div class="checkout-test">
    <div class="container">
      <h1 class="title">PayKKa 收银台页面测试</h1>
      
      <div class="test-panel">
        <div class="form-section">
          <h2>API 配置</h2>
          
          <div class="form-row-3">
            <div class="form-group">
              <label>API 地址</label>
              <input 
                v-model="apiConfig.baseUrl" 
                type="text" 
                placeholder="https://openapi-dev.paykka.com"
                class="input-field"
              />
            </div>

            <div class="form-group">
              <label>商户ID (Merchant ID)</label>
              <input 
                v-model="apiConfig.merchantId" 
                type="text" 
                placeholder="请输入商户ID"
                class="input-field"
              />
            </div>

            <div class="form-group">
              <label>API密钥 (API Key / Secret Key)</label>
              <input 
                v-model="apiConfig.secretKey" 
                type="password" 
                placeholder="请输入API密钥"
                class="input-field"
              />
            </div>
          </div>

          <div class="divider"></div>

          <h3>收银台参数</h3>

          <div class="form-group">
            <label>订单号 (Order No / Trans ID)</label>
            <div class="input-with-button">
              <input 
                v-model="checkoutData.orderNo" 
                type="text" 
                placeholder="自动生成"
                class="input-field"
              />
              <button @click="generateOrderNo" class="btn-small">随机生成</button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>交易金额 (Amount)</label>
              <input 
                v-model.number="checkoutData.amount" 
                type="number" 
                step="0.01"
                placeholder="0.00"
                class="input-field"
              />
              <button @click="generateRandomAmount" class="btn-small">随机金额</button>
            </div>

            <div class="form-group">
              <label>币种 (Currency)</label>
              <select v-model="checkoutData.currency" class="input-field">
                <option value="USD">USD - 美元</option>
                <option value="EUR">EUR - 欧元</option>
                <option value="GBP">GBP - 英镑</option>
                <option value="CNY">CNY - 人民币</option>
                <option value="JPY">JPY - 日元</option>
                <option value="HKD">HKD - 港币</option>
                <option value="SGD">SGD - 新加坡元</option>
              </select>
              <button @click="generateRandomCurrency" class="btn-small">随机币种</button>
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>会话模式 (Session Mode)</label>
              <select v-model="checkoutData.sessionMode" class="input-field">
                <option value="HOSTED">HOSTED - 托管模式</option>
                <option value="COMPONENT">COMPONENT - 组件模式</option>
                <option value="DROP_IN">DROP_IN - 嵌入模式</option>
              </select>
              <button @click="generateRandomSessionMode" class="btn-small">随机模式</button>
            </div>

            <div class="form-group">
              <label>商品描述 (Description)</label>
              <textarea 
                v-model="checkoutData.description" 
                placeholder="请输入商品描述"
                class="input-field textarea"
                rows="2"
              ></textarea>
              <button @click="generateRandomDescription" class="btn-small">随机描述</button>
            </div>
          </div>

          <div class="form-group">
            <label>支付方式 (Payment Methods)</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="checkoutData.paymentMethods" value="card" />
                <span>信用卡 (Card)</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="checkoutData.paymentMethods" value="alipay" />
                <span>支付宝 (Alipay)</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="checkoutData.paymentMethods" value="wechat" />
                <span>微信支付 (WeChat)</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="checkoutData.paymentMethods" value="bank_transfer" />
                <span>银行转账 (Bank Transfer)</span>
              </label>
            </div>
            <button @click="generateRandomPaymentMethods" class="btn-small">随机选择</button>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label>回调地址 (Callback URL)</label>
              <input 
                v-model="checkoutData.callbackUrl" 
                type="text" 
                placeholder="https://your-domain.com/callback"
                class="input-field"
              />
            </div>

            <div class="form-group">
              <label>成功返回地址 (Return URL)</label>
              <input 
                v-model="checkoutData.returnUrl" 
                type="text" 
                placeholder="https://your-domain.com/success"
                class="input-field"
              />
            </div>

            <div class="form-group">
              <label>失败返回地址 (Cancel URL)</label>
              <input 
                v-model="checkoutData.cancelUrl" 
                type="text" 
                placeholder="https://your-domain.com/cancel"
                class="input-field"
              />
            </div>
          </div>

          <div class="form-group">
            <label>客户信息 (Customer Info)</label>
            <div class="form-row-3">
              <div class="form-group">
                <label>客户邮箱 (Email)</label>
                <div class="input-with-button">
                  <input 
                    v-model="checkoutData.customerEmail" 
                    type="email" 
                    placeholder="customer@example.com"
                    class="input-field"
                  />
                  <button @click="generateRandomEmail" class="btn-small">随机</button>
                </div>
              </div>
              <div class="form-group">
                <label>客户电话 (Phone)</label>
                <div class="input-with-button">
                  <input 
                    v-model="checkoutData.customerPhone" 
                    type="text" 
                    placeholder="13800138000"
                    class="input-field"
                  />
                  <button @click="generateRandomPhone" class="btn-small">随机</button>
                </div>
              </div>
              <div class="form-group">
                <label>客户姓名 (Name)</label>
                <div class="input-with-button">
                  <input 
                    v-model="checkoutData.customerName" 
                    type="text" 
                    placeholder="客户姓名"
                    class="input-field"
                  />
                  <button @click="generateRandomName" class="btn-small">随机</button>
                </div>
              </div>
            </div>
            <div class="form-row-3">
              <div class="form-group">
                <label>客户ID (Customer ID)</label>
                <div class="input-with-button">
                  <input 
                    v-model="checkoutData.customerId" 
                    type="text" 
                    placeholder="客户ID"
                    class="input-field"
                  />
                  <button @click="generateRandomCustomerId" class="btn-small">随机</button>
                </div>
              </div>
              <div class="form-group">
                <label>国家代码 (Country)</label>
                <div class="input-with-button">
                  <select v-model="checkoutData.country" class="input-field">
                    <option value="">请选择</option>
                    <option value="CN">CN - 中国</option>
                    <option value="US">US - 美国</option>
                    <option value="GB">GB - 英国</option>
                    <option value="JP">JP - 日本</option>
                    <option value="SG">SG - 新加坡</option>
                    <option value="HK">HK - 香港</option>
                  </select>
                  <button @click="generateRandomCountry" class="btn-small">随机</button>
                </div>
              </div>
              <div class="form-group">
                <label>语言 (Language)</label>
                <div class="input-with-button">
                  <select v-model="checkoutData.language" class="input-field">
                    <option value="">请选择</option>
                    <option value="zh-CN">zh-CN - 简体中文</option>
                    <option value="zh-TW">zh-TW - 繁体中文</option>
                    <option value="en-US">en-US - 英语</option>
                    <option value="ja-JP">ja-JP - 日语</option>
                  </select>
                  <button @click="generateRandomLanguage" class="btn-small">随机</button>
                </div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <h3>高级参数</h3>

          <div class="form-row-3">
            <div class="form-group">
              <label>时间戳 (Timestamp)</label>
              <div class="input-with-button">
                <input 
                  v-model.number="checkoutData.timestamp" 
                  type="number" 
                  placeholder="自动生成"
                  class="input-field"
                />
                <button @click="generateTimestamp" class="btn-small">生成</button>
              </div>
            </div>
            <div class="form-group">
              <label>随机数 (Nonce)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.nonce" 
                  type="text" 
                  placeholder="自动生成"
                  class="input-field"
                />
                <button @click="generateNonce" class="btn-small">生成</button>
              </div>
            </div>
            <div class="form-group">
              <label>超时时间 (Timeout 秒)</label>
              <div class="input-with-button">
                <input 
                  v-model.number="checkoutData.timeout" 
                  type="number" 
                  placeholder="1800"
                  class="input-field"
                />
                <button @click="generateRandomTimeout" class="btn-small">随机</button>
              </div>
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label>商品ID (Product ID)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.productId" 
                  type="text" 
                  placeholder="商品ID"
                  class="input-field"
                />
                <button @click="generateRandomProductId" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>商品类别 (Product Category)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.productCategory" 
                  type="text" 
                  placeholder="商品类别"
                  class="input-field"
                />
                <button @click="generateRandomCategory" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>备注 (Remark)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.remark" 
                  type="text" 
                  placeholder="备注信息"
                  class="input-field"
                />
                <button @click="generateRandomRemark" class="btn-small">随机</button>
              </div>
            </div>
          </div>

          <div class="button-group">
            <button @click="generateAllRandom" class="btn-random">一键随机生成所有参数</button>
            <button @click="createCheckout" :disabled="loading" class="btn-primary">
              {{ loading ? '创建中...' : '创建收银台' }}
            </button>
            <button @click="resetForm" class="btn-secondary">重置表单</button>
          </div>
        </div>

        <div class="result-section">
          <h2>测试结果</h2>
          
          <div v-if="!result" class="empty-state">
            <p>暂无测试结果，请创建收银台进行测试</p>
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
                <label>请求参数 (签名前):</label>
                <pre class="code-block">{{ formatJson(result.requestDataBeforeSign) }}</pre>
              </div>

              <div class="result-item">
                <label>签名 (Signature):</label>
                <code class="signature-code">{{ result.signature }}</code>
              </div>

              <div class="result-item">
                <label>最终请求参数 (含签名):</label>
                <pre class="code-block">{{ formatJson(result.requestData) }}</pre>
              </div>

              <div class="result-item">
                <label>响应数据:</label>
                <pre class="code-block">{{ formatJson(result.responseData) }}</pre>
              </div>

              <div v-if="result.checkoutUrl" class="result-item success">
                <label>收银台URL:</label>
                <a :href="result.checkoutUrl" target="_blank" class="checkout-link">
                  {{ result.checkoutUrl }}
                </a>
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
import { ref, reactive } from 'vue'
import { payKKaCheckoutApi } from '../services/paykkaCheckoutApi'

const loading = ref(false)

const apiConfig = reactive({
  baseUrl: 'https://openapi-dev.paykka.com',
  merchantId: '',
  secretKey: ''
})

const checkoutData = reactive({
  orderNo: '',
  amount: 0,
  currency: 'USD',
  sessionMode: 'HOSTED',
  paymentMethods: [],
  description: '',
  callbackUrl: '',
  returnUrl: '',
  cancelUrl: '',
  customerEmail: '',
  customerPhone: '',
  customerName: '',
  customerId: '',
  country: '',
  language: '',
  timestamp: Date.now(),
  nonce: '',
  timeout: 1800,
  productId: '',
  productCategory: '',
  remark: ''
})

const result = ref(null)

// 随机生成订单号
const generateOrderNo = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 100000)
  checkoutData.orderNo = `PK${timestamp}${random}`
}

// 随机生成金额
const generateRandomAmount = () => {
  const min = 1
  const max = 10000
  const decimals = 2
  checkoutData.amount = parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

// 随机生成币种
const generateRandomCurrency = () => {
  const currencies = ['USD', 'EUR', 'GBP', 'CNY', 'JPY', 'HKD', 'SGD']
  checkoutData.currency = currencies[Math.floor(Math.random() * currencies.length)]
}

// 随机生成会话模式
const generateRandomSessionMode = () => {
  const modes = ['HOSTED', 'COMPONENT', 'DROP_IN']
  checkoutData.sessionMode = modes[Math.floor(Math.random() * modes.length)]
}

// 随机生成支付方式
const generateRandomPaymentMethods = () => {
  const allMethods = ['card', 'alipay', 'wechat', 'bank_transfer']
  const count = Math.floor(Math.random() * allMethods.length) + 1
  const shuffled = [...allMethods].sort(() => 0.5 - Math.random())
  checkoutData.paymentMethods = shuffled.slice(0, count)
}

// 随机生成商品描述
const generateRandomDescription = () => {
  const descriptions = [
    '电子产品购买',
    '在线课程订阅',
    '软件服务费用',
    '商品购买订单',
    '服务费用支付',
    '会员订阅费用',
    '数字产品购买',
    '在线服务费用'
  ]
  checkoutData.description = descriptions[Math.floor(Math.random() * descriptions.length)]
}

// 随机生成邮箱
const generateRandomEmail = () => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'qq.com', '163.com']
  const randomNum = Math.floor(Math.random() * 10000)
  checkoutData.customerEmail = `customer${randomNum}@${domains[Math.floor(Math.random() * domains.length)]}`
}

// 随机生成电话
const generateRandomPhone = () => {
  const phonePrefixes = ['138', '139', '150', '151', '186', '188', '159', '177']
  const phoneSuffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
  checkoutData.customerPhone = `${phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)]}${phoneSuffix}`
}

// 随机生成姓名
const generateRandomName = () => {
  const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴']
  const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰']
  checkoutData.customerName = `${surnames[Math.floor(Math.random() * surnames.length)]}${names[Math.floor(Math.random() * names.length)]}`
}

// 随机生成客户ID
const generateRandomCustomerId = () => {
  checkoutData.customerId = `CUST${Date.now()}${Math.floor(Math.random() * 1000)}`
}

// 随机生成国家
const generateRandomCountry = () => {
  const countries = ['CN', 'US', 'GB', 'JP', 'SG', 'HK']
  checkoutData.country = countries[Math.floor(Math.random() * countries.length)]
}

// 随机生成语言
const generateRandomLanguage = () => {
  const languages = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP']
  checkoutData.language = languages[Math.floor(Math.random() * languages.length)]
}

// 生成时间戳
const generateTimestamp = () => {
  checkoutData.timestamp = Date.now()
}

// 生成随机数
const generateNonce = () => {
  checkoutData.nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// 随机生成超时时间
const generateRandomTimeout = () => {
  const timeouts = [600, 900, 1800, 3600, 7200]
  checkoutData.timeout = timeouts[Math.floor(Math.random() * timeouts.length)]
}

// 随机生成商品ID
const generateRandomProductId = () => {
  checkoutData.productId = `PROD${Date.now()}${Math.floor(Math.random() * 100)}`
}

// 随机生成商品类别
const generateRandomCategory = () => {
  const categories = ['电子产品', '服装', '食品', '图书', '家居', '运动', '美妆', '汽车']
  checkoutData.productCategory = categories[Math.floor(Math.random() * categories.length)]
}

// 随机生成备注
const generateRandomRemark = () => {
  const remarks = ['测试订单', 'VIP客户', '优先处理', '批量订单', '特殊要求', '加急处理', '']
  checkoutData.remark = remarks[Math.floor(Math.random() * remarks.length)]
}

// 一键随机生成所有参数
const generateAllRandom = () => {
  generateOrderNo()
  generateRandomAmount()
  generateRandomCurrency()
  generateRandomSessionMode()
  generateRandomPaymentMethods()
  generateRandomDescription()
  generateRandomEmail()
  generateRandomPhone()
  generateRandomName()
  generateRandomCustomerId()
  generateRandomCountry()
  generateRandomLanguage()
  generateTimestamp()
  generateNonce()
  generateRandomTimeout()
  generateRandomProductId()
  generateRandomCategory()
  generateRandomRemark()
  
  checkoutData.callbackUrl = 'https://example.com/callback'
  checkoutData.returnUrl = 'https://example.com/success'
  checkoutData.cancelUrl = 'https://example.com/cancel'
}

// 格式化JSON
const formatJson = (obj) => {
  if (!obj) return ''
  return JSON.stringify(obj, null, 2)
}

// 重置表单
const resetForm = () => {
  checkoutData.orderNo = ''
  checkoutData.amount = 0
  checkoutData.currency = 'USD'
  checkoutData.sessionMode = 'HOSTED'
  checkoutData.paymentMethods = []
  checkoutData.description = ''
  checkoutData.callbackUrl = ''
  checkoutData.returnUrl = ''
  checkoutData.cancelUrl = ''
  checkoutData.customerEmail = ''
  checkoutData.customerPhone = ''
  checkoutData.customerName = ''
  checkoutData.customerId = ''
  checkoutData.country = ''
  checkoutData.language = ''
  checkoutData.timestamp = Date.now()
  checkoutData.nonce = ''
  checkoutData.timeout = 1800
  checkoutData.productId = ''
  checkoutData.productCategory = ''
  checkoutData.remark = ''
  result.value = null
}

// 创建收银台
const createCheckout = async () => {
  // 验证必填字段
  if (!apiConfig.merchantId || !apiConfig.secretKey) {
    alert('请填写商户ID和API密钥')
    return
  }

  if (!checkoutData.orderNo) {
    generateOrderNo()
  }

  if (!checkoutData.amount || checkoutData.amount <= 0) {
    alert('请输入有效的交易金额')
    return
  }

  if (checkoutData.paymentMethods.length === 0) {
    alert('请至少选择一种支付方式')
    return
  }

  loading.value = true

  try {
    // 如果没有时间戳和随机数，自动生成
    if (!checkoutData.timestamp) {
      checkoutData.timestamp = Date.now()
    }
    if (!checkoutData.nonce) {
      checkoutData.nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    const requestData = {
      merchantId: apiConfig.merchantId,
      orderNo: checkoutData.orderNo,
      amount: checkoutData.amount,
      currency: checkoutData.currency,
      sessionMode: checkoutData.sessionMode,
      paymentMethods: checkoutData.paymentMethods,
      description: checkoutData.description || `订单 ${checkoutData.orderNo}`,
      callbackUrl: checkoutData.callbackUrl || '',
      returnUrl: checkoutData.returnUrl || '',
      cancelUrl: checkoutData.cancelUrl || '',
      customerEmail: checkoutData.customerEmail || '',
      customerPhone: checkoutData.customerPhone || '',
      customerName: checkoutData.customerName || '',
      customerId: checkoutData.customerId || '',
      country: checkoutData.country || '',
      language: checkoutData.language || '',
      timestamp: checkoutData.timestamp,
      nonce: checkoutData.nonce,
      timeout: checkoutData.timeout || 1800,
      productId: checkoutData.productId || '',
      productCategory: checkoutData.productCategory || '',
      remark: checkoutData.remark || ''
    }

    // 保存签名前的数据
    const requestDataBeforeSign = JSON.parse(JSON.stringify(requestData))

    const response = await payKKaCheckoutApi.createCheckout(
      apiConfig.baseUrl,
      apiConfig.merchantId,
      apiConfig.secretKey,
      requestData
    )

    result.value = {
      status: 'success',
      timestamp: new Date().toLocaleString('zh-CN'),
      requestUrl: `${apiConfig.baseUrl}/api/v3/checkout/create`,
      requestDataBeforeSign: requestDataBeforeSign,
      signature: response.signature,
      requestData: response.signedData,
      responseData: response.data,
      checkoutUrl: response.checkoutUrl
    }
  } catch (error) {
    result.value = {
      status: 'error',
      timestamp: new Date().toLocaleString('zh-CN'),
      requestUrl: `${apiConfig.baseUrl}/api/v3/checkout/create`,
      requestDataBeforeSign: checkoutData,
      requestData: null,
      responseData: null,
      error: error.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.checkout-test {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0.8rem 1rem;
  width: 100%;
  box-sizing: border-box;
}

.container {
  width: 100%;
  margin: 0;
  max-width: 100%;
}

.title {
  color: white;
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 0.8rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  font-weight: 600;
  padding: 0;
}

.test-panel {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.5rem;
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  min-height: calc(100vh - 100px);
  max-height: calc(100vh - 100px);
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.form-section {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100vh - 150px);
  padding-right: 1rem;
}

.form-section::-webkit-scrollbar {
  width: 8px;
}

.form-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.form-section::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

.form-section::-webkit-scrollbar-thumb:hover {
  background: #5568d3;
}

.form-section h2,
.result-section h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
  font-weight: 600;
}

.form-section h3 {
  color: #555;
  margin: 1.5rem 0 0.8rem 0;
  font-size: 1.2rem;
  font-weight: 500;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.input-field {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.3s;
  box-sizing: border-box;
  background: #fff;
  line-height: 1.5;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-field:hover {
  border-color: #ccc;
}

.textarea {
  resize: vertical;
  font-family: inherit;
  min-height: 100px;
  line-height: 1.6;
}

.input-with-button {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.input-with-button .input-field {
  flex: 1;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-row-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  margin: 1.5rem 0;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.8rem;
  margin-top: 0.6rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 2px solid #e0e0e0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  padding: 0.8rem;
  border-radius: 6px;
  transition: all 0.3s;
  font-size: 1rem;
  font-weight: 500;
}

.checkbox-label:hover {
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin: 0;
  cursor: pointer;
  accent-color: #667eea;
}

.button-group {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e0e0e0;
}

.btn-primary,
.btn-secondary,
.btn-random,
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
  padding: 0.85rem 1.2rem;
  font-size: 1rem;
  min-width: 140px;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  flex: 1;
  padding: 0.85rem 1.2rem;
  font-size: 1rem;
  min-width: 140px;
}

.btn-secondary:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.btn-random {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  flex: 1;
  padding: 0.85rem 1.2rem;
  font-size: 1rem;
  min-width: 140px;
}

.btn-random:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 87, 108, 0.4);
}

.btn-small {
  padding: 0.7rem 1.4rem;
  background: #667eea;
  color: white;
  font-size: 0.95rem;
  margin-top: 0.6rem;
  width: auto;
  white-space: nowrap;
  font-weight: 500;
}

.btn-small:hover {
  background: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-small:hover {
  background: #5568d3;
}

.result-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  overflow-x: hidden;
  position: sticky;
  top: 0;
  border: 2px solid #e0e0e0;
}

.result-section::-webkit-scrollbar {
  width: 8px;
}

.result-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.result-section::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

.result-section::-webkit-scrollbar-thumb:hover {
  background: #5568d3;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 4rem 2rem;
  font-size: 1.1rem;
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
  margin-bottom: 1.8rem;
}

.result-item label {
  display: block;
  margin-bottom: 0.8rem;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
  color: #555;
}

.code-block {
  background: #f4f4f4;
  padding: 1.2rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.9rem;
  line-height: 1.7;
  border: 1px solid #e0e0e0;
  max-height: 350px;
  overflow-y: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
}

.code-block::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.code-block::-webkit-scrollbar-track {
  background: #e8e8e8;
  border-radius: 3px;
}

.code-block::-webkit-scrollbar-thumb {
  background: #999;
  border-radius: 3px;
}

.result-item.error .code-block {
  background: #fff5f5;
  border-color: #fc8181;
}

.error-text {
  color: #c53030;
}

.result-item.success {
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #bae6fd;
}

.checkout-link {
  color: #667eea;
  text-decoration: none;
  word-break: break-all;
  display: inline-block;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #667eea;
}

.checkout-link:hover {
  background: #667eea;
  color: white;
}

.signature-code {
  background: #fff3cd;
  padding: 0.8rem 1.2rem;
  border-radius: 6px;
  font-size: 0.95rem;
  word-break: break-all;
  display: block;
  border: 2px solid #ffc107;
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  margin-top: 0.5rem;
}

code {
  background: #f4f4f4;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.95rem;
  word-break: break-all;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  border: 1px solid #e0e0e0;
}

/* 桌面端优化 - 充分利用横向空间，减少留白 */
@media (min-width: 1600px) {
  .checkout-test {
    padding: 1rem 1.5rem;
  }

  .test-panel {
    grid-template-columns: 1.6fr 1fr;
    gap: 1.5rem;
    padding: 1.8rem;
  }
}

/* 标准桌面 */
@media (min-width: 1280px) and (max-width: 1599px) {
  .checkout-test {
    padding: 0.8rem 1rem;
  }

  .test-panel {
    grid-template-columns: 1.5fr 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }
}

/* 小屏桌面 - 调整列数 */
@media (min-width: 1024px) and (max-width: 1279px) {
  .checkout-test {
    padding: 0.8rem 1rem;
  }

  .test-panel {
    grid-template-columns: 1.4fr 1fr;
    gap: 1.2rem;
    padding: 1.5rem;
  }

  .form-row-3 {
    grid-template-columns: 1fr 1fr;
  }

  .checkbox-group {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
