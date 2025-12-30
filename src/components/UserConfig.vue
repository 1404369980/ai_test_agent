<template>
  <div class="user-config">
    <div class="container">
      <div class="header-with-back">
        <button @click="goBack" class="back-button">← 返回首页</button>
        <h1 class="title">商户配置管理</h1>
      </div>
      
      <div class="config-panel">
        <div class="config-section">
          <div class="section-header">
            <h2>商户配置列表</h2>
            <div class="header-actions">
              <button @click="exportAllConfigs" class="btn-export">📤 导出所有配置</button>
              <button @click="showImportSection = !showImportSection" class="btn-import">📥 导入配置</button>
              <button @click="showAddForm = true" class="btn-primary">+ 添加商户</button>
            </div>
          </div>
          
          <!-- 导入配置区域 -->
          <div v-if="showImportSection" class="import-section">
            <div class="import-header">
              <h3>📥 导入商户配置</h3>
              <p class="import-desc">支持直接编辑、粘贴或从文件加载 JSON 配置数据</p>
            </div>
            
            <div class="json-input-section">
              <div class="json-input-header">
                <div class="json-input-title">
                  <span class="title-text">JSON 配置数据</span>
                  <span v-if="importJsonText.trim()" class="char-count">
                    {{ importJsonText.length }} 字符
                  </span>
                </div>
              </div>
              
              <div class="json-input-toolbar">
                <input 
                  type="file" 
                  ref="fileInput" 
                  @change="handleFileImport" 
                  accept=".json"
                  class="file-input"
                />
                <button @click="fileInput?.click()" class="btn-toolbar btn-file">
                  <span class="btn-icon">📁</span>
                  <span class="btn-text">从文件加载</span>
                </button>
                <button @click="useJsonTemplate" class="btn-toolbar btn-template">
                  <span class="btn-icon">🔄</span>
                  <span class="btn-text">重置模板</span>
                </button>
                <button @click="copyCurrentJson" class="btn-toolbar btn-copy" :disabled="!importJsonText.trim()">
                  <span class="btn-icon">📋</span>
                  <span class="btn-text">复制</span>
                </button>
              </div>
              
              <div class="textarea-wrapper">
                <textarea 
                  v-model="importJsonText" 
                  placeholder="在此输入或粘贴 JSON 配置数据，或点击上方按钮从文件加载..."
                  class="json-input-textarea"
                  :class="{ 'has-error': importJsonText.trim() && !isValidJson(importJsonText), 'has-success': importJsonText.trim() && isValidJson(importJsonText) }"
                  rows="10"
                  @paste="handlePaste"
                  @input="handleJsonInput"
                ></textarea>
                <div v-if="importJsonText.trim() && isValidJson(importJsonText)" class="json-status success">
                  <span class="status-icon">✓</span>
                  <span class="status-text">检测到 {{ getJsonConfigCount(importJsonText) }} 个配置，格式正确</span>
                </div>
                <div v-else-if="importJsonText.trim() && !isValidJson(importJsonText)" class="json-status error">
                  <span class="status-icon">✗</span>
                  <span class="status-text">JSON 格式错误，请检查</span>
                </div>
              </div>
              
              <div class="import-actions">
                <button 
                  @click="handleTextImport" 
                  class="btn-import-primary" 
                  :disabled="!importJsonText.trim() || !isValidJson(importJsonText)"
                  :class="{ 'is-ready': importJsonText.trim() && isValidJson(importJsonText) }"
                >
                  <span class="btn-icon">✓</span>
                  <span class="btn-text">导入配置</span>
                </button>
                <button @click="clearImportText" class="btn-clear" v-if="importJsonText.trim()">
                  <span class="btn-text">清空</span>
                </button>
              </div>
            </div>
            
            <div v-if="importError" class="import-error">
              <span class="error-icon">⚠️</span>
              <span class="error-text">{{ importError }}</span>
            </div>
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
                  @click="copyConfigAsJson(index)" 
                  class="btn-copy-json"
                  title="复制为 JSON"
                >
                  📋 复制 JSON
                </button>
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
    
    <!-- Toast 提示 -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Toast from './Toast.vue'
import { getAllConfigs, saveAllConfigs, deleteConfig as deleteConfigUtil, setDefaultConfig as setDefaultConfigUtil } from '../services/configManager'
import { showError, showSuccess, showInfo } from '../utils/toast'
import { useNavigation } from '../composables/useNavigation'

const { goHome: goBack } = useNavigation()

const configs = ref([])
const showAddForm = ref(false)
const editingIndex = ref(null)
const showImportSection = ref(false)
const importJsonText = ref('')
const importError = ref('')
const fileInput = ref(null)

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
    showError('请填写所有必填字段')
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
        showError('该商户ID已存在，请使用其他商户ID')
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
      showError('该商户ID已存在，请使用编辑功能修改')
      return
    }
    // 添加新配置
    configs.value.push(config)
  }
  
  if (saveAllConfigs(configs.value)) {
    showSuccess('保存成功')
    cancelForm()
    loadConfigs()
  } else {
    showError('保存失败，请重试')
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
    showSuccess('已设置为默认配置')
  } else {
    showError('设置失败，请重试')
  }
}

// 删除配置
const deleteConfig = (index) => {
  if (confirm('确定要删除此商户配置吗？')) {
    const merchantId = configs.value[index].merchantId
    if (deleteConfigUtil(merchantId)) {
      loadConfigs()
      showSuccess('删除成功')
    } else {
      showError('删除失败，请重试')
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

// JSON 数据结构示例
const jsonStructureExample = computed(() => {
  return JSON.stringify([
    {
      "name": "测试商户1",
      "baseUrl": "https://openapi-dev.paykka.com",
      "merchantId": "m9150765120039",
      "appId": "app123456",
      "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----",
      "isDefault": true
    },
    {
      "name": "测试商户2",
      "baseUrl": "https://openapi-fat.paykka.com",
      "merchantId": "m9150765120040",
      "appId": "app123457",
      "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----",
      "isDefault": false
    }
  ], null, 2)
})

// 复制 JSON 结构（模板）
const copyJsonStructure = async () => {
  try {
    await navigator.clipboard.writeText(jsonStructureExample.value)
    showSuccess('模板已复制到剪贴板')
  } catch (error) {
    showError('复制失败，请手动复制')
  }
}

// 复制当前输入框的 JSON
const copyCurrentJson = async () => {
  if (!importJsonText.value.trim()) {
    showInfo('输入框为空，无法复制')
    return
  }
  try {
    await navigator.clipboard.writeText(importJsonText.value)
    showSuccess('已复制到剪贴板')
  } catch (error) {
    showError('复制失败，请手动复制')
  }
}

// 使用 JSON 模板（填入到导入文本框）
const useJsonTemplate = () => {
  importJsonText.value = jsonStructureExample.value
  importError.value = ''
  showInfo('已重置为模板，请编辑后导入')
}

// 处理 JSON 输入
const handleJsonInput = () => {
  importError.value = ''
  // 实时验证
  if (importJsonText.value.trim() && !isValidJson(importJsonText.value)) {
    importError.value = 'JSON 格式不正确，请检查'
  }
}

// 复制单个配置为 JSON
const copyConfigAsJson = async (index) => {
  try {
    const config = configs.value[index]
    if (!config) {
      showError('配置不存在')
      return
    }
    
    const configJson = JSON.stringify([config], null, 2)
    await navigator.clipboard.writeText(configJson)
    showSuccess('配置已复制为 JSON')
  } catch (error) {
    showError('复制失败，请重试')
  }
}

// 导出所有配置为 JSON
const exportAllConfigs = async () => {
  try {
    if (configs.value.length === 0) {
      showInfo('暂无配置可导出')
      return
    }
    
    const allConfigsJson = JSON.stringify(configs.value, null, 2)
    await navigator.clipboard.writeText(allConfigsJson)
    showSuccess(`已复制 ${configs.value.length} 个配置到剪贴板`)
  } catch (error) {
    showError('导出失败，请重试')
  }
}

// 验证配置数据
const validateConfigData = (data) => {
  if (!Array.isArray(data)) {
    return { valid: false, error: '配置数据必须是数组格式' }
  }
  
  for (let i = 0; i < data.length; i++) {
    const config = data[i]
    if (!config.merchantId || typeof config.merchantId !== 'string') {
      return { valid: false, error: `第 ${i + 1} 个配置缺少 merchantId 字段` }
    }
    if (!config.appId || typeof config.appId !== 'string') {
      return { valid: false, error: `第 ${i + 1} 个配置缺少 appId 字段` }
    }
    if (!config.privateKey || typeof config.privateKey !== 'string') {
      return { valid: false, error: `第 ${i + 1} 个配置缺少 privateKey 字段` }
    }
    if (config.baseUrl && typeof config.baseUrl !== 'string') {
      return { valid: false, error: `第 ${i + 1} 个配置的 baseUrl 必须是字符串` }
    }
  }
  
  return { valid: true }
}

// 处理文件导入（加载到输入框）
const handleFileImport = async (event) => {
  const file = event.target.files[0]
  if (!file) {
    return
  }
  
  if (!file.name.endsWith('.json')) {
    importError.value = '请选择 JSON 格式的文件'
    return
  }
  
  try {
    const text = await file.text()
    // 验证 JSON 格式
    JSON.parse(text)
    // 将文件内容加载到输入框
    importJsonText.value = text
    importError.value = ''
    showSuccess('文件已加载到输入框，请检查后点击导入')
  } catch (error) {
    importError.value = `解析 JSON 失败: ${error.message}`
  }
  
  // 清空文件选择
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 验证 JSON 格式
const isValidJson = (text) => {
  if (!text.trim()) return false
  try {
    JSON.parse(text)
    return true
  } catch {
    return false
  }
}

// 获取 JSON 配置数量
const getJsonConfigCount = (text) => {
  try {
    const data = JSON.parse(text)
    if (Array.isArray(data)) {
      return data.length
    }
    return 1
  } catch {
    return 0
  }
}

// 处理粘贴事件
const handlePaste = () => {
  // 清除之前的错误信息
  importError.value = ''
  // 延迟验证，等待粘贴内容完成
  setTimeout(() => {
    if (importJsonText.value.trim() && !isValidJson(importJsonText.value)) {
      importError.value = 'JSON 格式不正确，请检查'
    } else if (importJsonText.value.trim() && isValidJson(importJsonText.value)) {
      importError.value = ''
    }
  }, 100)
}

// 清空导入文本
const clearImportText = () => {
  importJsonText.value = ''
  importError.value = ''
}

// 处理文本导入
const handleTextImport = () => {
  if (!importJsonText.value.trim()) {
    importError.value = '请输入 JSON 配置数据'
    return
  }
  
  if (!isValidJson(importJsonText.value)) {
    importError.value = 'JSON 格式不正确，请检查'
    return
  }
  
  try {
    const data = JSON.parse(importJsonText.value)
    importConfigs(data)
    // 导入成功后清空文本
    importJsonText.value = ''
    importError.value = ''
  } catch (error) {
    importError.value = `解析 JSON 失败: ${error.message}`
  }
}

// 导入配置
const importConfigs = (data) => {
  importError.value = ''
  
  // 验证数据
  const validation = validateConfigData(data)
  if (!validation.valid) {
    importError.value = validation.error
    return
  }
  
  // 合并配置
  const existingConfigs = [...configs.value]
  let importedCount = 0
  let updatedCount = 0
  let skippedCount = 0
  
  data.forEach(newConfig => {
    const existingIndex = existingConfigs.findIndex(c => c.merchantId === newConfig.merchantId)
    
    if (existingIndex >= 0) {
      // 更新现有配置
      existingConfigs[existingIndex] = {
        ...existingConfigs[existingIndex],
        ...newConfig,
        merchantId: newConfig.merchantId // 确保 merchantId 不被覆盖
      }
      updatedCount++
    } else {
      // 添加新配置
      existingConfigs.push({
        name: newConfig.name || newConfig.merchantId,
        baseUrl: newConfig.baseUrl || 'https://openapi-dev.paykka.com',
        merchantId: newConfig.merchantId,
        appId: newConfig.appId,
        privateKey: newConfig.privateKey,
        isDefault: newConfig.isDefault || false
      })
      importedCount++
    }
  })
  
  // 如果导入的配置中有默认配置，确保只有一个默认配置
  const defaultConfigs = existingConfigs.filter(c => c.isDefault)
  if (defaultConfigs.length > 1) {
    // 保留第一个默认配置，其他取消默认
    for (let i = 1; i < defaultConfigs.length; i++) {
      const config = existingConfigs.find(c => c.merchantId === defaultConfigs[i].merchantId)
      if (config) {
        config.isDefault = false
      }
    }
  }
  
  // 保存配置
  if (saveAllConfigs(existingConfigs)) {
    loadConfigs()
    let message = `导入成功！`
    if (importedCount > 0) {
      message += ` 新增 ${importedCount} 个配置`
    }
    if (updatedCount > 0) {
      message += ` 更新 ${updatedCount} 个配置`
    }
    showSuccess(message)
    showImportSection.value = false
    importError.value = ''
  } else {
    importError.value = '保存配置失败，请重试'
  }
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

.header-actions {
  display: flex;
  gap: 0.5rem;
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

.import-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.import-header {
  margin-bottom: 1.5rem;
}

.import-header h3 {
  font-size: 1.4rem;
  color: #333;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.import-desc {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

.json-input-section {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.json-input-header {
  margin-bottom: 1rem;
}

.json-input-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-text {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.char-count {
  font-size: 0.85rem;
  color: #999;
  background: #f5f5f5;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.json-input-toolbar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.textarea-wrapper {
  position: relative;
  margin-bottom: 1rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.json-input-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.8rem;
  font-family: 'Courier New', 'Monaco', 'Menlo', 'Consolas', monospace;
  resize: vertical;
  line-height: 1.6;
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
  color: #2c3e50;
  transition: all 0.3s ease;
  min-height: 250px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.json-input-textarea::placeholder {
  color: #bbb;
  font-style: italic;
}

.json-input-textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.json-input-textarea.has-success {
  border-color: #4caf50;
  background: linear-gradient(135deg, #f1f8f4 0%, #ffffff 100%);
}

.json-input-textarea.has-success:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.json-input-textarea.has-error {
  border-color: #f44336;
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
}

.json-input-textarea.has-error:focus {
  border-color: #f44336;
  box-shadow: 0 0 0 4px rgba(244, 67, 54, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.import-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.json-structure {
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.json-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #666;
}

.json-header-actions {
  display: flex;
  gap: 0.5rem;
}

.json-display {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #333;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}

.import-options {
  margin-top: 1rem;
}

.import-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tab-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.tab-button:hover {
  background: #f5f5f5;
}

.tab-button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.import-file {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-input {
  display: none;
}

.import-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.import-text-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-toolbar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border: 1.5px solid;
  border-radius: 8px;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-toolbar:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-toolbar:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-toolbar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  font-size: 1.1rem;
  line-height: 1;
  display: inline-block;
}

.btn-text {
  white-space: nowrap;
  font-weight: 500;
}

.btn-import-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #ccc;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: not-allowed;
  transition: all 0.3s;
}

.btn-import-primary.is-ready {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-import-primary.is-ready:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-clear {
  padding: 0.75rem 1.2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: #666;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-clear:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.import-textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: 'Courier New', monospace;
  resize: vertical;
}

.import-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.import-error {
  margin-top: 1rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%);
  border: 2px solid #f44336;
  border-radius: 8px;
  color: #c62828;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.1);
}

.error-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.error-text {
  flex: 1;
  line-height: 1.5;
}

.btn-import {
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-import:hover {
  background: #218838;
}

.btn-export {
  background: #17a2b8;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-export:hover {
  background: #138496;
}

.btn-copy-json {
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-copy-json:hover {
  background: #5a6268;
}

.btn-file {
  border-color: #17a2b8;
  color: #17a2b8;
  background: rgba(23, 162, 184, 0.05);
}

.btn-file:hover:not(:disabled) {
  background: #17a2b8;
  color: white;
  border-color: #17a2b8;
}

.btn-template {
  border-color: #667eea;
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.btn-template:hover:not(:disabled) {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-copy {
  border-color: #6c757d;
  color: #6c757d;
  background: rgba(108, 117, 125, 0.05);
}

.btn-copy:hover:not(:disabled) {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
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
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .import-tabs {
    flex-direction: column;
  }
  
  .tab-button {
    border-radius: 6px;
  }
}
</style>

