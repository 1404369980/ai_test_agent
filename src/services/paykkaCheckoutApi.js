/**
 * PayKKa 收银台 API 服务
 * 用于创建收银台页面，包含哈希签名功能
 */

import CryptoJS from 'crypto-js'
import { generateHeaderSign } from './signatureUtils'

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
 * 生成请求头签名 (SHA256_WITH_RSA)
 * 签名方法：HTTP方法\nURL\n时间戳\n随机数\n消息体
 * @param {string} method - HTTP方法
 * @param {string} url - URL路径
 * @param {number} timestamp - 时间戳
 * @param {string} nonce - 随机数
 * @param {string} body - 请求消息体（JSON字符串）
 * @param {string} privateKeyPem - RSA私钥（PEM格式）
 * @returns {string} Base64编码的签名
 */
// generateHeaderSign 已从 './signatureUtils' 导入，无需重复定义
// 为了保持向后兼容，重新导出
export { generateHeaderSign }

/**
 * 创建收银台页面
 * @param {string} baseUrl - API基础地址
 * @param {string} merchantId - 商户ID
 * @param {Object} checkoutData - 收银台数据
 * @param {Object} headers - 请求头配置 {appId, timestamp, nonce, signAlg, sign, privateKey}
 * @returns {Promise<Object>} 响应数据
 */
export async function createCheckout(baseUrl, merchantId, checkoutData, headers = null) {
  try {
    // checkoutData 已经是下划线命名的对象，直接使用
    // customer 和 goods 已经是对象，不需要额外处理
    const requestParams = {
      ...checkoutData,
      merchant_id: merchantId, // 确保 merchant_id 使用传入的 merchantId
    }

    // 如果使用新的请求头签名方式，不需要在body中添加sign
    // 否则使用旧的MD5签名方式（兼容）
    let signedParams = { ...requestParams }
    
    if (!headers || !headers.privateKey) {
      // 如果没有提供请求头配置，使用旧的签名方式（需要secretKey，但现在已经移除）
      // 这里保留兼容性，但实际应该使用新的请求头签名方式
      console.warn('建议使用新的请求头签名方式（提供privateKey）')
    }

    // 构建请求头
    const requestHeaders = {
      'Content-Type': 'application/json'
    }
    
    // 使用新的请求头签名方式（必须提供）
    if (!headers || !headers.privateKey) {
      throw new Error('必须提供私钥（privateKey）用于生成请求头签名')
    }
    
    if (!headers.appId) {
      throw new Error('必须提供x-paykka-appid')
    }
    
    // 自动生成timestamp和nonce（如果未提供）
    const timestamp = headers.timestamp || Date.now()
    let nonce = headers.nonce
    if (!nonce) {
      // 生成10-100字符的随机字符串
      const length = Math.floor(Math.random() * 91) + 10
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      nonce = ''
      for (let i = 0; i < length; i++) {
        nonce += chars.charAt(Math.floor(Math.random() * chars.length))
      }
    }
    
    requestHeaders['x-paykka-appid'] = headers.appId
    requestHeaders['x-paykka-timestamp'] = String(timestamp)
    requestHeaders['x-paykka-nonce'] = nonce
    requestHeaders['x-paykka-sign-alg'] = headers.signAlg || 'SHA256_WITH_RSA'
    
    // 如果已有签名，直接使用；否则生成签名
    if (headers.sign) {
      console.log('========== 使用已有签名 ==========')
      console.log('签名:', headers.sign)
      requestHeaders['x-paykka-sign'] = headers.sign
    } else {
      const requestBody = JSON.stringify(signedParams)
      console.log('========== 开始生成签名 ==========')
      const sign = await generateHeaderSign(
        'POST',
        '/v3/payment/acq/session',
        timestamp,
        nonce,
        requestBody,
        headers.privateKey
      )
      requestHeaders['x-paykka-sign'] = sign
    }
    
    // 打印最终请求头
    console.log('========== 最终请求头 ==========')
    console.log('请求头:', JSON.stringify(requestHeaders, null, 2))
    console.log('================================')

    // 发送请求
    const response = await fetch(`${baseUrl}/v3/payment/acq/session`, {
      method: 'POST',
      headers: requestHeaders,
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
      signedData: signedParams,
      requestHeaders: {
        ...requestHeaders,
        // 返回实际使用的timestamp和nonce，方便前端显示
        _generated_timestamp: timestamp,
        _generated_nonce: nonce
      },
      data: data,
      checkoutUrl: data.data?.session_url || data.checkoutUrl || data.url || data.redirectUrl
    }
  } catch (error) {
    // 如果是网络错误，返回模拟数据用于演示
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      // 生成模拟签名
      const mockParams = {
        merchant_id: merchantId,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        session_mode: checkoutData.sessionMode,
        description: checkoutData.description || '',
        callback_url: checkoutData.callbackUrl || '',
        return_url: checkoutData.returnUrl || '',
        cancel_url: checkoutData.cancelUrl || '',
        customer_email: checkoutData.customerEmail || '',
        customer_phone: checkoutData.customerPhone || '',
        customer_name: checkoutData.customerName || '',
        customer_id: checkoutData.customerId || '',
        country: checkoutData.country || '',
        language: checkoutData.language || '',
        timestamp: checkoutData.timestamp || Date.now(),
        nonce: checkoutData.nonce || Math.random().toString(36).substring(2, 15),
        timeout: checkoutData.timeout || 1800,
        product_id: checkoutData.productId || '',
        product_category: checkoutData.productCategory || '',
        remark: checkoutData.remark || ''
      }
      
      // 生成模拟请求头签名（自动生成timestamp和nonce）
      let mockHeaders = {}
      if (headers && headers.privateKey) {
        // 自动生成timestamp和nonce
        const mockTimestamp = Date.now()
        const mockNonceLength = Math.floor(Math.random() * 91) + 10
        const mockNonceChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let mockNonce = ''
        for (let i = 0; i < mockNonceLength; i++) {
          mockNonce += mockNonceChars.charAt(Math.floor(Math.random() * mockNonceChars.length))
        }
        
        const requestBody = JSON.stringify(mockParams)
        const mockSign = await generateHeaderSign(
          'POST',
          '/v3/payment/acq/session',
          mockTimestamp,
          mockNonce,
          requestBody,
          headers.privateKey
        )
        mockHeaders = {
          'x-paykka-appid': headers.appId || 'MOCK_APP_ID',
          'x-paykka-timestamp': String(mockTimestamp),
          'x-paykka-nonce': mockNonce,
          'x-paykka-sign-alg': 'SHA256_WITH_RSA',
          'x-paykka-sign': mockSign,
          _generated_timestamp: mockTimestamp,
          _generated_nonce: mockNonce
        }
      }
      
      return {
        success: true,
        message: '收银台创建成功（模拟）',
        signedData: mockParams,
        requestHeaders: mockHeaders,
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
      merchant_id: merchantId,
      checkout_id: checkoutId,
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
  generateSignature,
  generateHeaderSign
}
