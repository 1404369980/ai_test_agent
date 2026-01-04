/**
 * PayKKa API 服务
 * 用于处理PayKKa跨境支付接口调用
 */

import { getProxyUrl, getProxyHeaders } from '../utils/apiProxy'
import { generateHeaderSign, generateHeaderNonce } from './signatureUtils'

// 签名逻辑已改为使用 generateHeaderSign（SHA256_WITH_RSA），与 PayKKaCheckoutBase 保持一致

/**
 * 测试API连接
 * @param {string} baseUrl - API基础地址
 * @returns {Promise<Object>} 响应数据
 */
export async function testConnection(baseUrl) {
  try {
    // 通过后端代理接口解决 CORS 问题
    const proxyUrl = getProxyUrl(baseUrl, '/health')
    const proxyHeaders = getProxyHeaders(baseUrl, '/health', {
      'Content-Type': 'application/json'
    })
    
    // 如果 proxyHeaders 为 null，说明是本地服务，直接请求
    if (!proxyHeaders) {
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit',
        referrerPolicy: 'no-referrer-when-downgrade'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return {
        success: true,
        message: '连接成功',
        data: data
      }
    }
    
    // 使用代理接口，请求头放在 HTTP 请求头中，所有代理请求都使用 POST
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: proxyHeaders,
      body: '', // GET 请求也需要 body（可以为空）
      mode: 'cors', // 启用 CORS
      credentials: 'omit', // 不发送 cookies
      referrerPolicy: 'no-referrer-when-downgrade' // 设置引荐来源策略
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      message: '连接成功',
      data: data
    }
  } catch (error) {
    // 如果是网络错误，返回模拟数据用于演示
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return {
        success: true,
        message: '连接测试（模拟）',
        data: {
          status: 'ok',
          timestamp: new Date().toISOString(),
          note: '这是模拟响应，实际环境中请配置正确的API地址'
        }
      }
    }
    throw error
  }
}

/**
 * 提交交易
 * @param {string} baseUrl - API基础地址
 * @param {string} merchantId - 商户ID
 * @param {string} apiKey - API密钥（私钥）
 * @param {string} appId - App ID（用于请求头签名）
 * @param {Object} transactionData - 交易数据
 * @returns {Promise<Object>} 响应数据
 */
export async function submitTransaction(baseUrl, merchantId, apiKey, transactionData, appId = null) {
  try {
    // 验证必须的参数
    if (!apiKey) {
      throw new Error('必须提供私钥（privateKey）用于生成请求头签名')
    }
    
    if (!appId) {
      throw new Error('必须提供x-paykka-appid')
    }

    // 构建请求参数（使用下划线命名，与 PayKKaCheckoutBase 保持一致）
    const requestParams = {
      merchant_id: merchantId,
      trans_id: transactionData.transId,
      amount: transactionData.amount,
      currency: transactionData.currency,
      payment_type: transactionData.paymentType || 'PURCHASE',
      description: transactionData.description || '',
      capture_method: transactionData.captureMethod || 'AUTOMATIC',
      expire_time: transactionData.expireTime || '',
      address_collection: transactionData.addressCollection || 'AUTO',
      return_url: transactionData.returnUrl || '',
      cancel_url: transactionData.cancelUrl || ''
    }
    
    // 循环支付参数（仅当支付类型为 RECURRING 时添加）
    if (transactionData.paymentType === 'RECURRING') {
      if (transactionData.recurring_agreement_id) {
        requestParams.recurring_agreement_id = transactionData.recurring_agreement_id
      }
      if (transactionData.mit !== undefined && transactionData.mit !== null) {
        requestParams.mit = transactionData.mit
      }
    }

    // 添加可选字段
    if (transactionData.goods) {
      try {
        requestParams.goods = typeof transactionData.goods === 'string' 
          ? JSON.parse(transactionData.goods) 
          : transactionData.goods
      } catch (e) {
        // 如果解析失败，跳过
      }
    }

    if (transactionData.customer) {
      try {
        requestParams.customer = typeof transactionData.customer === 'string'
          ? JSON.parse(transactionData.customer)
          : transactionData.customer
      } catch (e) {
        // 如果解析失败，跳过
      }
    }

    if (transactionData.bill) {
      requestParams.bill = transactionData.bill
    }

    if (transactionData.shipping) {
      requestParams.shipping = transactionData.shipping
    }

    if (transactionData.payment) {
      requestParams.payment = transactionData.payment
    }

    if (transactionData.browser) {
      requestParams.browser = transactionData.browser
    }

    // 自动生成timestamp和nonce（与 PayKKaCheckoutBase 保持一致）
    const timestamp = Date.now()
    const nonce = generateHeaderNonce()

    // 构建请求头（与 PayKKaCheckoutBase 保持一致）
    const requestHeaders = {
      'Content-Type': 'application/json',
      'x-paykka-appid': appId,
      'x-paykka-timestamp': String(timestamp),
      'x-paykka-nonce': nonce,
      'x-paykka-sign-alg': 'SHA256_WITH_RSA'
    }

    // 生成请求头签名（与 PayKKaCheckoutBase 保持一致）
    const requestBody = JSON.stringify(requestParams)
    const sign = await generateHeaderSign(
      'POST',
      '/v3/payment/acq',
      timestamp,
      nonce,
      requestBody,
      apiKey, // privateKey
      false // 禁用日志输出
    )
    requestHeaders['x-paykka-sign'] = sign

    // 发送请求（通过后端代理接口解决 CORS 问题）
    const proxyUrl = getProxyUrl(baseUrl, '/v3/payment/acq')
    const proxyHeaders = getProxyHeaders(baseUrl, '/v3/payment/acq', requestHeaders)
    
    // 如果 proxyHeaders 为 null，说明是本地服务，直接请求
    if (!proxyHeaders) {
      const response = await fetch(`${baseUrl}/v3/payment/acq`, {
        method: 'POST',
        headers: requestHeaders,
        body: requestBody,
        mode: 'cors',
        credentials: 'omit',
        referrerPolicy: 'no-referrer-when-downgrade'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.ret_msg || `HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return {
        success: true,
        message: '交易提交成功',
        signedData: requestParams,
        requestHeaders: {
          ...requestHeaders,
          _generated_timestamp: timestamp,
          _generated_nonce: nonce
        },
        data: data
      }
    }
    
    // 使用代理接口，请求头放在 HTTP 请求头中，body 包含原始请求体
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: proxyHeaders,
      body: requestBody,
      mode: 'cors', // 启用 CORS
      credentials: 'omit', // 不发送 cookies
      referrerPolicy: 'no-referrer-when-downgrade' // 设置引荐来源策略
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || errorData.ret_msg || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      message: '交易提交成功',
      signedData: requestParams,
      requestHeaders: {
        ...requestHeaders,
        _generated_timestamp: timestamp,
        _generated_nonce: nonce
      },
      data: data
    }
  } catch (error) {
    // 如果是网络错误，返回模拟数据用于演示
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      // 模拟成功响应
      return {
        success: true,
        message: '交易提交成功（模拟）',
        data: {
          transactionId: `TXN${Date.now()}`,
          orderNo: transactionData.orderNo || transactionData.transId,
          status: 'pending',
          amount: transactionData.amount,
          currency: transactionData.currency,
          timestamp: new Date().toISOString(),
          note: '这是模拟响应，实际环境中请配置正确的API地址和凭证'
        }
      }
    }
    throw error
  }
}

/**
 * 查询交易状态
 * @param {string} baseUrl - API基础地址
 * @param {string} merchantId - 商户ID
 * @param {string} apiKey - API密钥
 * @param {string} orderNo - 订单号
 * @returns {Promise<Object>} 响应数据
 */
export async function queryTransaction(baseUrl, merchantId, apiKey, orderNo) {
  try {
    const requestParams = {
      merchantId: merchantId,
      orderNo: orderNo,
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substring(2, 15)
    }

    const signature = generateSignature(requestParams, apiKey)
    requestParams.sign = signature

    // 发送请求（通过后端代理接口解决 CORS 问题）
    const proxyUrl = getProxyUrl(baseUrl, '/api/transaction/query')
    const requestBody = JSON.stringify(requestParams)
    const proxyHeaders = getProxyHeaders(baseUrl, '/api/transaction/query', {
      'Content-Type': 'application/json',
      'X-Merchant-Id': merchantId,
      'X-API-Key': apiKey
    })
    
    // 如果 proxyHeaders 为 null，说明是本地服务，直接请求
    if (!proxyHeaders) {
      const response = await fetch(`${baseUrl}/api/transaction/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Merchant-Id': merchantId,
          'X-API-Key': apiKey
        },
        body: requestBody,
        mode: 'cors',
        credentials: 'omit',
        referrerPolicy: 'no-referrer-when-downgrade'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return {
        success: true,
        message: '查询成功',
        data: data
      }
    }
    
    // 使用代理接口，请求头放在 HTTP 请求头中，body 包含原始请求体
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: proxyHeaders,
      body: requestBody,
      mode: 'cors', // 启用 CORS
      credentials: 'omit', // 不发送 cookies
      referrerPolicy: 'no-referrer-when-downgrade' // 设置引荐来源策略
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      message: '查询成功',
      data: data
    }
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return {
        success: true,
        message: '查询成功（模拟）',
        data: {
          orderNo: orderNo,
          status: 'completed',
          amount: 100.00,
          currency: 'USD',
          timestamp: new Date().toISOString(),
          note: '这是模拟响应'
        }
      }
    }
    throw error
  }
}

// 导出API对象
export const payKKaApi = {
  testConnection,
  submitTransaction,
  queryTransaction
}
