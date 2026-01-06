// 测试卡号管理工具
const TEST_CARD_STORAGE_KEY = 'paykka_test_cards'

// 生成唯一ID
function generateUniqueId() {
  return `card_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * 获取所有测试卡号
 * @returns {Array} 测试卡号列表
 */
export function getAllTestCards() {
  try {
    const data = localStorage.getItem(TEST_CARD_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('读取测试卡号失败:', error)
    return []
  }
}

/**
 * 保存所有测试卡号
 * @param {Array} cardList - 测试卡号列表
 */
export function saveAllTestCards(cardList) {
  try {
    localStorage.setItem(TEST_CARD_STORAGE_KEY, JSON.stringify(cardList))
    return true
  } catch (error) {
    console.error('保存测试卡号失败:', error)
    return false
  }
}

/**
 * 根据渠道获取测试卡号
 * @param {string} provider - 支付渠道（如 'stripe'）
 * @returns {Array} 该渠道的测试卡号列表
 */
export function getTestCardsByProvider(provider) {
  const allCards = getAllTestCards()
  return allCards.filter(card => card.provider === provider)
}

/**
 * 添加测试卡号
 * @param {Object} cardInfo - 测试卡号信息
 * @returns {boolean} 是否成功
 */
export function addTestCard(cardInfo) {
  const cardList = getAllTestCards()
  const newCard = {
    ...cardInfo,
    id: generateUniqueId(),
    createdAt: new Date().toISOString()
  }
  cardList.push(newCard)
  return saveAllTestCards(cardList)
}

/**
 * 更新测试卡号
 * @param {string} id - 卡号ID
 * @param {Object} updatedInfo - 更新的信息
 * @returns {boolean} 是否成功
 */
export function updateTestCard(id, updatedInfo) {
  const cardList = getAllTestCards()
  const index = cardList.findIndex(card => card.id === id)
  if (index !== -1) {
    cardList[index] = {
      ...cardList[index],
      ...updatedInfo,
      updatedAt: new Date().toISOString()
    }
    return saveAllTestCards(cardList)
  }
  return false
}

/**
 * 删除测试卡号
 * @param {string} id - 卡号ID
 * @returns {boolean} 是否成功
 */
export function deleteTestCard(id) {
  const cardList = getAllTestCards()
  const filteredList = cardList.filter(card => card.id !== id)
  return saveAllTestCards(filteredList)
}

/**
 * 初始化ECP测试卡号（如果不存在）
 */
export function initEcpTestCards() {
  const existingCards = getAllTestCards()
  const ecpCards = existingCards.filter(card => card.provider === 'ecp')
  
  if (ecpCards.length === 0) {
    // 初始化ECP测试卡号
    const defaultEcpCards = [
      { cardNo: '4200000000000000', cardType: 'visa', description: 'visa成功', category: 'special', provider: 'ecp' },
      { cardNo: '4111111111111111', cardType: 'visa', description: 'visa拒绝', category: 'special', provider: 'ecp' },
      { cardNo: '5555555555554444', cardType: 'mastercard', description: 'mastercard成功', category: 'special', provider: 'ecp' },
      { cardNo: '5105105105105100', cardType: 'mastercard', description: 'mastercard拒绝', category: 'special', provider: 'ecp' },
      { cardNo: '4901170000000003', cardType: 'visa', description: '无摩擦', category: 'special', provider: 'ecp' },
      { cardNo: '4066330000000004', cardType: 'visa', description: '无摩擦+收集浏览器', category: 'special', provider: 'ecp' },
      { cardNo: '4111110000000922', cardType: 'visa', description: '未认证', category: 'special', provider: 'ecp' },
      { cardNo: '5200000000001047', cardType: 'mastercard', description: '未认证', category: 'special', provider: 'ecp' },
      { cardNo: '4918190000000002', cardType: 'visa', description: '挑战', category: 'special', provider: 'ecp' },
      { cardNo: '5433300000000133', cardType: 'mastercard', description: '挑战', category: 'special', provider: 'ecp' },
      { cardNo: '4938730000000001', cardType: 'visa', description: '挑战+收集浏览器', category: 'special', provider: 'ecp' },
      { cardNo: '5200000000001005', cardType: 'mastercard', description: '挑战+收集浏览器', category: 'special', provider: 'ecp' },
      { cardNo: '5169750000001111', cardType: 'mastercard', description: 'MasterCard低风险豁免', category: 'special', provider: 'ecp' },
      { cardNo: '4378510000000004', cardType: 'visa', description: 'Visa低风险豁免', category: 'special', provider: 'ecp' }
    ]
    
    defaultEcpCards.forEach(card => {
      addTestCard(card)
    })
  }
}

/**
 * 初始化CKO测试卡号（如果不存在）
 */
export function initCkoTestCards() {
  const existingCards = getAllTestCards()
  const ckoCards = existingCards.filter(card => card.provider === 'cko')
  
  if (ckoCards.length === 0) {
    // 初始化CKO测试卡号
    const defaultCkoCards = [
      // 各种发卡行（常用卡）
      { cardNo: '4539467987109256', cardType: 'visa', description: 'visa', category: 'common', provider: 'cko' },
      { cardNo: '4659105569051157', cardType: 'visa', description: 'visa', category: 'common', provider: 'cko' },
      { cardNo: '5585076576791786', cardType: 'mastercard', description: 'mastercard', category: 'common', provider: 'cko' },
      { cardNo: '5305484748800098', cardType: 'mastercard', description: 'mastercard', category: 'common', provider: 'cko' },
      { cardNo: '345678901234564', cardType: 'amex', description: 'amex', category: 'common', provider: 'cko' },
      { cardNo: '341829238058580', cardType: 'amex', description: 'amex', category: 'common', provider: 'cko' },
      { cardNo: '6011201559638046790', cardType: 'discover', description: 'discover', category: 'common', provider: 'cko' },
      { cardNo: '6445979375892355607', cardType: 'discover', description: 'discover', category: 'common', provider: 'cko' },
      { cardNo: '36160940933914', cardType: 'diners', description: 'dinersclub', category: 'common', provider: 'cko' },
      { cardNo: '36160912071610', cardType: 'diners', description: 'dinersclub', category: 'common', provider: 'cko' },
      { cardNo: '3566027046765007', cardType: 'jcb', description: 'jcb', category: 'common', provider: 'cko' },
      { cardNo: '3528257085901927', cardType: 'jcb', description: 'jcb', category: 'common', provider: 'cko' },
      { cardNo: '4010061700000021', cardType: 'other', description: 'cb', category: 'common', provider: 'cko' },
      // 3DS无摩擦（特殊卡）
      { cardNo: '4010056200000018', cardType: 'visa', description: '通过验证', category: 'special', provider: 'cko' },
      { cardNo: '4539628347117863', cardType: 'visa', description: '未通过验证', category: 'special', provider: 'cko' },
      { cardNo: '5234106378657904', cardType: 'mastercard', description: '无法验证', category: 'special', provider: 'cko' },
      { cardNo: '5132562600000029', cardType: 'mastercard', description: '尝试验证', category: 'special', provider: 'cko' },
      { cardNo: '4275765574319271', cardType: 'visa', description: '验证拒绝', category: 'special', provider: 'cko' },
      { cardNo: '378282246310005', cardType: 'amex', description: '卡未注册', category: 'special', provider: 'cko' },
      { cardNo: '5132562600000060', cardType: 'mastercard', description: '通信错误消息', category: 'special', provider: 'cko' },
      { cardNo: '3528982710432481', cardType: 'jcb', description: '无3dsurl', category: 'special', provider: 'cko' },
      // 3DS挑战（特殊卡）
      { cardNo: '5385308360135181', cardType: 'mastercard', description: '通过验证', category: 'special', provider: 'cko' },
      { cardNo: '347411540178242', cardType: 'amex', description: '未通过验证', category: 'special', provider: 'cko' },
      { cardNo: '4150561000000035', cardType: 'visa', description: '无法验证', category: 'special', provider: 'cko' },
      { cardNo: '4152868552773614', cardType: 'visa', description: '尝试验证', category: 'special', provider: 'cko' },
      { cardNo: '5341034800000016', cardType: 'mastercard', description: '验证拒绝', category: 'special', provider: 'cko' },
      { cardNo: '5341034800000040', cardType: 'mastercard', description: '通信错误消息', category: 'special', provider: 'cko' },
      { cardNo: '3528682570029332', cardType: 'jcb', description: '无3dsurl', category: 'special', provider: 'cko' },
      // 各种场景卡（特殊卡）
      { cardNo: '4484070000035519', cardType: 'visa', description: '未开通3DS', category: 'special', provider: 'cko' },
      { cardNo: '4485040371536584', cardType: 'visa', description: '开通3DS', category: 'special', provider: 'cko' },
      { cardNo: '4500622868341387', cardType: 'visa', description: '强制走3DS', category: 'special', provider: 'cko' },
      { cardNo: '4485381577182090', cardType: 'visa', description: '非法卡号', category: 'special', provider: 'cko' },
      { cardNo: '4897453568485113', cardType: 'visa', description: '欺诈卡', category: 'special', provider: 'cko' },
      { cardNo: '4734868958733862', cardType: 'visa', description: 'CVV2故障', category: 'special', provider: 'cko' },
      { cardNo: '4024007103573027', cardType: 'visa', description: '无效交易', category: 'special', provider: 'cko' },
      { cardNo: '4544249167673670', cardType: 'visa', description: '余额不足', category: 'special', provider: 'cko' },
      { cardNo: '4556294593757189', cardType: 'visa', description: '超出限额', category: 'special', provider: 'cko' },
      { cardNo: '4818924250131070', cardType: 'visa', description: '受限卡', category: 'special', provider: 'cko' },
      { cardNo: '4556253752712245', cardType: 'visa', description: '违规卡', category: 'special', provider: 'cko' },
      { cardNo: '4539253655711767', cardType: 'visa', description: '被盗卡', category: 'special', provider: 'cko' },
      { cardNo: '4941202060999329', cardType: 'visa', description: '丢失卡', category: 'special', provider: 'cko' },
      { cardNo: '4724117215951699', cardType: 'visa', description: '过期卡', category: 'special', provider: 'cko' },
      { cardNo: '4024007162185267', cardType: 'visa', description: '无发卡行', category: 'special', provider: 'cko' },
      { cardNo: '4532819413487978', cardType: 'visa', description: '未激活卡', category: 'special', provider: 'cko' },
      { cardNo: '4567361325981788', cardType: 'visa', description: '发卡行止付', category: 'special', provider: 'cko' },
      { cardNo: '4659465888705671', cardType: 'visa', description: '持卡人止付', category: 'special', provider: 'cko' },
      { cardNo: '4732789363145785', cardType: 'visa', description: '无安全模块', category: 'special', provider: 'cko' },
      { cardNo: '4000140543766022', cardType: 'visa', description: '操作or金额异常', category: 'special', provider: 'cko' },
      { cardNo: '4095254802642505', cardType: 'visa', description: '超时or异常', category: 'special', provider: 'cko' },
      { cardNo: '4111111111111129', cardType: 'visa', description: '需联系发卡行', category: 'special', provider: 'cko' }
    ]
    
    defaultCkoCards.forEach(card => {
      addTestCard(card)
    })
  }
}

/**
 * 初始化Stripe测试卡号（如果不存在）
 */
export function initStripeTestCards() {
  const existingCards = getAllTestCards()
  const stripeCards = existingCards.filter(card => card.provider === 'stripe')
  
  if (stripeCards.length === 0) {
    // 初始化Stripe测试卡号
    const defaultStripeCards = [
      // 常用卡
      { cardNo: '4242424242424242', cardType: 'visa', description: 'Visa', category: 'common', provider: 'stripe' },
      { cardNo: '4000056655665556', cardType: 'visa', description: 'Visa（借记卡）', category: 'common', provider: 'stripe' },
      { cardNo: '5555555555554444', cardType: 'mastercard', description: 'Mastercard', category: 'common', provider: 'stripe' },
      { cardNo: '378282246310005', cardType: 'amex', description: 'American Express', category: 'common', provider: 'stripe' },
      { cardNo: '6011111111111117', cardType: 'discover', description: 'Discover', category: 'common', provider: 'stripe' },
      { cardNo: '3056930009020004', cardType: 'diners', description: 'Diners Club', category: 'common', provider: 'stripe' },
      { cardNo: '3566002020360505', cardType: 'jcb', description: 'JCB', category: 'common', provider: 'stripe' },
      // 特殊卡
      { cardNo: '4000000000003220', cardType: 'visa', description: '3D卡', category: 'special', provider: 'stripe' },
      { cardNo: '4000008400001629', cardType: 'visa', description: '3D卡拒绝', category: 'special', provider: 'stripe' },
      { cardNo: '378282246310005', cardType: 'amex', description: '不支持3D', category: 'special', provider: 'stripe' },
      { cardNo: '4000000000005126', cardType: 'visa', description: '退款失败卡', category: 'special', provider: 'stripe' },
      { cardNo: '4000000000000259', cardType: 'visa', description: '欺诈卡', category: 'special', provider: 'stripe' },
      { cardNo: '4000000000002685', cardType: 'visa', description: '未收到产品卡', category: 'special', provider: 'stripe' },
      { cardNo: '4100000000000019', cardType: 'visa', description: 'Radar风控拒绝卡', category: 'special', provider: 'stripe' },
      { cardNo: '4000000000000002', cardType: 'visa', description: '拒付卡', category: 'special', provider: 'stripe' },
      { cardNo: '4000000000009995', cardType: 'visa', description: '资金不足拒付', category: 'special', provider: 'stripe' },
      { cardNo: '4000000000000127', cardType: 'visa', description: '错误CVC拒付', category: 'special', provider: 'stripe' }
    ]
    
    defaultStripeCards.forEach(card => {
      addTestCard(card)
    })
  }
}

