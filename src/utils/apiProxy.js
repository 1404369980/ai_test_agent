/**
 * API 代理工具
 * 使用后端代理接口解决 CORS 跨域问题
 * 后端代理接口路径：http://127.0.0.1:8080/proxy/payment（可通过环境变量配置）
 * 请求格式：所有代理请求都使用 POST 方法
 * - 请求头中包含 X-Target-URL、Content-Type 等普通请求头
 * - 请求头中包含 header_data（JSON 字符串），包含所有签名相关的请求头（x-paykka-*）
 * - body 中包含原始请求体（GET 请求时 body 可以为空）
 */

// 后端代理接口的基础路径（可通过环境变量配置）
// 格式：http://host:port/path 或 /path（相对路径）
const PROXY_BASE_URL = import.meta.env.VITE_PROXY_BASE_URL || 'http://127.0.0.1:8080/proxy/payment'

/**
 * 获取代理后的 API URL
 * 使用后端代理接口，通过 X-Target-URL 请求头指定目标地址
 * 
 * @param {string} baseUrl - 原始 API 基础地址
 * @param {string} path - API 路径（如 '/v3/payment/acq/session'）
 * @returns {string} 后端代理接口的 URL
 */
export function getProxyUrl(baseUrl, path = '') {
  // 构建完整的目标 URL
  const targetUrl = `${baseUrl}${path}`
  
  // 检查是否是本地服务（localhost/127.0.0.1），且不是后端代理服务
  // 如果是本地服务且端口不是 8080，可以直接访问（不需要代理）
  try {
    const url = new URL(targetUrl)
    const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
    const isBackendProxy = url.port === '8080' || url.hostname.includes('8080')
    
    // 如果是本地服务但不是后端代理，直接返回（不需要代理）
    if (isLocalhost && !isBackendProxy) {
      return targetUrl
    }
  } catch (e) {
    // 如果 baseUrl 不是有效的 URL，直接返回
    return targetUrl
  }
  
  // 使用后端代理接口
  return PROXY_BASE_URL
}

/**
 * 获取代理请求头
 * 将签名相关的请求头放到 header_data 中（JSON 字符串），其他请求头正常传递
 * 
 * @param {string} baseUrl - 原始 API 基础地址
 * @param {string} path - API 路径（如 '/v3/payment/acq/session'）
 * @param {Object} headers - 原始请求头
 * @returns {Object|null} 代理请求头对象，如果是本地服务则返回 null
 */
export function getProxyHeaders(baseUrl, path = '', headers = {}) {
  // 构建完整的目标 URL
  const targetUrl = `${baseUrl}${path}`
  
  // 检查是否是 localhost，如果是则不需要代理
  try {
    const url = new URL(targetUrl)
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      // 本地服务直接返回，不使用代理
      return null
    }
  } catch (e) {
    // 如果 baseUrl 不是有效的 URL，直接返回 null
    return null
  }
  
  // 分离签名相关的请求头和其他请求头
  const signatureHeaders = {}
  const otherHeaders = {}
  
  // 签名相关的请求头前缀
  const signaturePrefixes = ['x-paykka-', 'X-PayKKa-']
  
  for (const key in headers) {
    const lowerKey = key.toLowerCase()
    // 检查是否是签名相关的请求头
    if (signaturePrefixes.some(prefix => lowerKey.startsWith(prefix.toLowerCase()))) {
      signatureHeaders[key] = headers[key]
    } else {
      // 其他请求头（如 Content-Type）
      otherHeaders[key] = headers[key]
    }
  }
  
  // 构建代理请求头
  const proxyHeaders = {
    ...otherHeaders,
    'X-Target-URL': targetUrl, // 必填：目标 URL
    'Content-Type': 'application/json' // 确保 Content-Type 正确
  }
  
  // 如果有签名相关的请求头，将其序列化为 JSON 字符串放到 header_data 中
  if (Object.keys(signatureHeaders).length > 0) {
    proxyHeaders['header_data'] = JSON.stringify(signatureHeaders)
  }
  
  return proxyHeaders
}


