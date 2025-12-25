<template>
  <div class="user-config">
    <div class="container">
      <div class="header-with-back">
        <button @click="$emit('back')" class="back-button">← 返回首页</button>
        <h1 class="title">商户配置管理</h1>
      </div>
      
      <div class="config-panel">
        <div class="config-section">
          <div class="section-header">
            <h2>商户配置列表</h2>
            <button @click="showAddForm = true" class="btn-primary">+ 添加商户</button>
          </div>
          
          <div v-if="configs.length === 0" class="empty-state">
            <p>暂无商户配置，请添加商户配置</p>
          </div>
          
          <div v-else class="config-list">
            <div v-for="(config, index) in configs" :key="config.merchantId" class="config-item" :class="{ 'is-default': config.isDefault }">
              <div class="config-info">
                <div class="config-name">
                  <strong>{{ config.name || config.merchantId }}</strong>
                  <span v-if="config.isDefault" class="default-badge">默认</span>
                  <span class="config-id">商户ID: {{ config.merchantId }}</span>
                </div>
                <div class="config-details">
                  <div class="detail-item">
                    <span class="label">API 地址:</span>
                    <span class="value">{{ config.baseUrl || 'https://openapi-dev.paykka.com' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">App ID:</span>
                    <span class="value">{{ config.appId }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">私钥:</span>
                    <span class="value private-key">{{ config.privateKey.substring(0, 50) }}...</span>
                  </div>
                </div>
              </div>
              <div class="config-actions">
                <button 
                  v-if="!config.isDefault" 
                  @click="setAsDefault(index)" 
                  class="btn-default"
                  title="设为默认配置"
                >
                  设为默认
                </button>
                <button @click="editConfig(index)" class="btn-edit">编辑</button>
                <button @click="deleteConfig(index)" class="btn-delete">删除</button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="showAddForm || editingIndex !== null" class="form-section">
          <h2>{{ editingIndex !== null ? '编辑商户配置' : '添加商户配置' }}</h2>
          
          <div class="form-group">
            <label>配置名称 <span class="optional">(可选)</span></label>
            <input 
              v-model="formData.name" 
              type="text" 
              placeholder="例如: 测试商户1"
              class="input-field"
            />
            <small class="field-desc">用于标识此配置的友好名称</small>
          </div>
          
          <div class="form-group">
            <label>API 地址 <span class="required">*</span></label>
            <input 
              v-model="formData.baseUrl" 
              type="text" 
              list="api-url-list"
              placeholder="选择或输入API地址"
              class="input-field"
            />
            <datalist id="api-url-list">
              <option value="https://openapi.eu.paykka.com">openapi.eu.paykka.com</option>
              <option value="https://openapi.paykka.com">openapi.paykka.com</option>
              <option value="https://openapi-sandbox.paykka.com">openapi-sandbox.paykka.com</option>
              <option value="https://api-sandbox.paykka.com">api-sandbox.paykka.com</option>
              <option value="https://openapi-dev.paykka.com">openapi-dev.paykka.com</option>
              <option value="https://openapi-fat.paykka.com">openapi-fat.paykka.com</option>
              <option value="http://localhost:8080">localhost:8080</option>
            </datalist>
            <small class="field-desc">API服务器地址</small>
          </div>
          
          <div class="form-group">
            <label>商户ID (Merchant ID) <span class="required">*</span></label>
            <input 
              v-model="formData.merchantId" 
              type="text" 
              placeholder="请输入商户ID"
              class="input-field"
            />
            <small class="field-desc">商户唯一标识</small>
          </div>
          
          <div class="form-group">
            <label>x-paykka-appid <span class="required">*</span></label>
            <input 
              v-model="formData.appId" 
              type="text" 
              placeholder="请输入x-paykka-appid"
              class="input-field"
            />
            <small class="field-desc">调用方唯一标识</small>
          </div>
          
          <div class="form-group">
            <label>私钥 (Private Key) <span class="required">*</span></label>
            <textarea 
              v-model="formData.privateKey" 
              placeholder="请输入RSA私钥（Base64格式）"
              class="textarea-field"
              rows="4"
            ></textarea>
            <small class="field-desc">RSA私钥，用于签名生成</small>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="formData.isDefault"
                class="checkbox-input"
              />
              <span>设为默认配置</span>
            </label>
            <small class="field-desc">默认配置将在测试页面中自动选中</small>
          </div>
          
          <div class="button-group">
            <button @click="saveConfig" class="btn-primary" :disabled="!isFormValid">保存</button>
            <button @click="cancelForm" class="btn-secondary">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { getAllConfigs, saveAllConfigs, deleteConfig as deleteConfigUtil, setDefaultConfig as setDefaultConfigUtil } from '../services/configManager'

defineEmits(['back'])

const configs = ref([])
const showAddForm = ref(false)
const editingIndex = ref(null)

const formData = reactive({
  name: '',
  baseUrl: 'https://openapi-dev.paykka.com',
  merchantId: '',
  appId: '',
  privateKey: '',
  isDefault: false
})

const isFormValid = computed(() => {
  return formData.baseUrl.trim() !== '' && 
         formData.merchantId.trim() !== '' && 
         formData.appId.trim() !== '' && 
         formData.privateKey.trim() !== ''
})

// 加载配置
const loadConfigs = () => {
  configs.value = getAllConfigs()
}

// 保存配置
const saveConfig = () => {
  if (!isFormValid.value) {
    alert('请填写所有必填字段')
    return
  }
  
  const config = {
    name: formData.name.trim() || formData.merchantId,
    baseUrl: formData.baseUrl.trim(),
    merchantId: formData.merchantId.trim(),
    appId: formData.appId.trim(),
    privateKey: formData.privateKey.trim(),
    isDefault: formData.isDefault || false
  }
  
  // 如果设置为默认，先取消其他配置的默认标记
  if (config.isDefault) {
    configs.value.forEach(c => {
      if (c.merchantId !== config.merchantId) {
        c.isDefault = false
      }
    })
  } else if (editingIndex.value !== null) {
    // 如果编辑时取消默认，也要更新
    const oldConfig = configs.value[editingIndex.value]
    if (oldConfig && oldConfig.isDefault) {
      // 如果取消默认，检查是否还有其他配置，如果有则设置第一个为默认
      const otherConfigs = configs.value.filter((c, idx) => idx !== editingIndex.value)
      if (otherConfigs.length > 0) {
        otherConfigs[0].isDefault = true
      }
    }
  }
  
  if (editingIndex.value !== null) {
    // 更新现有配置
    const oldMerchantId = configs.value[editingIndex.value].merchantId
    const newMerchantId = config.merchantId
    
    // 如果商户ID被修改，检查新ID是否与其他配置冲突
    if (oldMerchantId !== newMerchantId) {
      // 检查新商户ID是否已存在（排除当前正在编辑的配置）
      if (configs.value.some((c, idx) => idx !== editingIndex.value && c.merchantId === newMerchantId)) {
        alert('该商户ID已存在，请使用其他商户ID')
        return
      }
      
      // 如果商户ID被修改，需要先删除旧配置，再添加新配置
      // 但这里我们直接更新数组，因为configManager是基于数组索引的
      // 需要更新configManager以支持商户ID修改
    }
    
    configs.value[editingIndex.value] = config
  } else {
    // 检查是否已存在相同商户ID
    if (configs.value.some(c => c.merchantId === config.merchantId)) {
      alert('该商户ID已存在，请使用编辑功能修改')
      return
    }
    // 添加新配置
    configs.value.push(config)
  }
  
  if (saveAllConfigs(configs.value)) {
    alert('保存成功')
    cancelForm()
    loadConfigs()
  } else {
    alert('保存失败，请重试')
  }
}

// 编辑配置
const editConfig = (index) => {
  const config = configs.value[index]
  formData.name = config.name || ''
  formData.baseUrl = config.baseUrl || 'https://openapi-dev.paykka.com'
  formData.merchantId = config.merchantId
  formData.appId = config.appId
  formData.privateKey = config.privateKey
  formData.isDefault = config.isDefault || false
  editingIndex.value = index
  showAddForm.value = true
}

// 设为默认配置
const setAsDefault = (index) => {
  const merchantId = configs.value[index].merchantId
  if (setDefaultConfigUtil(merchantId)) {
    loadConfigs()
    alert('已设置为默认配置')
  } else {
    alert('设置失败，请重试')
  }
}

// 删除配置
const deleteConfig = (index) => {
  if (confirm('确定要删除此商户配置吗？')) {
    const merchantId = configs.value[index].merchantId
    if (deleteConfigUtil(merchantId)) {
      loadConfigs()
      alert('删除成功')
    } else {
      alert('删除失败，请重试')
    }
  }
}

// 取消表单
const cancelForm = () => {
  showAddForm.value = false
  editingIndex.value = null
  formData.name = ''
  formData.baseUrl = 'https://openapi-dev.paykka.com'
  formData.merchantId = ''
  formData.appId = ''
  formData.privateKey = ''
  formData.isDefault = false
}

onMounted(() => {
  loadConfigs()
})
</script>

<style scoped>
.user-config {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header-with-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
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
  font-size: 1.8rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  font-weight: 600;
  flex: 1;
}

.config-panel {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.config-section {
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.config-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.config-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.config-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.config-item.is-default {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.default-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

.config-info {
  flex: 1;
}

.config-name {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.config-name strong {
  font-size: 1.1rem;
  color: #333;
}

.config-id {
  font-size: 0.9rem;
  color: #666;
  background: #f5f5f5;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.config-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.detail-item .label {
  color: #666;
  font-weight: 500;
  min-width: 80px;
}

.detail-item .value {
  color: #333;
}

.detail-item .value.private-key {
  font-family: monospace;
  font-size: 0.85rem;
  color: #999;
}

.config-actions {
  display: flex;
  gap: 0.5rem;
}

.form-section {
  border-top: 2px solid #f0f0f0;
  padding-top: 2rem;
}

.form-section h2 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
}

.required {
  color: #e74c3c;
}

.optional {
  color: #999;
  font-weight: normal;
}

.input-field,
.textarea-field {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.3s;
}

.input-field:focus,
.textarea-field:focus {
  outline: none;
  border-color: #667eea;
}

.input-field:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.textarea-field {
  resize: vertical;
  font-family: monospace;
}

.field-desc {
  display: block;
  margin-top: 0.3rem;
  color: #999;
  font-size: 0.85rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary,
.btn-edit,
.btn-delete {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-edit {
  background: #3498db;
  color: white;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.btn-edit:hover {
  background: #2980b9;
}

.btn-delete {
  background: #e74c3c;
  color: white;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.btn-delete:hover {
  background: #c0392b;
}

.btn-default {
  background: #667eea;
  color: white;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-default:hover {
  background: #5568d3;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .config-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .config-actions {
    width: 100%;
    margin-top: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>

