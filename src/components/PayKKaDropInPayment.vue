<template>
    <div class="dropin-payment">
      <div class="payment-container">
        <div class="payment-header">
          <button @click="goBack" class="back-button">← 返回</button>
          <h1 class="payment-title">PayKKa DropIn 支付</h1>
        </div>
  
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>正在加载支付组件...</p>
        </div>
  
        <div v-else-if="error" class="error-state">
          <div class="error-icon">⚠️</div>
          <h2>加载失败</h2>
          <p>{{ error }}</p>
          <button @click="goBack" class="btn-primary">返回</button>
        </div>
  
        <div class="payment-content">
          <div class="payment-info">
            <div class="info-grid">
            <div class="info-item">
              <span class="info-label">会话ID:</span>
              <span class="info-value">{{ sessionData?.session_id || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">交易ID:</span>
              <span class="info-value">{{ sessionData?.trans_id || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">商户ID:</span>
              <span class="info-value">{{ sessionData?.merchant_id || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">状态:</span>
              <span class="info-value status-badge" :class="getStatusClass(sessionData?.status)">
                {{ sessionData?.status || 'N/A' }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">金额:</span>
              <span class="info-value">{{ formatAmount(sessionData?.amount, sessionData?.currency) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">过期时间:</span>
              <span class="info-value">{{ formatDateTime(sessionData?.expire_time) }}</span>
            </div>
            </div>
          </div>
  
          <div class="payment-component-wrapper">
            <div class="component-container" ref="componentContainer">
            </div>
          </div>
  
          <div class="payment-actions">
            <button @click="goBack" class="btn-primary">返回测试页面</button>
          </div>
        </div>
  
        <!-- <div v-else class="empty-state">
          <div class="empty-icon">💳</div>
          <h2>未找到支付会话</h2>
          <p>请先创建支付会话，然后访问此页面</p>
          <button @click="goToTestPage" class="btn-primary">前往测试页面</button>
        </div> -->
      </div>
  
      <!-- Toast 提示 -->
      <Toast />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import Toast from './Toast.vue'
  import { showError, showInfo, showSuccess, showWarning } from '../utils/toast'
  import { useNavigation } from '../composables/useNavigation'
  // 引入 PayKKa Checkout UI 样式
  import '@paykka/card-checkout-ui/style.css'
  
  const route = useRoute()
  const router = useRouter()
  const { goHome } = useNavigation()
  
  const loading = ref(true)
  const error = ref(null)
  const sessionData = ref(null)
  const cardFieldContainer = ref(null)
  const componentContainer = ref(null)
  let paykkaCheckout = null
  let dropIn = null
  let appleCheckout = null
  let googleCheckout = null
  
  // 返回上一页
  const goBack = () => {
    if (window.history.length > 1) {
      router.go(-1)
    } else {
      router.push('/dropin-test')
    }
  }
  
  // 前往测试页面
  const goToTestPage = () => {
    router.push('/dropin-test')
  }
  
  // 格式化金额
  const formatAmount = (amount, currency) => {
    if (!amount) return 'N/A'
    const formatted = (amount / 100).toFixed(2)
    return `${currency || 'USD'} ${formatted}`
  }
  
  // 格式化日期时间
  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A'
    try {
      const date = new Date(dateTime)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch (e) {
      return dateTime
    }
  }
  
  // 获取状态样式类
  const getStatusClass = (status) => {
    if (!status) return ''
    const statusMap = {
      'PROCESSING': 'status-processing',
      'SUCCESS': 'status-success',
      'FAILED': 'status-failed',
      'EXPIRED': 'status-expired',
      'CANCELLED': 'status-cancelled'
    }
    return statusMap[status] || ''
  }
  
  // 初始化 PayKKa DropIn 组件
  const initPayKKaDropIn = async () => {
    console.log('开始初始化 PayKKa DropIn', {
      hasSessionData: !!sessionData.value,
      sessionId: sessionData.value?.session_id,
      hasContainer: !!cardFieldContainer.value,
      hasComponentContainer: !!componentContainer.value
    })
  
    if (!sessionData.value) {
      console.error('缺少 sessionData')
      error.value = '缺少会话数据'
      loading.value = false
      return
    }
  
    if (!sessionData.value.session_id) {
      console.error('缺少 session_id', sessionData.value)
      error.value = '缺少会话ID (session_id)'
      loading.value = false
      return
    }
  
    // 等待 DOM 渲染完成
    await nextTick()
    
    if (!componentContainer.value) {
      console.error('组件容器未找到，等待 DOM 渲染...')
      await nextTick()
      if (!componentContainer.value) {
        error.value = '组件容器未找到，请刷新页面重试'
        loading.value = false
        return
      }
    }
  
    try {
      // 优先使用 npm 包导入 PayKKa Checkout UI
      let PayKKaCardCheckoutUI
      try {
        // 尝试从 npm 包导入
        const paykkaModule = await import('@paykka/card-checkout-ui')
        PayKKaCardCheckoutUI = paykkaModule
        console.log('PayKKaCardCheckoutUI 库加载成功（npm 包）')
      } catch (e) {
        console.warn('npm 包加载失败，尝试使用 CDN:', e)
        // 如果 npm 包加载失败，回退到 CDN
        if (typeof window.PayKKaCardCheckoutUI === 'undefined') {
          await loadPayKKaScripts()
        }
        PayKKaCardCheckoutUI = window.PayKKaCardCheckoutUI
      }
  
      if (!PayKKaCardCheckoutUI) {
        throw new Error('PayKKaCardCheckoutUI 未加载')
      }
  
      const { DropIn, ApplePay, GooglePay, setFraudDetectionEnv, PayKKaCheckout, setApiUrl, setCDNUrl } = PayKKaCardCheckoutUI
  
      // 从 baseUrl 推断环境
      const baseUrl = sessionData.value.baseUrl || ''
      let apiUrl = 'https://checkout-fat.eu.paykka.com'
      let cdnUrl = 'https://checkout-fat.eu.paykka.com/cp'
      
      if (baseUrl.includes('dev')) {
        apiUrl = 'https://checkout-dev.eu.paykka.com'
        cdnUrl = 'https://checkout-fat.eu.paykka.com/cp'
      } else if (baseUrl.includes('sandbox')) {
        apiUrl = 'https://checkout-sandbox.eu.paykka.com'
        cdnUrl = 'https://checkout-fat.eu.paykka.com/cp'
      }
  
      // 获取 clientKey（从响应数据、配置或使用默认值）
      const clientKey =  'ck_be5ff3c3f7e3e46225d5253761cfd010'
  
      // 从响应数据中提取其他配置信息
      const responseData = sessionData.value.responseData || {}
      const sessionInfo = responseData.data || sessionData.value
  
      // 从 baseUrl 推断环境
      let env = 'eu' // 默认值
      if (baseUrl.includes('dev') || baseUrl.includes('fat')) {
        env = 'dev'
      } else if (baseUrl.includes('sandbox')) {
        env = 'sandbox'
      }
  
      console.log('创建 PayKKaCheckout 实例，使用数据:', {
        sessionId: sessionData.value.session_id,
        clientKey: 'ck_be5ff3c3f7e3e46225d5253761cfd010',
      //   env,
        apiUrl,
        sessionMode: sessionInfo.session_mode,
        merchantId: sessionInfo.merchant_id,
        transId: sessionInfo.trans_id,
        amount: sessionInfo.amount,
        currency: sessionInfo.currency
      })
  
      // 获取返回 URL
      const returnUrl = sessionInfo.return_url || sessionData.value.returnUrl || '/payment/success'
      const cancelUrl = sessionInfo.cancel_url || sessionData.value.cancelUrl || '/payment/cancel'
  
      // 设置欺诈检测环境（如果需要）
      if (setFraudDetectionEnv) {
        setFraudDetectionEnv({
          SR: 'pk_test_51QaC2P5VarcojPHdg13yagk5TqrGkIkeK8I21BgQUZe8BzyRmbtmOg3dKsXjkxt6JlsjyjJMTvBH9dFMCZWRxOkt00tWQ1eHFU'
        })
      }
  
      // 注意：setApiUrl 和 setCDNUrl 应该在创建 PayKKaCheckout 实例之前调用
      // 但如果 PayKKaCheckout 通过 env 参数自动配置，可能不需要手动设置
      // 先尝试不设置，如果 env 参数足够的话
      // if (setApiUrl && setCDNUrl && apiUrl && cdnUrl) {
      //   try {
      //     setApiUrl(apiUrl)
      //     setCDNUrl(cdnUrl)
      //   } catch (e) {
      //     console.warn('设置 API/CDN URL 失败:', e)
      //   }
      // }
  
      // setApiUrl(apiUrl)
      // setCDNUrl(cdnUrl)
  
  
      // 创建 PayKKaCheckout 实例（按照官方示例）
      // 注意：当使用 env 参数时，PayKKaCheckout 会自动配置 API 和 CDN URL
      // 不需要手动调用 setApiUrl 和 setCDNUrl
      paykkaCheckout = new PayKKaCheckout({
        sessionId: sessionData.value.session_id,
        clientKey: clientKey,
        env: 'sandbox',
        locale: 'en-GB',
        hidePaymentButton: false,
        threeDSFrame: {
          modalWidth: '350px',
          modalHeight: '500px',
        },
        _envConfig: {
        api: apiUrl,
        cdn: cdnUrl,
        fraudDetection: {
              WP: {
                ddcOrigin: 'https://centinelapistag.cardinalcommerce.com',
                ddcCollectUrl: 'https://centinelapistag.cardinalcommerce.com/V2/Cruise/Collect'
              },
              WJ: {
                organizationId: 'afevfjm6',
                profilingDomain: 'ddc-test.worldpay.com'
              }
            }
      },
        onPaymentMethodsReady: (methods) => {
          console.log('支持的支付方式', methods)
          showInfo(`支持的支付方式已加载: ${methods.length} 种`)
        },
        onInitError: (error) => {
          console.log('初始化错误', error)
          showError(`支付组件初始化失败: ${error.message || error}`)
          loading.value = false
        },
        onSubmit: (formValidateError) => {
          console.log('提交表单全局事件', formValidateError)
          if (formValidateError) {
            showWarning('表单验证失败，请检查输入')
          }
        },
        onSuccess: ({ returnUrl: successReturnUrl }) => {
          console.log('支付成功全局事件', successReturnUrl)
          showSuccess('支付成功！')
          const finalReturnUrl = successReturnUrl || returnUrl
          setTimeout(() => {
            window.location.href = finalReturnUrl
          }, 2000)
        },
        onTimeout: () => {
          console.log('支付超时全局事件')
          showWarning('支付超时，请重试')
        },
        onExpired: () => {
          console.log('会话过期或失效全局事件')
          showError('支付会话已过期，请重新创建')
          setTimeout(() => {
            window.location.href = cancelUrl
          }, 2000)
        },
        onError: (error) => {
          console.log('支付失败全局事件', error)
          showError('支付失败，请重试')
        }
      })
  
    
  
      console.log('PayKKaCheckout 实例创建成功')
  
      // 创建 DropIn 实例
      console.log('创建 DropIn 组件实例')
      dropIn = paykkaCheckout.create(DropIn, {
        paymentMethods: {
          card: {
            showCardBrands: true,
            onSubmit: (formValidateError) => {
              console.log('Card 提交表单事件', formValidateError)
              if (formValidateError) {
                showWarning('表单验证失败，请检查输入')
              }
            },
            onSuccess: () => {
              console.log('Card 支付成功')
              showSuccess('支付成功！')
              setTimeout(() => {
                window.location.href = returnUrl
              }, 2000)
            }
          },
          aliPay: {
            onSuccess: () => {
              console.log('AliPay 支付成功')
              showSuccess('支付成功！')
              setTimeout(() => {
                window.location.href = returnUrl
              }, 2000)
            }
          },
          wechatPay: {
            onSuccess: () => {
              console.log('WeChatPay 支付成功')
              showSuccess('支付成功！')
              setTimeout(() => {
                window.location.href = returnUrl
              }, 2000)
            }
          }
        },
        layout: 'tabs',
        onSubmit: (formValidateError) => {
          console.log('DropIn 提交表单事件', formValidateError)
          if (formValidateError) {
            showWarning('表单验证失败，请检查输入')
          }
        },
        onSuccess: ({ returnUrl: successReturnUrl }) => {
          console.log('DropIn 支付成功事件', successReturnUrl)
          showSuccess('支付成功！')
          const finalReturnUrl = successReturnUrl || returnUrl
          setTimeout(() => {
            window.location.href = finalReturnUrl
          }, 2000)
        },
        onTimeout: () => {
          console.log('DropIn 支付超时事件')
          showWarning('支付超时，请重试')
        },
        onExpired: () => {
          console.log('DropIn 会话过期或失效事件')
          showError('支付会话已过期，请重新创建')
          setTimeout(() => {
            window.location.href = cancelUrl
          }, 2000)
        },
        onError: (error) => {
          console.log('DropIn 支付失败事件', error)
          showError('支付失败，请重试')
        }
      })
  
      // 挂载 DropIn 到容器
      console.log('挂载 DropIn 组件到容器', componentContainer.value)
      if (!componentContainer.value) {
        throw new Error('组件容器未找到，无法挂载 DropIn')
      }
      
      // 直接挂载到 componentContainer
      dropIn.mount(componentContainer.value)
      console.log('DropIn 组件挂载成功')
  
      // 创建 ApplePay 组件（可选）
      try {
        const props = {
          showCardBrands: false,
          onSubmit: (formValidateError) => {
            console.log('ApplePay 提交表单事件', formValidateError)
          },
          onSuccess: () => {
            console.log('ApplePay 支付成功')
            showSuccess('支付成功！')
            setTimeout(() => {
              window.location.href = returnUrl
            }, 2000)
          },
          onExpired: () => {
            console.log('ApplePay 会话过期')
            window.location.replace(cancelUrl)
          }
        }
        // ApplePay 和 GooglePay 需要特定的容器，如果模板中没有这些元素，可以跳过
        // appleCheckout = paykkaCheckout.create(ApplePay, props)
        // appleCheckout.mount('#checkoutApplePayField')
        console.log('ApplePay 组件跳过（容器不存在）')
      } catch (e) {
        console.warn('ApplePay 组件初始化失败:', e)
      }
  
      // 创建 GooglePay 组件（可选）
      try {
        const props = {
          showCardBrands: false,
          onSubmit: (formValidateError) => {
            console.log('GooglePay 提交表单事件', formValidateError)
          },
          onSuccess: () => {
            console.log('GooglePay 支付成功')
            showSuccess('支付成功！')
            setTimeout(() => {
              window.location.href = returnUrl
            }, 2000)
          },
          onExpired: () => {
            console.log('GooglePay 会话过期')
            window.location.replace(cancelUrl)
          }
        }
        // GooglePay 需要特定的容器，如果模板中没有这些元素，可以跳过
        // googleCheckout = paykkaCheckout.create(GooglePay, props)
        // googleCheckout.mount('#checkoutGooglePayField')
        console.log('GooglePay 组件跳过（容器不存在）')
      } catch (e) {
        console.warn('GooglePay 组件初始化失败:', e)
      }
  
      loading.value = false
      showInfo('支付组件加载完成')
    } catch (err) {
      console.error('初始化支付组件失败:', err)
      error.value = `初始化支付组件失败: ${err.message || err}`
      loading.value = false
    }
  }
  
  // 加载 PayKKa 脚本和样式
  const loadPayKKaScripts = () => {
    return new Promise((resolve, reject) => {
      // 检查是否已加载
      if (typeof window.PayKKaCardCheckoutUI !== 'undefined') {
        resolve()
        return
      }
  
      // 加载样式
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://checkout-fat.eu.paykka.com/cp/style.css'
      document.head.appendChild(link)
  
      // 加载脚本
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://checkout-fat.eu.paykka.com/cp/card-checkout-ui.js'
      script.onload = () => {
        console.log('PayKKaCardCheckoutUI 脚本加载成功')
        if (typeof window.PayKKaCardCheckoutUI !== 'undefined') {
          resolve()
        } else {
          reject(new Error('PayKKaCardCheckoutUI 未定义'))
        }
      }
      script.onerror = () => {
        reject(new Error('加载 PayKKaCardCheckoutUI 脚本失败'))
      }
      document.head.appendChild(script)
    })
  }
  
  // 清理组件
  onBeforeUnmount(() => {
    if (dropIn) {
      try {
        dropIn.unmount()
        console.log('DropIn 组件已卸载')
      } catch (e) {
        console.error('卸载 DropIn 组件失败:', e)
      }
    }
    if (appleCheckout) {
      try {
        appleCheckout.unmount()
      } catch (e) {
        console.error('卸载 ApplePay 组件失败:', e)
      }
    }
    if (googleCheckout) {
      try {
        googleCheckout.unmount()
      } catch (e) {
        console.error('卸载 GooglePay 组件失败:', e)
      }
    }
  })
  
  // 初始化
  onMounted(async () => {
    console.log('DropIn 支付页面初始化', {
      query: route.query,
      params: route.params
    })
  
    try {
      // 从路由参数获取响应数据
      const responseData = route.query.responseData || route.params.responseData
      
      if (responseData) {
        console.log('从路由参数获取数据')
        try {
          const parsed = JSON.parse(decodeURIComponent(responseData))
          console.log('解析后的完整数据:', parsed)
          
          // 支持新的数据格式（包含 responseData 和 apiConfig）
          if (parsed.responseData) {
            const response = parsed.responseData
            if (response.data) {
              sessionData.value = response.data
              sessionData.value.responseData = response
            } else {
              sessionData.value = response
            }
            
            if (parsed.apiConfig) {
              sessionData.value.baseUrl = parsed.apiConfig.baseUrl || ''
              sessionData.value.appId = parsed.apiConfig.appId || ''
              sessionData.value.merchantId = parsed.apiConfig.merchantId || ''
            }
          } else if (parsed.data) {
            sessionData.value = parsed.data
            sessionData.value.responseData = parsed
            if (parsed.baseUrl) {
              sessionData.value.baseUrl = parsed.baseUrl
            }
            if (parsed.clientKey) {
              sessionData.value.clientKey = parsed.clientKey
            }
          } else {
            sessionData.value = parsed
          }
          console.log('设置 sessionData:', sessionData.value)
        } catch (e) {
          console.error('解析响应数据失败:', e)
          error.value = `无法解析响应数据: ${e.message}`
          loading.value = false
          return
        }
      } else {
        // 尝试从 localStorage 获取
        console.log('从 localStorage 获取数据')
        const storedSession = localStorage.getItem('paykka_dropin_session')
        if (storedSession) {
          try {
            const session = JSON.parse(storedSession)
            console.log('从 localStorage 解析的数据:', session)
            
            if (session.responseData) {
              const response = session.responseData
              if (response.data) {
                sessionData.value = response.data
                sessionData.value.responseData = response
              } else {
                sessionData.value = response
              }
              
              if (session.apiConfig) {
                sessionData.value.baseUrl = session.apiConfig.baseUrl || ''
                sessionData.value.appId = session.apiConfig.appId || ''
                sessionData.value.merchantId = session.apiConfig.merchantId || ''
              } else if (session.baseUrl) {
                sessionData.value.baseUrl = session.baseUrl
              }
            } else if (session.data) {
              sessionData.value = session.data
              if (session.baseUrl) {
                sessionData.value.baseUrl = session.baseUrl
              }
              if (session.responseData) {
                sessionData.value.responseData = session.responseData
              }
            } else {
              sessionData.value = {
                session_id: session.id || session.sessionId,
                session_url: session.url
              }
            }
            console.log('设置 sessionData:', sessionData.value)
          } catch (e) {
            console.error('解析 localStorage 数据失败:', e)
            error.value = `无法解析存储的会话信息: ${e.message}`
            loading.value = false
            return
          }
        } else {
          console.error('未找到存储的会话数据')
          error.value = '未找到支付会话数据，请先创建支付会话'
          loading.value = false
          return
        }
      }
  
      // 验证数据
      if (!sessionData.value) {
        console.error('sessionData 为空')
        error.value = '会话数据为空'
        loading.value = false
        return
      }
  
      console.log('最终 sessionData:', sessionData.value)
  
      // 如果有 session_id，初始化组件
      if (sessionData.value.session_id) {
        await nextTick()
        await initPayKKaDropIn()
      } else {
        console.error('缺少 session_id', sessionData.value)
        error.value = `缺少会话ID (session_id)。当前数据: ${JSON.stringify(sessionData.value)}`
        loading.value = false
      }
    } catch (err) {
      console.error('初始化失败:', err)
      error.value = `初始化失败: ${err.message || err}`
      loading.value = false
    }
  })
  </script>
  
  <style scoped>
  .dropin-payment {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
  }
  
  .payment-container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  
  .payment-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-bottom: 1px solid #e0e0e0;
  }
  
  .back-button {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    border: 1px solid rgba(102, 126, 234, 0.3);
    border-radius: 6px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 500;
  }
  
  .back-button:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.5);
    transform: translateX(-2px);
  }
  
  .payment-title {
    font-size: 1.5rem;
    color: #333;
    margin: 0;
    font-weight: 600;
  }
  
  .loading-state,
  .error-state,
  .empty-state {
    padding: 4rem 2rem;
    text-align: center;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-icon,
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .error-state h2,
  .empty-state h2 {
    font-size: 1.5rem;
    color: #333;
    margin: 0 0 0.5rem 0;
  }
  
  .error-state p,
  .empty-state p {
    color: #666;
    margin: 0 0 1.5rem 0;
  }
  
  .payment-content {
    padding: 1.5rem;
  }
  
  .payment-info {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 0.75rem;
  }
  
  .info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .info-label {
    font-weight: 600;
    color: #666;
    min-width: 80px;
  }
  
  .info-value {
    color: #333;
    font-family: monospace;
    font-size: 0.9rem;
  }
  
  .status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
  }
  
  .status-processing {
    background: #e3f2fd;
    color: #1976d2;
  }
  
  .status-success {
    background: #e8f5e9;
    color: #2e7d32;
  }
  
  .status-failed {
    background: #ffebee;
    color: #c62828;
  }
  
  .status-expired {
    background: #fff3e0;
    color: #e65100;
  }
  
  .status-cancelled {
    background: #f3e5f5;
    color: #7b1fa2;
  }
  
.payment-component-wrapper {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.component-container {
  position: relative;
  width: 400px;
  min-height: 500px;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
  
  .payform-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 20px;
    width: 100%;
  }
  
  .payment-field {
    width: 500px;
    padding-bottom: 20px;
  }
  
  .payment-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 1.5rem;
    border-top: 1px solid #e0e0e0;
  }
  
  .btn-primary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
  
@media (max-width: 768px) {
  .payment-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .payment-info {
    font-size: 0.85rem;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .payment-component-wrapper {
    padding: 1rem;
  }

  .component-container {
    width: 100%;
    max-width: 400px;
    padding: 1.5rem;
    min-height: 400px;
  }

  .payment-field {
    width: 100%;
    max-width: 500px;
  }

  .payment-actions {
    flex-direction: column;
  }

  .btn-primary {
    width: 100%;
  }
}
  </style>
  
  