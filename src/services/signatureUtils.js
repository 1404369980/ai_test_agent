/**
 * PayKKa 签名工具
 * 提供签名相关的公共方法
 */

import * as forge from 'node-forge'

/**
 * 生成请求头随机数（nonce）
 * 生成10-100字符的随机字符串
 * @returns {string} 随机字符串
 */
export function generateHeaderNonce() {
  const length = Math.floor(Math.random() * 91) + 10 // 10-100字符
  let nonce = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return nonce
}

/**
 * 格式化私钥为PEM格式（支持Base64 PKCS8格式）
 * @param {string} privateKey - 私钥字符串（可能是Base64 PKCS8或PEM格式）
 * @returns {string} PEM格式的私钥
 */
export function formatPrivateKeyToPem(privateKey) {
  // 移除所有空白字符
  const cleaned = privateKey.replace(/\s+/g, '')
  
  // 如果已经是PEM格式（包含BEGIN和END），直接返回
  if (cleaned.includes('BEGIN') || cleaned.includes('END')) {
    return privateKey.trim()
  }
  
  // 如果是纯Base64字符串（PKCS8格式），添加PEM头部和尾部
  // 每64个字符换行
  const formatted = cleaned.match(/.{1,64}/g).join('\n')
  return `-----BEGIN PRIVATE KEY-----\n${formatted}\n-----END PRIVATE KEY-----`
}

/**
 * 生成请求头签名 (SHA256_WITH_RSA)
 * 签名方法：HTTP方法\nURL\n时间戳\n随机数\n消息体
 * 
 * @param {string} method - HTTP方法 (e.g., 'POST')
 * @param {string} url - 请求的完整URL路径 (e.g., '/v3/payment/acq/session')
 * @param {number} timestamp - 请求时间戳 (毫秒)
 * @param {string} nonce - 请求随机数
 * @param {string} body - 请求消息体（JSON字符串）
 * @param {string} privateKeyBase64 - RSA私钥（Base64编码的PKCS8格式或PEM格式）
 * @param {boolean} enableLogging - 是否启用日志输出，默认为 true
 * @returns {Promise<string>} URL编码后的签名字符串
 */
export async function generateHeaderSign(method, url, timestamp, nonce, body, privateKeyBase64, enableLogging = true) {
  try {
    // 构建签名字符串：HTTP方法\nURL\n时间戳\n随机数\n消息体
    const signString = `${method}\n${url}\n${timestamp}\n${nonce}\n${body}`
    
    // 打印签名参数
    if (enableLogging) {
      console.log('========== 签名参数 ==========')
      console.log('HTTP方法:', method)
      console.log('URL:', url)
      console.log('时间戳:', timestamp)
      console.log('随机数:', nonce)
      console.log('消息体:', body)
      console.log('签名字符串:', signString)
      console.log('签名字符串（转义显示）:', signString.replace(/\n/g, '\\n'))
      console.log('签名字符串（UTF-8字节长度）:', new TextEncoder().encode(signString).length)
    }
    
    // 格式化私钥为PEM格式（支持Base64 PKCS8格式）
    const formattedKey = formatPrivateKeyToPem(privateKeyBase64)
    
    // 解析PEM格式的私钥（node-forge会自动处理PKCS8格式）
    const privateKey = forge.pki.privateKeyFromPem(formattedKey)
    
    // 创建SHA256消息摘要
    const md = forge.md.sha256.create()
    // 使用UTF-8编码更新内容（与Java的getBytes(StandardCharsets.UTF_8)对应）
    md.update(signString, 'utf8')
    
    // 使用私钥签名（对应Java的signature.sign()）
    const signature = privateKey.sign(md)
    
    // 步骤1 - 转换为Base64编码（对应Java的Base64Utils.encodeToString(signed)）
    const signatureBase64 = forge.util.encode64(signature)
    
    // 步骤2 - 进行URL编码（对应Java的URLEncoder.encode(result)）
    const signatureUrlEncoded = encodeURIComponent(signatureBase64)
    
    // 打印签名结果
    if (enableLogging) {
      console.log('========== 签名结果 ==========')
      console.log('步骤1 - 签名（Base64编码）:', signatureBase64)
      console.log('步骤2 - 签名（URL编码）:', signatureUrlEncoded)
      console.log('签名长度（Base64）:', signatureBase64.length)
      console.log('签名长度（URL编码）:', signatureUrlEncoded.length)
      console.log('================================')
    }
    
    // 返回URL编码后的签名（与Java实现一致：先Base64，再URL编码）
    return signatureUrlEncoded
  } catch (error) {
    console.error('签名生成失败:', error)
    console.error('错误堆栈:', error.stack)
    throw new Error('签名生成失败: ' + error.message)
  }
}

/**
 * 生成签名（自动生成timestamp和nonce）
 * 这是一个便捷方法，自动生成时间戳和随机数，然后调用签名方法
 * 
 * @param {string} method - HTTP方法 (e.g., 'POST')
 * @param {string} url - 请求的完整URL路径 (e.g., '/v3/payment/acq/session')
 * @param {string} body - 请求消息体（JSON字符串）
 * @param {string} privateKeyBase64 - RSA私钥（Base64编码的PKCS8格式或PEM格式）
 * @param {number} timestamp - 可选，时间戳（如果不提供则自动生成）
 * @param {string} nonce - 可选，随机数（如果不提供则自动生成）
 * @param {boolean} enableLogging - 是否启用日志输出，默认为 true
 * @returns {Promise<Object>} 包含签名、时间戳和随机数的对象 {sign, timestamp, nonce}
 */
export async function generateSignatureWithAutoParams(method, url, body, privateKeyBase64, timestamp = null, nonce = null, enableLogging = true) {
  // 如果没有提供时间戳，自动生成
  const finalTimestamp = timestamp || Date.now()
  
  // 如果没有提供随机数，自动生成
  const finalNonce = nonce || generateHeaderNonce()
  
  // 生成签名
  const sign = await generateHeaderSign(method, url, finalTimestamp, finalNonce, body, privateKeyBase64, enableLogging)
  
  return {
    sign,
    timestamp: finalTimestamp,
    nonce: finalNonce
  }
}


