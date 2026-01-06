<template>
  <div class="test-card-manager">
    <div class="container">
      <div class="header-with-back">
        <button @click="goBack" class="back-button">← 返回首页</button>
        <h1 class="title">测试卡号管理</h1>
      </div>
      
      <div class="test-card-panel">
        <!-- 渠道选择 -->
        <div class="provider-section">
          <div class="section-header">
            <h2>支付渠道</h2>
          </div>
          <div class="provider-tabs">
            <button 
              v-for="provider in providers" 
              :key="provider.value"
              @click="selectedProvider = provider.value"
              :class="['provider-tab', { active: selectedProvider === provider.value }]"
            >
              {{ provider.label }}
            </button>
          </div>
        </div>

        <!-- 测试卡号列表 -->
        <div class="card-section">
          <div class="section-header">
            <h2>{{ getCurrentProviderLabel() }}测试卡</h2>
            <div class="header-actions">
              <button @click="showCardForm = true" class="btn-primary">+ 添加卡号</button>
            </div>
          </div>

          <!-- 常用卡 -->
          <div v-if="commonCards.length > 0" class="card-category">
            <h3 class="category-title">常用卡</h3>
            <div class="card-list">
              <div 
                v-for="card in commonCards" 
                :key="card.id"
                class="card-item"
              >
                <div class="card-info">
                  <div class="card-header">
                    <span class="card-number">{{ card.cardNo }}</span>
                    <span class="card-type-badge" :class="`card-type-${card.cardType}`">
                      {{ getCardTypeLabel(card.cardType) }}
                    </span>
                  </div>
                  <div class="card-description">{{ card.description }}</div>
                </div>
                <div class="card-actions">
                  <button @click="editCard(card)" class="btn-edit">编辑</button>
                  <button @click="deleteCard(card.id)" class="btn-delete">删除</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 特殊卡 -->
          <div v-if="specialCards.length > 0" class="card-category">
            <h3 class="category-title">特殊卡</h3>
            <div class="card-list">
              <div 
                v-for="card in specialCards" 
                :key="card.id"
                class="card-item"
              >
                <div class="card-info">
                  <div class="card-header">
                    <span class="card-number">{{ card.cardNo }}</span>
                    <span class="card-type-badge" :class="`card-type-${card.cardType}`">
                      {{ getCardTypeLabel(card.cardType) }}
                    </span>
                  </div>
                  <div class="card-description">{{ card.description }}</div>
                </div>
                <div class="card-actions">
                  <button @click="editCard(card)" class="btn-edit">编辑</button>
                  <button @click="deleteCard(card.id)" class="btn-delete">删除</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="commonCards.length === 0 && specialCards.length === 0" class="empty-state">
            <p>暂无测试卡号</p>
            <p class="empty-state-desc">点击"添加卡号"创建测试卡号</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 卡号表单弹窗 -->
    <div v-if="showCardForm" class="modal-overlay" @click.self="closeCardForm">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingCardId ? '编辑测试卡号' : '添加测试卡号' }}</h3>
          <button @click="closeCardForm" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>卡号 (Card No) <span class="required">*</span></label>
            <input 
              v-model="cardForm.cardNo" 
              type="text" 
              placeholder="4242424242424242" 
              maxlength="19" 
              class="input-field"
            />
          </div>
          
          <div class="form-row-2">
            <div class="form-group">
              <label>卡类型 (Card Type) <span class="required">*</span></label>
              <select v-model="cardForm.cardType" class="input-field">
                <option value="">请选择</option>
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">American Express</option>
                <option value="discover">Discover</option>
                <option value="diners">Diners Club</option>
                <option value="jcb">JCB</option>
                <option value="unionpay">UnionPay</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div class="form-group">
              <label>分类 (Category) <span class="required">*</span></label>
              <select v-model="cardForm.category" class="input-field">
                <option value="">请选择</option>
                <option value="common">常用卡</option>
                <option value="special">特殊卡</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>描述 (Description) <span class="required">*</span></label>
            <input 
              v-model="cardForm.description" 
              type="text" 
              placeholder="例如：Visa、3D卡、拒付卡等" 
              class="input-field"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="saveCard" class="btn-primary" :disabled="!isCardFormValid">保存</button>
          <button @click="closeCardForm" class="btn-secondary">取消</button>
        </div>
      </div>
    </div>
    
    <!-- Toast 提示 -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import Toast from './Toast.vue'
import {
  getAllTestCards,
  getTestCardsByProvider,
  addTestCard,
  updateTestCard,
  deleteTestCard as deleteTestCardUtil,
  initStripeTestCards,
  initEcpTestCards,
  initCkoTestCards
} from '../services/testCardManager'
import { showError, showSuccess } from '../utils/toast'
import { useNavigation } from '../composables/useNavigation'

const { goHome: goBack } = useNavigation()

// 支付渠道列表
const providers = [
  { value: 'stripe', label: 'Stripe' },
  { value: 'ecp', label: 'ECP' },
  { value: 'cko', label: 'CKO' }
  // 后续可以添加其他渠道，如：{ value: 'paypal', label: 'PayPal' }
]

const selectedProvider = ref('stripe')
const cardList = ref([])
const showCardForm = ref(false)
const editingCardId = ref(null)

const cardForm = reactive({
  cardNo: '',
  cardType: '',
  description: '',
  category: '',
  provider: 'stripe'
})

// 表单验证
const isCardFormValid = computed(() => {
  return cardForm.cardNo.trim() !== '' &&
         cardForm.cardType.trim() !== '' &&
         cardForm.description.trim() !== '' &&
         cardForm.category.trim() !== ''
})

// 获取当前渠道的标签
const getCurrentProviderLabel = () => {
  const provider = providers.find(p => p.value === selectedProvider.value)
  return provider ? provider.label : ''
}

// 获取卡类型标签
const getCardTypeLabel = (cardType) => {
  const typeMap = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
    diners: 'Diners Club',
    jcb: 'JCB',
    unionpay: 'UnionPay',
    other: '其他'
  }
  return typeMap[cardType] || cardType
}

// 常用卡列表
const commonCards = computed(() => {
  return cardList.value.filter(card => card.category === 'common')
})

// 特殊卡列表
const specialCards = computed(() => {
  return cardList.value.filter(card => card.category === 'special')
})

// 加载数据
const loadCards = () => {
  cardList.value = getTestCardsByProvider(selectedProvider.value)
}

// 编辑卡号
const editCard = (card) => {
  editingCardId.value = card.id
  cardForm.cardNo = card.cardNo || ''
  cardForm.cardType = card.cardType || ''
  cardForm.description = card.description || ''
  cardForm.category = card.category || ''
  cardForm.provider = card.provider || selectedProvider.value
  showCardForm.value = true
}

// 保存卡号
const saveCard = () => {
  if (!isCardFormValid.value) {
    showError('请填写必填字段')
    return
  }
  
  const cardInfo = {
    cardNo: cardForm.cardNo.trim(),
    cardType: cardForm.cardType.trim(),
    description: cardForm.description.trim(),
    category: cardForm.category.trim(),
    provider: selectedProvider.value
  }
  
  if (editingCardId.value) {
    if (updateTestCard(editingCardId.value, cardInfo)) {
      showSuccess('测试卡号已更新')
      loadCards()
      closeCardForm()
    } else {
      showError('更新失败')
    }
  } else {
    if (addTestCard(cardInfo)) {
      showSuccess('测试卡号已添加')
      loadCards()
      closeCardForm()
    } else {
      showError('添加失败')
    }
  }
}

// 删除卡号
const deleteCard = (id) => {
  if (confirm('确定要删除这张测试卡号吗？')) {
    if (deleteTestCardUtil(id)) {
      showSuccess('已删除')
      loadCards()
    } else {
      showError('删除失败')
    }
  }
}

// 关闭表单
const closeCardForm = () => {
  showCardForm.value = false
  editingCardId.value = null
  cardForm.cardNo = ''
  cardForm.cardType = ''
  cardForm.description = ''
  cardForm.category = ''
  cardForm.provider = selectedProvider.value
}

// 监听渠道变化
watch(selectedProvider, () => {
  loadCards()
})

// 组件挂载
onMounted(() => {
  // 初始化测试卡号（如果不存在）
  initStripeTestCards()
  initEcpTestCards()
  initCkoTestCards()
  loadCards()
})
</script>

<style scoped>
.test-card-manager {
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

.test-card-panel {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15);
  min-height: calc(100vh - 100px);
}

.provider-section {
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid #e0e0e0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.provider-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.provider-tab {
  padding: 0.4rem 0.8rem;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.provider-tab:hover {
  background: #e8e8e8;
  border-color: #667eea;
}

.provider-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.card-section {
  margin-top: 0.8rem;
}

.card-category {
  margin-bottom: 1.2rem;
}

.category-title {
  font-size: 1rem;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.6rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid #e0e0e0;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0.6rem;
}

.card-item {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.card-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.card-info {
  flex: 1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.3rem;
  flex-wrap: wrap;
}

.card-number {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
}

.card-type-badge {
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
}

.card-type-visa {
  background: #1a1f71;
}

.card-type-mastercard {
  background: #eb001b;
}

.card-type-amex {
  background: #006fcf;
}

.card-type-discover {
  background: #ff6000;
}

.card-type-diners {
  background: #0079be;
}

.card-type-jcb {
  background: #0e4c96;
}

.card-type-unionpay {
  background: #e21836;
}

.card-type-other {
  background: #666;
}

.card-description {
  color: #666;
  font-size: 0.8rem;
  line-height: 1.3;
}

.card-actions {
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
}

.btn-primary,
.btn-secondary,
.btn-edit,
.btn-delete {
  padding: 0.35rem 0.7rem;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
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

.btn-edit {
  background: #667eea;
  color: white;
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
}

.btn-edit:hover {
  background: #5568d3;
}

.btn-delete {
  background: #dc3545;
  color: white;
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
}

.btn-delete:hover {
  background: #c82333;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: #999;
}

.empty-state p {
  margin: 0.4rem 0;
  font-size: 0.9rem;
}

.empty-state-desc {
  font-size: 0.8rem;
  color: #bbb;
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
  padding: 1rem 1.2rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
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
  padding: 1rem 1.2rem;
}

.modal-footer {
  display: flex;
  gap: 0.6rem;
  padding: 1rem 1.2rem;
  border-top: 1px solid #e0e0e0;
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

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.8rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.85rem;
}

.required {
  color: #e74c3c;
  font-weight: bold;
}

.input-field {
  padding: 0.5rem 0.6rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.85rem;
  transition: all 0.3s;
  line-height: 1.4;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

@media (max-width: 768px) {
  .form-row-2 {
    grid-template-columns: 1fr;
  }
  
  .card-list {
    grid-template-columns: 1fr;
  }
  
  .card-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
  }
  
  .card-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .provider-tabs {
    flex-direction: column;
  }
  
  .provider-tab {
    width: 100%;
  }
}
</style>

