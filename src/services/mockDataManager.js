// Mock数据管理工具
const PERSONAL_INFO_STORAGE_KEY = 'paykka_mock_personal_info'
const CARD_INFO_STORAGE_KEY = 'paykka_mock_card_info'

/**
 * 获取所有个人信息Mock数据
 * @returns {Array} 个人信息列表
 */
export function getAllPersonalInfo() {
  try {
    const data = localStorage.getItem(PERSONAL_INFO_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('读取个人信息Mock数据失败:', error)
    return []
  }
}

/**
 * 保存所有个人信息Mock数据
 * @param {Array} dataList - 个人信息列表
 */
export function saveAllPersonalInfo(dataList) {
  try {
    localStorage.setItem(PERSONAL_INFO_STORAGE_KEY, JSON.stringify(dataList))
    return true
  } catch (error) {
    console.error('保存个人信息Mock数据失败:', error)
    return false
  }
}

/**
 * 添加个人信息Mock数据
 * @param {Object} personalInfo - 个人信息对象
 */
export function addPersonalInfo(personalInfo) {
  const dataList = getAllPersonalInfo()
  if (!personalInfo.id) {
    personalInfo.id = `personal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    personalInfo.createdAt = new Date().toISOString()
  }
  personalInfo.updatedAt = new Date().toISOString()
  dataList.push(personalInfo)
  return saveAllPersonalInfo(dataList)
}

/**
 * 更新个人信息Mock数据
 * @param {string} id - 数据ID
 * @param {Object} personalInfo - 更新的个人信息对象
 */
export function updatePersonalInfo(id, personalInfo) {
  const dataList = getAllPersonalInfo()
  const index = dataList.findIndex(item => item.id === id)
  if (index >= 0) {
    dataList[index] = { ...dataList[index], ...personalInfo, updatedAt: new Date().toISOString() }
    return saveAllPersonalInfo(dataList)
  }
  return false
}

/**
 * 删除个人信息Mock数据
 * @param {string} id - 数据ID
 */
export function deletePersonalInfo(id) {
  const dataList = getAllPersonalInfo()
  const filtered = dataList.filter(item => item.id !== id)
  return saveAllPersonalInfo(filtered)
}

/**
 * 获取所有信用卡Mock数据
 * @returns {Array} 信用卡列表
 */
export function getAllCardInfo() {
  try {
    const data = localStorage.getItem(CARD_INFO_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('读取信用卡Mock数据失败:', error)
    return []
  }
}

/**
 * 保存所有信用卡Mock数据
 * @param {Array} dataList - 信用卡列表
 */
export function saveAllCardInfo(dataList) {
  try {
    localStorage.setItem(CARD_INFO_STORAGE_KEY, JSON.stringify(dataList))
    return true
  } catch (error) {
    console.error('保存信用卡Mock数据失败:', error)
    return false
  }
}

/**
 * 添加信用卡Mock数据
 * @param {Object} cardInfo - 信用卡对象
 */
export function addCardInfo(cardInfo) {
  const dataList = getAllCardInfo()
  if (!cardInfo.id) {
    cardInfo.id = `card_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    cardInfo.createdAt = new Date().toISOString()
  }
  cardInfo.updatedAt = new Date().toISOString()
  dataList.push(cardInfo)
  return saveAllCardInfo(dataList)
}

/**
 * 更新信用卡Mock数据
 * @param {string} id - 数据ID
 * @param {Object} cardInfo - 更新的信用卡对象
 */
export function updateCardInfo(id, cardInfo) {
  const dataList = getAllCardInfo()
  const index = dataList.findIndex(item => item.id === id)
  if (index >= 0) {
    dataList[index] = { ...dataList[index], ...cardInfo, updatedAt: new Date().toISOString() }
    return saveAllCardInfo(dataList)
  }
  return false
}

/**
 * 删除信用卡Mock数据
 * @param {string} id - 数据ID
 */
export function deleteCardInfo(id) {
  const dataList = getAllCardInfo()
  const filtered = dataList.filter(item => item.id !== id)
  return saveAllCardInfo(filtered)
}

