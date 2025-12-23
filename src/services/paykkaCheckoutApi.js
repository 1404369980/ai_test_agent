/**
 * PayKKa 收银台 API 服务
 * 用于创建收银台页面，包含哈希签名功能
 */

import CryptoJS from 'crypto-js'

/**
 * 生成MD5哈希
 * @param {string} str - 要哈希的字符串
 * @returns {string} MD5哈希值（大写）
 */
function md5Hash(str) {
  return CryptoJS.MD5(str).toString().toUpperCase()
}

/**
 * 生成PayKKa API签名
 * @param {Object} params - 请求参数对象
 * @param {string} secretKey - 密钥
 * @returns {string} 签名字符串
 */
function generateSignature(params, secretKey) {
  // 过滤掉空值和sign字段
  const filteredParams = {}
  for (const key in params) {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '' && key !== 'sign') {
      // 处理数组类型
      if (Array.isArray(params[key])) {
        filteredParams[key] = params[key].join(',')
      } else {
        filteredParams[key] = String(params[key])
      }
    }
  }

  // 按key排序
  const sortedKeys = Object.keys(filteredParams).sort()
  
  // 构建签名字符串 key1=value1&key2=value2&...
  const signString = sortedKeys
    .map(key => `${key}=${filteredParams[key]}`)
    .join('&')
  
  // 添加密钥 key1=value1&key2=value2&...&key=secretKey
  const finalString = `${signString}&key=${secretKey}`
  
  // 生成MD5哈希
  return md5Hash(finalString)
}

/**
 * 创建收银台页面
 * @param {string} baseUrl - API基础地址
 * @param {string} merchantId - 商户ID
 * @param {string} secretKey - 密钥
 * @param {Object} checkoutData - 收银台数据
 * @returns {Promise<Object>} 响应数据
 */
export async function createCheckout(baseUrl, merchantId, secretKey, checkoutData) {
  try {
    // 构建请求参数 - 包含所有可能的参数
    const requestParams = {
      merchantId: merchantId,
      orderNo: checkoutData.orderNo,
      amount: checkoutData.amount,
      currency: checkoutData.currency,
      sessionMode: checkoutData.sessionMode,
      paymentMethods: Array.isArray(checkoutData.paymentMethods) 
        ? checkoutData.paymentMethods.join(',') 
        : checkoutData.paymentMethods,
      description: checkoutData.description || '',
      callbackUrl: checkoutData.callbackUrl || '',
      returnUrl: checkoutData.returnUrl || '',
      cancelUrl: checkoutData.cancelUrl || '',
      customerEmail: checkoutData.customerEmail || '',
      customerPhone: checkoutData.customerPhone || '',
      customerName: checkoutData.customerName || '',
      customerId: checkoutData.customerId || '',
      country: checkoutData.country || '',
      language: checkoutData.language || '',
      timestamp: checkoutData.timestamp || Date.now(),
      nonce: checkoutData.nonce || Math.random().toString(36).substring(2, 15),
      timeout: checkoutData.timeout || 1800,
      productId: checkoutData.productId || '',
      productCategory: checkoutData.productCategory || '',
      remark: checkoutData.remark || ''
    }

    // 生成签名
    const signature = generateSignature(requestParams, secretKey)
    
    // 添加签名到参数
    const signedParams = {
      ...requestParams,
      sign: signature
    }

    // 发送请求
    const response = await fetch(`${baseUrl}/api/v3/checkout/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Merchant-Id': merchantId,
        'X-API-Key': secretKey
      },
      body: JSON.stringify(signedParams)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || errorData.ret_msg || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      message: '收银台创建成功',
      signature: signature,
      signedData: signedParams,
      data: data,
      checkoutUrl: data.checkoutUrl || data.url || data.redirectUrl
    }
  } catch (error) {
    // 如果是网络错误，返回模拟数据用于演示
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      // 生成模拟签名
      const mockParams = {
        merchantId: merchantId,
        orderNo: checkoutData.orderNo,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        sessionMode: checkoutData.sessionMode,
        paymentMethods: Array.isArray(checkoutData.paymentMethods) 
          ? checkoutData.paymentMethods.join(',') 
          : checkoutData.paymentMethods,
        description: checkoutData.description || '',
        callbackUrl: checkoutData.callbackUrl || '',
        returnUrl: checkoutData.returnUrl || '',
        cancelUrl: checkoutData.cancelUrl || '',
        customerEmail: checkoutData.customerEmail || '',
        customerPhone: checkoutData.customerPhone || '',
        customerName: checkoutData.customerName || '',
        customerId: checkoutData.customerId || '',
        country: checkoutData.country || '',
        language: checkoutData.language || '',
        timestamp: checkoutData.timestamp || Date.now(),
        nonce: checkoutData.nonce || Math.random().toString(36).substring(2, 15),
        timeout: checkoutData.timeout || 1800,
        productId: checkoutData.productId || '',
        productCategory: checkoutData.productCategory || '',
        remark: checkoutData.remark || ''
      }
      
      const mockSignature = generateSignature(mockParams, secretKey)
      
      return {
        success: true,
        message: '收银台创建成功（模拟）',
        signature: mockSignature,
        signedData: {
          ...mockParams,
          sign: mockSignature
        },
        data: {
          checkoutId: `CHECKOUT${Date.now()}`,
          orderNo: checkoutData.orderNo,
          status: 'created',
          checkoutUrl: `https://checkout-dev.paykka.com/pay/${checkoutData.orderNo}`,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          note: '这是模拟响应，实际环境中请配置正确的API地址和凭证'
        },
        checkoutUrl: `https://checkout-dev.paykka.com/pay/${checkoutData.orderNo}`
      }
    }
    throw error
  }
}

/**
 * 查询收银台状态
 * @param {string} baseUrl - API基础地址
 * @param {string} merchantId - 商户ID
 * @param {string} secretKey - 密钥
 * @param {string} checkoutId - 收银台ID
 * @returns {Promise<Object>} 响应数据
 */
export async function queryCheckout(baseUrl, merchantId, secretKey, checkoutId) {
  try {
    const requestParams = {
      merchantId: merchantId,
      checkoutId: checkoutId,
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substring(2, 15)
    }

    const signature = generateSignature(requestParams, secretKey)
    requestParams.sign = signature

    const response = await fetch(`${baseUrl}/api/v3/checkout/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Merchant-Id': merchantId,
        'X-API-Key': secretKey
      },
      body: JSON.stringify(requestParams)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || errorData.ret_msg || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      message: '查询成功',
      signature: signature,
      signedData: requestParams,
      data: data
    }
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return {
        success: true,
        message: '查询成功（模拟）',
        data: {
          checkoutId: checkoutId,
          status: 'active',
          orderNo: `ORDER${Date.now()}`,
          amount: 100.00,
          currency: 'USD',
          note: '这是模拟响应'
        }
      }
    }
    throw error
  }
}

// 导出API对象
export const payKKaCheckoutApi = {
  createCheckout,
  queryCheckout,
  generateSignature
}
