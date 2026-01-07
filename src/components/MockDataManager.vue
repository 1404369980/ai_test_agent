<template>
  <div class="mock-data-manager">
    <div class="container">
      <div class="header-with-back">
        <button @click="goBack" class="back-button">← 返回首页</button>
        <h1 class="title">参数 Mock 数据管理</h1>
        <div class="header-actions-top">
          <div class="export-actions">
            <input 
              type="number" 
              v-model.number="exportGenerateCount" 
              min="1" 
              max="100" 
              class="count-input"
              placeholder="数量"
            />
            <button @click="generateAndExportMockData" class="btn-export">📥 生成并导出JSON</button>
          </div>
        </div>
      </div>
      
      <div class="mock-panel">
        <!-- JSON数据展示 -->
        <div class="mock-section">
          <div class="section-header">
            <h2>预设Mock数据</h2>
            <div class="header-actions">
              <button @click="loadJsonData" class="btn-primary" :disabled="loadingJson">🔄 刷新数据</button>
            </div>
          </div>
          
          <div v-if="loadingJson" class="loading-state">
            <p>正在加载数据...</p>
          </div>
          
          <div v-else-if="jsonData && jsonData.personalInfo && jsonData.personalInfo.length > 0" class="json-data-section">
            <!-- 个人信息表格 -->
            <div class="table-section">
              <h3>个人信息 ({{ jsonData.personalInfo.length }}条)</h3>
              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>姓名</th>
                      <th>邮箱</th>
                      <th>电话</th>
                      <th>地址</th>
                      <th>国家</th>
                      <th>省/州</th>
                      <th>城市</th>
                      <th>邮编</th>
                      <th>区号</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in jsonData.personalInfo" :key="index">
                      <td>{{ item.firstName }} {{ item.lastName }}</td>
                      <td>{{ item.email }}</td>
                      <td>{{ item.phone }}</td>
                      <td>{{ item.addressLine1 }}</td>
                      <td>{{ item.country }}</td>
                      <td>{{ item.state }}</td>
                      <td>{{ item.city }}</td>
                      <td>{{ item.postalCode }}</td>
                      <td>{{ item.areaCode }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- 信用卡信息表格 -->
            <div v-if="jsonData.cardInfo && jsonData.cardInfo.length > 0" class="table-section">
              <h3>信用卡信息 ({{ jsonData.cardInfo.length }}条)</h3>
              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>持卡人姓名</th>
                      <th>持卡人邮箱</th>
                      <th>卡号</th>
                      <th>CVV</th>
                      <th>过期日期</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in jsonData.cardInfo" :key="index">
                      <td>{{ item.holderName }}</td>
                      <td>{{ item.holderEmail }}</td>
                      <td>{{ item.cardNo }}</td>
                      <td>{{ item.cvv }}</td>
                      <td>{{ item.expMonth }}/{{ item.expYear }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div v-if="jsonData.generatedAt" class="json-meta">
              <p><strong>生成时间:</strong> {{ formatJsonDate(jsonData.generatedAt) }}</p>
              <p v-if="jsonData.count">
                <strong>统计:</strong> 
                个人信息 {{ jsonData.count.personalInfo || jsonData.personalInfo.length }}条, 
                信用卡 {{ jsonData.count.cardInfo || jsonData.cardInfo.length }}条
                <span v-if="jsonData.count.china"> (中国: {{ jsonData.count.china }}条, 国际: {{ jsonData.count.international }}条)</span>
              </p>
            </div>
          </div>
          
          <div v-else-if="!loadingJson" class="empty-state">
            <p>暂无预设数据</p>
            <p class="empty-state-desc">点击"刷新数据"按钮从文件加载数据</p>
          </div>
        </div>
        
        <!-- 用户个人信息 -->
        <div class="mock-section">
          <div class="section-header">
            <h2>用户个人信息</h2>
            <div class="header-actions">
              <button @click="showPersonalForm = true" class="btn-primary">+ 添加</button>
            </div>
          </div>
          
          <div v-if="personalInfoList.length === 0" class="empty-state">
            <p>暂无用户个人信息数据</p>
            <p class="empty-state-desc">点击"添加"创建数据，此数据可在收货、账单信息的选择预设框中使用</p>
          </div>
          
          <div v-else class="data-list">
            <div 
              v-for="(item, index) in personalInfoList" 
              :key="item.id || index"
              class="data-item"
            >
              <div class="data-item-info">
                <div class="data-item-header">
                  <strong>{{ item.firstName }} {{ item.lastName }}</strong>
                  <span class="data-item-meta">{{ formatDate(item.createdAt) }}</span>
                </div>
                <div class="data-item-details">
                  <span>📧 {{ item.email }}</span>
                  <span>📞 {{ item.phone }}</span>
                  <span>📍 {{ item.city }}, {{ item.country }}</span>
                </div>
              </div>
              <div class="data-item-actions">
                <button @click="editPersonalInfo(item)" class="btn-edit">编辑</button>
                <button @click="deletePersonalInfo(item.id)" class="btn-delete">删除</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 信用卡Mock数据 -->
        <div class="mock-section">
          <div class="section-header">
            <h2>信用卡 Mock 数据</h2>
            <div class="header-actions">
              <button @click="showCardForm = true" class="btn-primary">+ 添加</button>
            </div>
          </div>
          
          <div v-if="cardInfoList.length === 0" class="empty-state">
            <p>暂无信用卡数据</p>
            <p class="empty-state-desc">点击"批量生成"或"添加"创建数据</p>
          </div>
          
          <div v-else class="data-list">
            <div 
              v-for="(item, index) in cardInfoList" 
              :key="item.id || index"
              class="data-item"
            >
              <div class="data-item-info">
                <div class="data-item-header">
                  <strong>{{ item.holderName }}</strong>
                  <span class="data-item-meta">{{ formatDate(item.createdAt) }}</span>
                </div>
                <div class="data-item-details">
                  <span>💳 ****{{ item.cardNo ? item.cardNo.slice(-4) : '****' }}</span>
                  <span>📧 {{ item.holderEmail }}</span>
                  <span>📅 {{ item.expMonth }}/{{ item.expYear }}</span>
                </div>
              </div>
              <div class="data-item-actions">
                <button @click="editCardInfo(item)" class="btn-edit">编辑</button>
                <button @click="deleteCardInfo(item.id)" class="btn-delete">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 个人信息表单弹窗 -->
    <div v-if="showPersonalForm" class="modal-overlay" @click.self="closePersonalForm">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingPersonalIndex !== null ? '编辑个人信息' : '添加个人信息' }}</h3>
          <button @click="closePersonalForm" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row-2">
            <div class="form-group">
              <label>名 (First Name) <span class="required">*</span></label>
              <input v-model="personalForm.firstName" type="text" placeholder="John" class="input-field" />
            </div>
            <div class="form-group">
              <label>姓 (Last Name) <span class="required">*</span></label>
              <input v-model="personalForm.lastName" type="text" placeholder="Doe" class="input-field" />
            </div>
          </div>
          
          <div class="form-row-2">
            <div class="form-group">
              <label>邮箱 (Email) <span class="required">*</span></label>
              <input v-model="personalForm.email" type="email" placeholder="john.doe@example.com" class="input-field" />
            </div>
            <div class="form-group">
              <label>电话 (Phone) <span class="required">*</span></label>
              <input v-model="personalForm.phone" type="text" placeholder="+1 622 5406475" class="input-field" />
            </div>
          </div>
          
          <div class="form-group">
            <label>地址 (Address Line1)</label>
            <input v-model="personalForm.addressLine1" type="text" placeholder="123 Main Street" class="input-field" />
          </div>
          
          <div class="form-row-3">
            <div class="form-group">
              <label>国家 (Country)</label>
              <input v-model="personalForm.country" type="text" placeholder="US" class="input-field" />
            </div>
            <div class="form-group">
              <label>州/省 (State)</label>
              <input v-model="personalForm.state" type="text" placeholder="California" class="input-field" />
            </div>
            <div class="form-group">
              <label>城市 (City)</label>
              <input v-model="personalForm.city" type="text" placeholder="Los Angeles" class="input-field" />
            </div>
          </div>
          
          <div class="form-row-2">
            <div class="form-group">
              <label>邮编 (Postal Code)</label>
              <input v-model="personalForm.postalCode" type="text" placeholder="90001" class="input-field" />
            </div>
            <div class="form-group">
              <label>区号 (Area Code)</label>
              <input v-model="personalForm.areaCode" type="text" placeholder="310" class="input-field" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="savePersonalInfo" class="btn-primary" :disabled="!isPersonalFormValid">保存</button>
          <button @click="closePersonalForm" class="btn-secondary">取消</button>
        </div>
      </div>
    </div>
    
    <!-- 信用卡表单弹窗 -->
    <div v-if="showCardForm" class="modal-overlay" @click.self="closeCardForm">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingCardIndex !== null ? '编辑信用卡' : '添加信用卡' }}</h3>
          <button @click="closeCardForm" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row-2">
            <div class="form-group">
              <label>卡号 (Card No) <span class="required">*</span></label>
              <input v-model="cardForm.cardNo" type="text" placeholder="4242424242424242" maxlength="19" class="input-field" />
            </div>
            <div class="form-group">
              <label>持卡人姓名 (Holder Name) <span class="required">*</span></label>
              <input v-model="cardForm.holderName" type="text" placeholder="Winifred Reopell" class="input-field" />
            </div>
          </div>
          
          <div class="form-row-2">
            <div class="form-group">
              <label>持卡人邮箱 (Holder Email) <span class="required">*</span></label>
              <input v-model="cardForm.holderEmail" type="email" placeholder="zhangsan@test.com" class="input-field" />
            </div>
            <div class="form-group">
              <label>CVV <span class="required">*</span></label>
              <input v-model="cardForm.cvv" type="text" placeholder="123" maxlength="4" class="input-field" />
            </div>
          </div>
          
          <div class="form-row-2">
            <div class="form-group">
              <label>过期年份 (Exp Year) <span class="required">*</span></label>
              <input v-model="cardForm.expYear" type="text" placeholder="2029" maxlength="4" class="input-field" />
            </div>
            <div class="form-group">
              <label>过期月份 (Exp Month) <span class="required">*</span></label>
              <input v-model="cardForm.expMonth" type="text" placeholder="03" maxlength="2" class="input-field" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="saveCardInfo" class="btn-primary" :disabled="!isCardFormValid">保存</button>
          <button @click="closeCardForm" class="btn-secondary">取消</button>
        </div>
      </div>
    </div>
    
    <!-- Toast 提示 -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Toast from './Toast.vue'
import {
  getAllPersonalInfo,
  saveAllPersonalInfo,
  addPersonalInfo,
  updatePersonalInfo,
  deletePersonalInfo as deletePersonalInfoUtil
} from '../services/mockDataManager'
import {
  getAllCardInfo,
  saveAllCardInfo,
  addCardInfo,
  updateCardInfo,
  deleteCardInfo as deleteCardInfoUtil
} from '../services/mockDataManager'
import { showError, showSuccess } from '../utils/toast'
import { useNavigation } from '../composables/useNavigation'
import {
  generateRandomFirstName,
  generateRandomLastName,
  generateRandomEmail,
  generateRandomPhone,
  generateRandomAddress,
  generateRandomCountry,
  generateRandomState,
  generateRandomCity,
  generateRandomPostalCode,
  generateRandomAreaCode
} from '../services/utils'

// 注意：批量生成功能已移除，仅保留手动添加功能

const { goHome: goBack } = useNavigation()

const personalInfoList = ref([])
const cardInfoList = ref([])
const showPersonalForm = ref(false)
const showCardForm = ref(false)
const editingPersonalIndex = ref(null)
const editingCardIndex = ref(null)
const exportGenerateCount = ref(10)
const jsonData = ref(null)
const loadingJson = ref(false)

const personalForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  addressLine1: '',
  country: '',
  state: '',
  city: '',
  postalCode: '',
  areaCode: ''
})

const cardForm = reactive({
  cardNo: '',
  holderName: '',
  holderEmail: '',
  cvv: '',
  expYear: '',
  expMonth: ''
})

const isPersonalFormValid = computed(() => {
  return personalForm.firstName.trim() !== '' &&
         personalForm.lastName.trim() !== '' &&
         personalForm.email.trim() !== '' &&
         personalForm.phone.trim() !== ''
})

const isCardFormValid = computed(() => {
  return cardForm.cardNo.trim() !== '' &&
         cardForm.holderName.trim() !== '' &&
         cardForm.holderEmail.trim() !== '' &&
         cardForm.cvv.trim() !== '' &&
         cardForm.expYear.trim() !== '' &&
         cardForm.expMonth.trim() !== ''
})

// 加载数据
const loadData = () => {
  personalInfoList.value = getAllPersonalInfo()
  cardInfoList.value = getAllCardInfo()
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return dateString
  }
}

// 格式化JSON日期
const formatJsonDate = (dateString) => {
  if (!dateString) return '未知'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (e) {
    return dateString
  }
}

// 加载JSON数据
const loadJsonData = async () => {
  loadingJson.value = true
  try {
    const response = await fetch('/mock-data/mock_data.json')
    if (!response.ok) {
      throw new Error('加载JSON文件失败')
    }
    const data = await response.json()
    jsonData.value = data
    showSuccess(`成功加载 ${data.personalInfo?.length || 0} 条个人信息和 ${data.cardInfo?.length || 0} 条信用卡数据`)
  } catch (error) {
    console.error('加载JSON数据失败:', error)
    showError('加载JSON数据失败: ' + error.message)
    jsonData.value = null
  } finally {
    loadingJson.value = false
  }
}


// 编辑个人信息
const editPersonalInfo = (item) => {
  editingPersonalIndex.value = personalInfoList.value.findIndex(p => p.id === item.id)
  personalForm.firstName = item.firstName || ''
  personalForm.lastName = item.lastName || ''
  personalForm.email = item.email || ''
  personalForm.phone = item.phone || ''
  personalForm.addressLine1 = item.addressLine1 || ''
  personalForm.country = item.country || ''
  personalForm.state = item.state || ''
  personalForm.city = item.city || ''
  personalForm.postalCode = item.postalCode || ''
  personalForm.areaCode = item.areaCode || ''
  showPersonalForm.value = true
}

// 保存个人信息
const savePersonalInfo = () => {
  if (!isPersonalFormValid.value) {
    showError('请填写必填字段')
    return
  }
  
  const personalInfo = {
    firstName: personalForm.firstName.trim(),
    lastName: personalForm.lastName.trim(),
    email: personalForm.email.trim(),
    phone: personalForm.phone.trim(),
    addressLine1: personalForm.addressLine1.trim(),
    country: personalForm.country.trim(),
    state: personalForm.state.trim(),
    city: personalForm.city.trim(),
    postalCode: personalForm.postalCode.trim(),
    areaCode: personalForm.areaCode.trim()
  }
  
  if (editingPersonalIndex.value !== null) {
    const item = personalInfoList.value[editingPersonalIndex.value]
    if (updatePersonalInfo(item.id, personalInfo)) {
      showSuccess('个人信息已更新')
      loadData()
      closePersonalForm()
    } else {
      showError('更新失败')
    }
  } else {
    if (addPersonalInfo(personalInfo)) {
      showSuccess('个人信息已添加')
      loadData()
      closePersonalForm()
    } else {
      showError('添加失败')
    }
  }
}

// 关闭个人信息表单
const closePersonalForm = () => {
  showPersonalForm.value = false
  editingPersonalIndex.value = null
  personalForm.firstName = ''
  personalForm.lastName = ''
  personalForm.email = ''
  personalForm.phone = ''
  personalForm.addressLine1 = ''
  personalForm.country = ''
  personalForm.state = ''
  personalForm.city = ''
  personalForm.postalCode = ''
  personalForm.areaCode = ''
}

// 删除个人信息
const deletePersonalInfo = (id) => {
  if (confirm('确定要删除这条个人信息吗？')) {
    if (deletePersonalInfoUtil(id)) {
      showSuccess('已删除')
      loadData()
    } else {
      showError('删除失败')
    }
  }
}

// 编辑信用卡
const editCardInfo = (item) => {
  editingCardIndex.value = cardInfoList.value.findIndex(c => c.id === item.id)
  cardForm.cardNo = item.cardNo || ''
  cardForm.holderName = item.holderName || ''
  cardForm.holderEmail = item.holderEmail || ''
  cardForm.cvv = item.cvv || ''
  cardForm.expYear = item.expYear || ''
  cardForm.expMonth = item.expMonth || ''
  showCardForm.value = true
}

// 保存信用卡
const saveCardInfo = () => {
  if (!isCardFormValid.value) {
    showError('请填写必填字段')
    return
  }
  
  const cardInfo = {
    cardNo: cardForm.cardNo.trim(),
    holderName: cardForm.holderName.trim(),
    holderEmail: cardForm.holderEmail.trim(),
    cvv: cardForm.cvv.trim(),
    expYear: cardForm.expYear.trim(),
    expMonth: cardForm.expMonth.trim()
  }
  
  if (editingCardIndex.value !== null) {
    const item = cardInfoList.value[editingCardIndex.value]
    if (updateCardInfo(item.id, cardInfo)) {
      showSuccess('信用卡已更新')
      loadData()
      closeCardForm()
    } else {
      showError('更新失败')
    }
  } else {
    if (addCardInfo(cardInfo)) {
      showSuccess('信用卡已添加')
      loadData()
      closeCardForm()
    } else {
      showError('添加失败')
    }
  }
}

// 关闭信用卡表单
const closeCardForm = () => {
  showCardForm.value = false
  editingCardIndex.value = null
  cardForm.cardNo = ''
  cardForm.holderName = ''
  cardForm.holderEmail = ''
  cardForm.cvv = ''
  cardForm.expYear = ''
  cardForm.expMonth = ''
}

// 删除信用卡
const deleteCardInfo = (id) => {
  if (confirm('确定要删除这张信用卡吗？')) {
    if (deleteCardInfoUtil(id)) {
      showSuccess('已删除')
      loadData()
    } else {
      showError('删除失败')
    }
  }
}

// 生成并导出Mock数据
const generateAndExportMockData = () => {
  if (exportGenerateCount.value < 1 || exportGenerateCount.value > 100) {
    showError('导出数量必须在 1 到 100 之间')
    return
  }

  const generatedPersonalInfo = []
  for (let i = 0; i < exportGenerateCount.value; i++) {
    const firstName = generateRandomFirstName()
    const lastName = generateRandomLastName()
    const fullName = `${firstName} ${lastName}`
    const email = generateRandomEmail(fullName.toLowerCase().replace(' ', '.'))
    const phone = generateRandomPhone('us')
    const address = generateRandomAddress('en')
    const country = generateRandomCountry()
    const state = generateRandomState(country)
    const city = generateRandomCity(country)
    const postalCode = generateRandomPostalCode()
    const areaCode = generateRandomAreaCode(country)
    
    generatedPersonalInfo.push({
      firstName,
      lastName,
      email,
      phone,
      addressLine1: address,
      country,
      state,
      city,
      postalCode,
      areaCode
    })
  }

  const generatedCardInfo = []
  const testCardNumbers = [
    '4242424242424242',
    '5555555555554444',
    '378282246310005',
    '6011111111111117',
    '4111111111111111'
  ]
  
  for (let i = 0; i < exportGenerateCount.value; i++) {
    const firstName = generateRandomFirstName()
    const lastName = generateRandomLastName()
    const holderName = `${firstName} ${lastName}`
    const holderEmail = generateRandomEmail(holderName.toLowerCase().replace(' ', '.'))
    const cardNo = testCardNumbers[Math.floor(Math.random() * testCardNumbers.length)]
    const cvv = String(Math.floor(Math.random() * 900) + 100)
    const currentYear = new Date().getFullYear()
    const expYear = String(currentYear + Math.floor(Math.random() * 10) + 1)
    const expMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
    
    generatedCardInfo.push({
      cardNo,
      holderName,
      holderEmail,
      cvv,
      expYear,
      expMonth
    })
  }

  const exportData = {
    personalInfo: generatedPersonalInfo,
    cardInfo: generatedCardInfo,
    generatedAt: new Date().toISOString(),
    count: {
      personalInfo: generatedPersonalInfo.length,
      cardInfo: generatedCardInfo.length
    }
  }

  const jsonString = JSON.stringify(exportData, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mock_data_${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showSuccess(`成功生成并导出 ${generatedPersonalInfo.length} 条个人信息和 ${generatedCardInfo.length} 条信用卡数据`)
}

onMounted(() => {
  loadData()
  // 自动加载JSON数据
  loadJsonData()
})
</script>

<style scoped>
.mock-data-manager {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0.4rem 0.6rem;
  width: 100%;
  box-sizing: border-box;
}

.container {
  width: 100%;
  margin: 0;
  max-width: 100%;
}

.header-with-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.4rem;
  position: relative;
  flex-wrap: wrap;
}

.header-actions-top {
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.export-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-export {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  white-space: nowrap;
}

.btn-export:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
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
  font-size: 1.4rem;
  margin-bottom: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  font-weight: 600;
  padding: 0;
  flex: 1;
}

.header-actions-top {
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.export-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-export {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  white-space: nowrap;
}

.btn-export:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.mock-panel {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15);
  min-height: calc(100vh - 100px);
}

.mock-section {
  margin-bottom: 2rem;
}

.mock-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.generate-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.count-input {
  width: 80px;
  padding: 0.4rem;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
}

.count-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-primary,
.btn-secondary,
.btn-generate,
.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-generate {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-generate:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #999;
}

.empty-state p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.empty-state-desc {
  font-size: 0.9rem;
  color: #bbb;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.data-item {
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.data-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.data-item-info {
  flex: 1;
}

.data-item-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.data-item-header strong {
  font-size: 1.1rem;
  color: #333;
}

.data-item-meta {
  color: #999;
  font-size: 0.85rem;
}

.data-item-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.data-item-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit {
  background: #667eea;
  color: white;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.btn-edit:hover {
  background: #5568d3;
}

.btn-delete {
  background: #dc3545;
  color: white;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.btn-delete:hover {
  background: #c82333;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #333;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s;
}

.btn-close:hover {
  background: #e0e0e0;
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  gap: 0.8rem;
  padding: 1.5rem;
  border-top: 2px solid #e0e0e0;
}

.modal-footer button {
  flex: 1;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.required {
  color: #e74c3c;
  font-weight: bold;
}

.input-field {
  padding: 0.6rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* JSON数据展示样式 */
.loading-state {
  text-align: center;
  padding: 2rem;
  color: #667eea;
  font-size: 1rem;
}

.json-data-section {
  margin-top: 1rem;
}

.table-section {
  margin-bottom: 2rem;
}

.table-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.table-container {
  overflow-x: auto;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.data-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.data-table th {
  padding: 0.8rem 0.6rem;
  text-align: left;
  font-weight: 600;
  white-space: nowrap;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.data-table th:last-child {
  border-right: none;
}

.data-table tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

.data-table tbody tr:last-child {
  border-bottom: none;
}

.data-table td {
  padding: 0.7rem 0.6rem;
  color: #333;
  border-right: 1px solid #f0f0f0;
  word-break: break-word;
  max-width: 200px;
}

.data-table td:last-child {
  border-right: none;
}

.json-meta {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.json-meta p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.json-meta strong {
  color: #333;
  font-weight: 600;
}

@media (max-width: 768px) {
  .form-row-2,
  .form-row-3 {
    grid-template-columns: 1fr;
  }
  
  .data-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .data-item-actions {
    width: 100%;
  }
  
  .header-actions {
    flex-wrap: wrap;
  }
  
  .table-container {
    overflow-x: scroll;
  }
  
  .data-table {
    font-size: 0.8rem;
  }
  
  .data-table th,
  .data-table td {
    padding: 0.5rem 0.4rem;
    min-width: 100px;
  }
}
</style>

