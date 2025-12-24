// 商户配置管理工具
const STORAGE_KEY = 'paykka_merchant_configs'

/**
 * 获取所有商户配置
 * @returns {Array} 商户配置列表
 */
export function getAllConfigs() {
  try {
    const configs = localStorage.getItem(STORAGE_KEY)
    return configs ? JSON.parse(configs) : []
  } catch (error) {
    console.error('读取配置失败:', error)
    return []
  }
}

/**
 * 保存所有商户配置
 * @param {Array} configs - 商户配置列表
 */
export function saveAllConfigs(configs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs))
    return true
  } catch (error) {
    console.error('保存配置失败:', error)
    return false
  }
}

/**
 * 根据商户ID获取配置
 * @param {string} merchantId - 商户ID
 * @returns {Object|null} 商户配置
 */
export function getConfigByMerchantId(merchantId) {
  const configs = getAllConfigs()
  return configs.find(config => config.merchantId === merchantId) || null
}

/**
 * 添加或更新商户配置
 * @param {Object} config - 商户配置 {merchantId, appId, privateKey, name?}
 * @returns {boolean} 是否成功
 */
export function saveConfig(config) {
  const configs = getAllConfigs()
  const index = configs.findIndex(c => c.merchantId === config.merchantId)
  
  if (index >= 0) {
    // 更新现有配置
    configs[index] = { ...configs[index], ...config }
  } else {
    // 添加新配置
    configs.push(config)
  }
  
  return saveAllConfigs(configs)
}

/**
 * 删除商户配置
 * @param {string} merchantId - 商户ID
 * @returns {boolean} 是否成功
 */
export function deleteConfig(merchantId) {
  const configs = getAllConfigs()
  const filtered = configs.filter(c => c.merchantId !== merchantId)
  return saveAllConfigs(filtered)
}

/**
 * 获取默认配置（如果存在）
 * @returns {Object|null} 默认配置
 */
export function getDefaultConfig() {
  const configs = getAllConfigs()
  return configs.length > 0 ? configs[0] : null
}


