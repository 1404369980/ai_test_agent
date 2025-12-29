/**
 * 商户配置相关的 composable
 */
import { ref, onMounted } from 'vue'
import { getAllConfigs, getConfigByMerchantId, getDefaultConfig } from '../services/configManager'

/**
 * 商户配置管理的 composable
 * @param {Object} apiConfig - API 配置对象（reactive）
 * @param {Object} options - 配置选项
 * @param {boolean} options.autoLoad - 是否自动加载配置（默认 true）
 * @returns {Object} 商户配置相关的状态和方法
 */
export function useMerchantConfig(apiConfig, options = { autoLoad: true }) {
  const merchantConfigs = ref([])
  const selectedMerchantId = ref('')

  // 加载商户配置列表
  const loadMerchantConfigs = () => {
    merchantConfigs.value = getAllConfigs()
    // 如果有配置，优先选择默认配置，否则选择第一个
    if (merchantConfigs.value.length > 0 && !selectedMerchantId.value) {
      const defaultConfig = getDefaultConfig()
      if (defaultConfig) {
        selectedMerchantId.value = defaultConfig.merchantId
      } else {
        selectedMerchantId.value = merchantConfigs.value[0].merchantId
      }
      onMerchantChange()
    }
  }

  // 商户选择变化时，自动填充配置
  const onMerchantChange = () => {
    if (!selectedMerchantId.value) {
      clearApiConfig()
      return
    }
    
    const config = getConfigByMerchantId(selectedMerchantId.value)
    if (config) {
      fillApiConfig(config)
    } else {
      clearApiConfig()
    }
  }

  // 清空API配置
  const clearApiConfig = () => {
    if (apiConfig) {
      apiConfig.baseUrl = ''
      apiConfig.merchantId = ''
      apiConfig.appId = ''
      apiConfig.privateKey = ''
    }
  }

  // 填充API配置
  const fillApiConfig = (config) => {
    if (apiConfig && config) {
      apiConfig.baseUrl = config.baseUrl || ''
      apiConfig.merchantId = config.merchantId || ''
      apiConfig.appId = config.appId || ''
      apiConfig.privateKey = config.privateKey || ''
    }
  }

  // 自动加载配置 - 使用 onMounted
  if (options.autoLoad) {
    onMounted(() => {
      loadMerchantConfigs()
    })
  }

  return {
    merchantConfigs,
    selectedMerchantId,
    loadMerchantConfigs,
    onMerchantChange
  }
}

