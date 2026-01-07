<template>
  <div class="paykka-test">
    <div class="container">
      <div class="header-with-back">
        <button @click="goBack" class="back-button">← 返回首页</button>
        <h1 class="title">PayKKa API交易测试</h1>
      </div>
      
      <div class="test-panel">
        <div class="form-section">
          <h2>API 配置</h2>
          
          <div class="form-row-2">
          <div class="form-group">
            <label>API 地址</label>
            <input 
                :value="apiConfig.baseUrl || (selectedMerchantId ? '' : '请先选择商户配置')" 
              type="text" 
                readonly
                placeholder="从商户配置中自动获取"
                class="input-field readonly"
            />
              <small class="field-desc">从选择的商户配置中自动获取，无需手动输入</small>
          </div>

          <div class="form-group">
            <label>商户ID (Merchant ID)</label>
            <select 
              v-model="selectedMerchantId" 
              @change="onMerchantChange"
              class="input-field"
            >
              <option value="">-- 请选择商户 --</option>
              <option v-for="config in merchantConfigs" :key="config.merchantId" :value="config.merchantId">
                {{ config.name || config.merchantId }}
              </option>
            </select>
              <small class="field-desc">从已配置的商户中选择，选择后将自动填充API地址、商户ID、App ID和私钥</small>
            </div>
          </div>

          <div class="form-group">
            <label>私钥 (Private Key) <span class="required">*</span></label>
            <div class="private-key-container">
            <input 
                v-if="!showPrivateKeyFull"
                :value="apiConfig.privateKey ? (apiConfig.privateKey.substring(0, 50) + '...') : (selectedMerchantId ? '' : '请先选择商户配置')" 
                readonly
                class="input-field readonly"
                :placeholder="selectedMerchantId ? '从商户配置中自动获取' : '请先选择商户配置'"
                @click="showPrivateKeyFull = true"
              />
              <textarea 
                v-else
                :value="apiConfig.privateKey || (selectedMerchantId ? '' : '请先选择商户配置')" 
                readonly
                class="input-field textarea readonly"
                rows="6"
                :placeholder="selectedMerchantId ? '从商户配置中自动获取' : '请先选择商户配置'"
              ></textarea>
              <button 
                v-if="apiConfig.privateKey" 
                @click="showPrivateKeyFull = !showPrivateKeyFull" 
                class="btn-toggle-key"
                type="button"
              >
                {{ showPrivateKeyFull ? '收起' : '展开' }}
              </button>
            </div>
            <small class="field-desc">从选择的商户配置中自动获取，无需手动输入</small>
          </div>

          <div class="divider"></div>

          <h3>请求头参数 (Headers)</h3>

            <div class="form-group">
            <label>x-paykka-appid <span class="required">*</span></label>
              <input 
              :value="apiConfig.appId || (selectedMerchantId ? '' : '请先选择商户配置')" 
              type="text" 
              readonly
              placeholder="从商户配置中自动获取"
              class="input-field readonly"
            />
            <small class="field-desc">从选择的商户配置中自动获取，无需手动输入</small>
          </div>

          <div class="divider"></div>

          <h3>交易参数</h3>

          <div class="form-row-4">
            <div class="form-group">
              <label>交易ID (Trans ID) <span class="required">*</span></label>
              <div class="input-with-button">
                <input 
                  v-model="transactionData.transId" 
                type="text" 
                placeholder="自动生成"
                class="input-field"
              />
                <button @click="generateTransId" class="btn-small">随机生成</button>
              </div>
            </div>

            <div class="form-group">
              <label>交易金额 (Amount)</label>
              <div class="input-with-button">
              <input 
                v-model.number="transactionData.amount" 
                type="number" 
                step="0.01"
                placeholder="0.00"
                class="input-field"
              />
                <button @click="generateRandomAmount" class="btn-small">随机金额</button>
            </div>
          </div>

            <div class="form-group">
              <label>币种 (Currency)</label>
              <div class="input-with-button">
                <SmartSelect
                  v-model="transactionData.currency"
                  :options="[
                    { value: 'USD', label: 'USD - 美元' },
                    { value: 'EUR', label: 'EUR - 欧元' },
                    { value: 'GBP', label: 'GBP - 英镑' },
                    { value: 'CNY', label: 'CNY - 人民币' },
                    { value: 'JPY', label: 'JPY - 日元' },
                    { value: 'HKD', label: 'HKD - 港币' },
                    { value: 'SGD', label: 'SGD - 新加坡元' }
                  ]"
                  placeholder="选择或输入币种"
                  style="flex: 1;"
                />
                <button @click="generateRandomCurrency" class="btn-small">随机币种</button>
              </div>
            </div>

            <div class="form-group">
              <label>支付类型 (Payment Type) <span class="required">*</span></label>
              <SmartSelect
                v-model="transactionData.paymentType"
                :options="[
                  { value: 'PURCHASE', label: 'PURCHASE - 消费' },
                  { value: 'PREPARE_AUTHORIZE', label: 'PREPARE_AUTHORIZE - 预授权' },
                  { value: 'RECURRING', label: 'RECURRING - 循环支付' },
                  { value: 'REFUND', label: 'REFUND - 退款' }
                ]"
                placeholder="选择或输入支付类型"
              />
              <small class="field-desc">默认值：PURCHASE</small>
            </div>
          </div>

          <!-- 循环支付参数（仅当支付类型为 RECURRING 时显示） -->
          <div v-if="transactionData.paymentType === 'RECURRING'" class="form-row-2">
          <div class="form-group">
              <label>循环支付协议ID (Recurring Agreement ID)</label>
              <input 
                v-model="transactionData.recurringAgreementId" 
                type="text" 
                placeholder="RA37285619238472"
                maxlength="32"
                class="input-field"
              />
              <small class="field-desc">循环支付协议ID，在非首次循环支付时需要携带（0-32个字符）</small>
            </div>

            <div class="form-group">
              <label>商户主动发起 (MIT)</label>
              <SmartSelect
                v-model="mitText"
                :options="[
                  { value: 'true', label: 'true - 商户主动发起' },
                  { value: 'false', label: 'false - 非商户主动发起' }
                ]"
                placeholder="选择或输入 true/false"
              />
              <small class="field-desc">当循环支付非首次支付，由商户主动发起的支付时，此字段需要填true</small>
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label>请款方式 (Capture Method) <span class="required">*</span></label>
              <SmartSelect
                v-model="transactionData.captureMethod"
                :options="[
                  { value: 'AUTOMATIC', label: 'AUTOMATIC - 自动' },
                  { value: 'MANUAL', label: 'MANUAL - 手动' }
                ]"
                placeholder="选择或输入请款方式"
              />
            </div>

            <div class="form-group">
              <label>过期时间 (Expire Time)</label>
              <input 
                v-model="transactionData.expireTime" 
                type="datetime-local"
                class="input-field"
                placeholder="2023-11-24T11:34:37+0800"
              />
              <small class="field-desc">格式: YYYY-MM-DDTHH:mm:ss+0800</small>
            </div>

            <div class="form-group">
              <label>地址收集 (Address Collection)</label>
              <SmartSelect
                v-model="transactionData.addressCollection"
                :options="[
                  { value: 'AUTO', label: 'AUTO - 自动' },
                  { value: 'REQUIRED', label: 'REQUIRED - 必需' },
                  { value: 'NONE', label: 'NONE - 无' }
                ]"
                placeholder="选择或输入地址收集方式"
              />
              <small class="field-desc">默认值：AUTO</small>
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>成功返回地址 (Return URL)</label>
              <input 
                v-model="transactionData.returnUrl" 
                type="text" 
                placeholder="https://your-domain.com/success"
                class="input-field"
              />
            </div>

            <div class="form-group">
              <label>失败返回地址 (Cancel URL)</label>
              <input 
                v-model="transactionData.cancelUrl" 
                type="text" 
                placeholder="https://your-domain.com/cancel"
                class="input-field"
              />
            </div>
          </div>

          <div class="form-group">
            <label>商品信息 (Goods) <span class="required">*</span></label>
            <textarea 
              v-model="transactionData.goods" 
              placeholder='[{"name":"商品名称","quantity":1,"price":99.99,"link":"https://example.com/product"}]'
              class="input-field textarea"
              rows="5"
            ></textarea>
            <button @click="generateGoods" class="btn-small" style="margin-top: 0.3rem;">随机生成商品</button>
            <small class="field-desc">请输入有效的JSON数组，每个商品必须包含 name, quantity, price, link 字段</small>
          </div>

          <div class="divider"></div>

          <div class="section-header">
            <div class="section-header-title" @click="sectionCollapsed.paymentInfo = !sectionCollapsed.paymentInfo" style="cursor: pointer;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem; transition: transform 0.3s;" :style="{ transform: sectionCollapsed.paymentInfo ? 'rotate(-90deg)' : 'rotate(0deg)' }">
                <path d="M9 18l6-6-6-6"/>
              </svg>
              <h3>支付信息 (Payment Info)</h3>
            </div>
            <div class="section-header-actions">
              <button 
                @click="generatePaymentInfo" 
                class="btn-small btn-random-section"
                :disabled="!transactionData.enablePaymentInfo"
              >
                随机生成
              </button>
              <label class="toggle-switch">
                <input type="checkbox" v-model="transactionData.enablePaymentInfo" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">{{ transactionData.enablePaymentInfo ? '启用' : '禁用' }}</span>
              </label>
            </div>
          </div>
          <div v-show="!sectionCollapsed.paymentInfo" class="form-row-3" :class="{ 'disabled-section': !transactionData.enablePaymentInfo }">
          <div class="form-group">
              <label>支付方式 (Payment Method)</label>
              <SmartSelect
                v-model="transactionData.paymentMethod"
                :options="[
                  { value: 'BANKCARD', label: 'BANKCARD - 银行卡' },
                  { value: 'ALIPAY', label: 'ALIPAY - 支付宝' },
                  { value: 'WECHATPAY', label: 'WECHATPAY - 微信支付' },
                  { value: 'APPLEPAY', label: 'APPLEPAY - Apple Pay' },
                  { value: 'GOOGLEPAY', label: 'GOOGLEPAY - Google Pay' }
                ]"
                placeholder="选择或输入支付方式"
                :disabled="!transactionData.enablePaymentInfo"
              />
            </div>
            <div class="form-group">
              <label>购物者参考 (Shopper Reference)</label>
            <input 
                v-model="transactionData.shopperReference" 
              type="text" 
                placeholder="f4911bc8b17106a08f2f7a89a9fc4d11"
              class="input-field"
                :disabled="!transactionData.enablePaymentInfo"
              />
            </div>
            <div class="form-group">
              <label>持卡人邮箱 (Holder Email)</label>
              <input 
                v-model="transactionData.holderEmail" 
                type="email" 
                placeholder="zhangsan@test.com"
                class="input-field"
                :disabled="!transactionData.enablePaymentInfo"
              />
            </div>
          </div>
          <div v-show="!sectionCollapsed.paymentInfo" class="form-row-4" :class="{ 'disabled-section': !transactionData.enablePaymentInfo }">
            <div class="form-group">
              <label>卡号 (Card No)</label>
              <div class="input-with-button">
                <input 
                  v-model="transactionData.cardNo" 
                  type="text" 
                  placeholder="4242424242424242"
                  class="input-field"
                  :disabled="!transactionData.enablePaymentInfo"
                />
                <button 
                  @click="showTestCardModal = true"
                  class="btn-small btn-select-card"
                  :disabled="!transactionData.enablePaymentInfo"
                  type="button"
                >
                  选择测试卡号
                </button>
              </div>
            </div>
            <div class="form-group">
              <label>持卡人姓名 (Holder Name)</label>
              <input 
                v-model="transactionData.holderName" 
                type="text" 
                placeholder="Winifred Reopell"
                class="input-field"
                :disabled="!transactionData.enablePaymentInfo"
              />
            </div>
            <div class="form-group">
              <label>过期年份 (Exp Year)</label>
              <input 
                v-model="transactionData.expYear" 
                type="text" 
                placeholder="2029"
                class="input-field"
                :disabled="!transactionData.enablePaymentInfo"
              />
            </div>
            <div class="form-group">
              <label>过期月份 (Exp Month)</label>
              <input 
                v-model="transactionData.expMonth" 
                type="text" 
                placeholder="03"
                class="input-field"
                :disabled="!transactionData.enablePaymentInfo"
              />
            </div>
          </div>
          <div v-show="!sectionCollapsed.paymentInfo" class="form-row-2" :class="{ 'disabled-section': !transactionData.enablePaymentInfo }">
            <div class="form-group">
              <label>CVV</label>
              <input 
                v-model="transactionData.cvv" 
                type="text" 
                placeholder="123"
                class="input-field"
                :disabled="!transactionData.enablePaymentInfo"
              />
            </div>
            <div class="form-group">
              <label>存储卡信息 (Store Payment Method)</label>
              <SmartSelect
                v-model="storePaymentMethodText"
                :options="[
                  { value: 'true', label: 'true - 存储卡信息' },
                  { value: 'false', label: 'false - 不存储' }
                ]"
                placeholder="选择或输入 true/false"
                :disabled="!transactionData.enablePaymentInfo"
              />
              <small class="field-desc">若payment_type为RECURRING，此字段为True代表告知顾客在当前订单支付完成时将保存支付用于后续循环</small>
            </div>
          </div>
          <div v-show="!sectionCollapsed.paymentInfo" class="form-row-2" :class="{ 'disabled-section': !transactionData.enablePaymentInfo }">
            <div class="form-group">
              <label>Token用途 (Token Usage)</label>
              <SmartSelect
                v-model="transactionData.tokenUsage"
                :options="[
                  { value: 'CARD_ON_FILE', label: 'CARD_ON_FILE - 消费交易' },
                  { value: 'SUBSCRIPTION', label: 'SUBSCRIPTION - 循环交易' }
                ]"
                placeholder="选择或输入 CARD_ON_FILE/SUBSCRIPTION"
                :disabled="!transactionData.enablePaymentInfo"
              />
              <small class="field-desc">token用途，当store_payment_method=true或者token支付时必传</small>
            </div>
            <div class="form-group">
              <label>卡令牌 (Token)</label>
              <input 
                v-model="transactionData.token" 
                type="text" 
                placeholder="CS200395192979024625"
                maxlength="64"
                class="input-field"
                :disabled="!transactionData.enablePaymentInfo"
              />
              <small class="field-desc">卡令牌，BANKCARD支付方式下[token, card_no, encrypted_card_no]三选一（0-64个字符）</small>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section-header">
            <div class="section-header-title" @click="sectionCollapsed.browserInfo = !sectionCollapsed.browserInfo" style="cursor: pointer;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem; transition: transform 0.3s;" :style="{ transform: sectionCollapsed.browserInfo ? 'rotate(-90deg)' : 'rotate(0deg)' }">
                <path d="M9 18l6-6-6-6"/>
              </svg>
              <h3>浏览器信息 (Browser Info)</h3>
            </div>
            <div class="section-header-actions">
              <button 
                @click="generateBrowserInfo" 
                class="btn-small btn-random-section"
                :disabled="!transactionData.enableBrowserInfo"
              >
                随机生成
              </button>
              <label class="toggle-switch">
                <input type="checkbox" v-model="transactionData.enableBrowserInfo" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">{{ transactionData.enableBrowserInfo ? '启用' : '禁用' }}</span>
              </label>
            </div>
          </div>
          <div v-show="!sectionCollapsed.browserInfo" class="form-row-3" :class="{ 'disabled-section': !transactionData.enableBrowserInfo }">
            <div class="form-group">
              <label>用户代理 (User Agent)</label>
              <input 
                v-model="transactionData.userAgent" 
                type="text" 
                placeholder="Mozilla/5.0 (Linux; U; Android 12.0.0; zh-cn; SONY-7XT78X Build/2DKKUF) AppleWebKit/537.36"
                class="input-field"
                :disabled="!transactionData.enableBrowserInfo"
              />
            </div>
            <div class="form-group">
              <label>颜色深度 (Color Depth)</label>
              <input 
                v-model="transactionData.colorDepth" 
                type="text" 
                placeholder="165"
                class="input-field"
                :disabled="!transactionData.enableBrowserInfo"
              />
            </div>
            <div class="form-group">
              <label>语言 (Language)</label>
              <input 
                v-model="transactionData.language" 
                type="text" 
                placeholder="ko-KR"
                class="input-field"
                :disabled="!transactionData.enableBrowserInfo"
              />
            </div>
          </div>
          <div v-show="!sectionCollapsed.browserInfo" class="form-row-4" :class="{ 'disabled-section': !transactionData.enableBrowserInfo }">
            <div class="form-group">
              <label>Java 启用 (Java Enabled)</label>
              <SmartSelect
                v-model="javaEnabledText"
                :options="[
                  { value: 'true', label: 'true' },
                  { value: 'false', label: 'false' }
                ]"
                placeholder="选择或输入 true/false"
                :disabled="!transactionData.enableBrowserInfo"
              />
            </div>
            <div class="form-group">
              <label>设备类型 (Device Type)</label>
              <SmartSelect
                v-model="transactionData.deviceType"
                :options="[
                  { value: 'PC', label: 'PC' },
                  { value: 'MOBILE', label: 'MOBILE' },
                  { value: 'TABLET', label: 'TABLET' }
                ]"
                placeholder="选择或输入设备类型"
                :disabled="!transactionData.enableBrowserInfo"
              />
            </div>
            <div class="form-group">
              <label>终端类型 (Terminal Type)</label>
              <SmartSelect
                v-model="transactionData.terminalType"
                :options="[
                  { value: 'WEB', label: 'WEB' },
                  { value: 'APP', label: 'APP' },
                  { value: 'WAP', label: 'WAP' }
                ]"
                placeholder="选择或输入终端类型"
                :disabled="!transactionData.enableBrowserInfo"
              />
            </div>
            <div class="form-group">
              <label>设备操作系统 (Device OS)</label>
              <SmartSelect
                v-model="transactionData.deviceOs"
                :options="[
                  { value: 'WINDOWS', label: 'WINDOWS' },
                  { value: 'MACOS', label: 'MACOS' },
                  { value: 'LINUX', label: 'LINUX' },
                  { value: 'ANDROID', label: 'ANDROID' },
                  { value: 'IOS', label: 'IOS' }
                ]"
                placeholder="选择或输入设备操作系统"
                :disabled="!transactionData.enableBrowserInfo"
              />
            </div>
          </div>
          <div v-show="!sectionCollapsed.browserInfo" class="form-row-4" :class="{ 'disabled-section': !transactionData.enableBrowserInfo }">
            <div class="form-group">
              <label>时区偏移 (Timezone Offset)</label>
              <input 
                v-model="transactionData.timezoneOffset" 
                type="text" 
                placeholder="-12:10"
                class="input-field"
                :disabled="!transactionData.enableBrowserInfo"
              />
            </div>
            <div class="form-group">
              <label>屏幕高度 (Screen Height)</label>
              <input 
                v-model="transactionData.screenHeight" 
                type="text" 
                placeholder="128"
                class="input-field"
                :disabled="!transactionData.enableBrowserInfo"
              />
            </div>
            <div class="form-group">
              <label>屏幕宽度 (Screen Width)</label>
              <input 
                v-model="transactionData.screenWidth" 
                type="text" 
                placeholder="255"
                class="input-field"
                :disabled="!transactionData.enableBrowserInfo"
              />
            </div>
            <div class="form-group">
              <label>设备指纹ID (Device Finger Print ID)</label>
              <input 
                v-model="transactionData.deviceFingerPrintId" 
                type="text" 
                placeholder="info.kbxqkxkzqgjmwj.qpxzwmwzbwwijkth"
                class="input-field"
                :disabled="!transactionData.enableBrowserInfo"
              />
            </div>
          </div>
          <div v-show="!sectionCollapsed.browserInfo" class="form-row-1" :class="{ 'disabled-section': !transactionData.enableBrowserInfo }">
            <div class="form-group">
              <label>Cookies</label>
            <textarea 
                v-model="transactionData.cookies" 
                type="text" 
                placeholder="isg=BA4O1YD75-wYqlLAB-T9JZjXxxxJFHEUkjdslrlhj9 TB_TENANT_TYPE=organization"
              class="input-field textarea"
                rows="2"
                :disabled="!transactionData.enableBrowserInfo"
            ></textarea>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section-header">
            <div class="section-header-title" @click="sectionCollapsed.customerInfo = !sectionCollapsed.customerInfo" style="cursor: pointer;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem; transition: transform 0.3s;" :style="{ transform: sectionCollapsed.customerInfo ? 'rotate(-90deg)' : 'rotate(0deg)' }">
                <path d="M9 18l6-6-6-6"/>
              </svg>
              <h3>客户信息 (Customer Info) <span class="required">*</span></h3>
            </div>
            <div class="section-header-actions">
              <button 
                @click="generateAllCustomerInfo" 
                class="btn-small btn-random-section"
                :disabled="!transactionData.enableCustomerInfo"
              >
                随机生成
              </button>
              <label class="toggle-switch">
                <input type="checkbox" v-model="transactionData.enableCustomerInfo" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">{{ transactionData.enableCustomerInfo ? '启用' : '禁用' }}</span>
              </label>
            </div>
          </div>
          <div v-show="!sectionCollapsed.customerInfo" class="form-row-4" :class="{ 'disabled-section': !transactionData.enableCustomerInfo }">
          <div class="form-group">
              <label>客户姓名 (Name) <span class="required">*</span></label>
            <input 
                v-model="transactionData.customerName" 
              type="text" 
                placeholder="Charlie Brown"
              class="input-field"
                :disabled="!transactionData.enableCustomerInfo"
              />
            </div>
            <div class="form-group">
              <label>客户邮箱 (Email) <span class="required">*</span></label>
              <input 
                v-model="transactionData.customerEmail" 
                type="email" 
                placeholder="charlie.brown2519@gmail.com"
                class="input-field"
                :disabled="!transactionData.enableCustomerInfo"
              />
            </div>
            <div class="form-group">
              <label>客户电话 (Phone) <span class="required">*</span></label>
              <input 
                v-model="transactionData.customerPhone" 
                type="text" 
                placeholder="+1 622 5406475"
                class="input-field"
                :disabled="!transactionData.enableCustomerInfo"
              />
            </div>
            <div class="form-group">
              <label>客户ID (ID) <span class="required">*</span></label>
              <input 
                v-model="transactionData.customerId" 
                type="text" 
                placeholder="CUST1766744364378"
                class="input-field"
                :disabled="!transactionData.enableCustomerInfo"
              />
            </div>
          </div>
          <div v-show="!sectionCollapsed.customerInfo" class="form-row-4" :class="{ 'disabled-section': !transactionData.enableCustomerInfo }">
            <div class="form-group">
              <label>订单IP (Order IP) <span class="required">*</span></label>
              <input 
                v-model="transactionData.customerOrderIp" 
                type="text" 
                placeholder="183.238.13.170"
                class="input-field"
                :disabled="!transactionData.enableCustomerInfo"
              />
            </div>
            <div class="form-group">
              <label>支付IP (Pay IP) <span class="required">*</span></label>
              <input 
                v-model="transactionData.customerPayIp" 
                type="text" 
                placeholder="183.238.13.170"
                class="input-field"
                :disabled="!transactionData.enableCustomerInfo"
              />
            </div>
          </div>

          <div class="divider"></div>

          <div class="section-header">
            <div class="section-header-title" @click="sectionCollapsed.billInfo = !sectionCollapsed.billInfo" style="cursor: pointer;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem; transition: transform 0.3s;" :style="{ transform: sectionCollapsed.billInfo ? 'rotate(-90deg)' : 'rotate(0deg)' }">
                <path d="M9 18l6-6-6-6"/>
              </svg>
              <h3>账单信息 (Billing Info)</h3>
            </div>
            <div class="section-header-actions">
              <div class="select-mock-actions">
                <SmartSelect
                  v-model="selectedBillMock"
                  :options="billMockOptions"
                  placeholder="选择预设数据"
                  style="width: 180px;"
                  :disabled="!transactionData.enableBillInfo || !mockDataLoaded"
                />
                <button 
                  @click="generateAllBillInfo" 
                  class="btn-small btn-random-section"
                  :disabled="!transactionData.enableBillInfo || !mockDataLoaded"
                >
                  随机生成
                </button>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="transactionData.enableBillInfo" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">{{ transactionData.enableBillInfo ? '启用' : '禁用' }}</span>
              </label>
            </div>
          </div>
          <div v-show="!sectionCollapsed.billInfo" class="form-row-4" :class="{ 'disabled-section': !transactionData.enableBillInfo }">
            <div class="form-group">
              <label>账单名 (First Name)</label>
              <input 
                v-model="transactionData.billFirstName" 
                type="text" 
                placeholder="First Name"
                class="input-field"
                :disabled="!transactionData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>账单姓 (Last Name)</label>
              <input 
                v-model="transactionData.billLastName" 
                type="text" 
                placeholder="Last Name"
                class="input-field"
                :disabled="!transactionData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>账单邮箱 (Email)</label>
              <input 
                v-model="transactionData.billEmail" 
                type="email" 
                placeholder="bill@example.com"
                class="input-field"
                :disabled="!transactionData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>账单电话 (Phone)</label>
              <input 
                v-model="transactionData.billPhone" 
                type="text" 
                placeholder="+1234567890"
                class="input-field"
                :disabled="!transactionData.enableBillInfo"
              />
            </div>
          </div>
          <div v-show="!sectionCollapsed.billInfo" class="form-row-4" :class="{ 'disabled-section': !transactionData.enableBillInfo }">
            <div class="form-group">
              <label>账单地址 (Address Line1)</label>
              <input 
                v-model="transactionData.billAddressLine1" 
                type="text" 
                placeholder="Address Line 1"
                class="input-field"
                :disabled="!transactionData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>账单国家 (Country)</label>
              <SmartSelect
                v-model="transactionData.billCountry"
                :options="[
                  { value: 'CN', label: 'CN - 中国' },
                  { value: 'US', label: 'US - 美国' },
                  { value: 'GB', label: 'GB - 英国' },
                  { value: 'FR', label: 'FR - 法国' },
                  { value: 'JP', label: 'JP - 日本' },
                  { value: 'SG', label: 'SG - 新加坡' },
                  { value: 'HK', label: 'HK - 香港' },
                  { value: 'DE', label: 'DE - 德国' }
                ]"
                placeholder="选择或输入国家代码"
                :disabled="!transactionData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>账单州/省 (State)</label>
              <input 
                v-model="transactionData.billState" 
                type="text" 
                placeholder="State/Province"
                class="input-field"
                :disabled="!transactionData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>账单城市 (City)</label>
              <input 
                v-model="transactionData.billCity" 
                type="text" 
                placeholder="City"
                class="input-field"
                :disabled="!transactionData.enableBillInfo"
              />
            </div>
          </div>
          <div v-show="!sectionCollapsed.billInfo" class="form-row-4" :class="{ 'disabled-section': !transactionData.enableBillInfo }">
            <div class="form-group">
              <label>账单邮编 (Postal Code)</label>
              <input 
                v-model="transactionData.billPostalCode" 
                type="text" 
                placeholder="Postal Code"
                class="input-field"
                :disabled="!transactionData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>区号 (Area Code)</label>
              <input 
                v-model="transactionData.billAreaCode" 
                type="text" 
                placeholder="Area Code"
                class="input-field"
                :disabled="!transactionData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>描述符 (Descriptor)</label>
              <input 
                v-model="transactionData.billDescriptor" 
                type="text" 
                placeholder="Descriptor"
                class="input-field"
                :disabled="!transactionData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>地址收集 (Address Collection)</label>
              <SmartSelect
                v-model="transactionData.billAddressCollection"
                :options="[
                  { value: 'REQUIRED', label: 'REQUIRED - 必填' },
                  { value: 'AUTO', label: 'AUTO - 自动' }
                ]"
                placeholder="选择或输入地址收集方式"
                :disabled="!transactionData.enableBillInfo"
              />
            </div>
          </div>

          <div class="divider"></div>

          <div class="section-header">
            <div class="section-header-title" @click="sectionCollapsed.shipInfo = !sectionCollapsed.shipInfo" style="cursor: pointer;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem; transition: transform 0.3s;" :style="{ transform: sectionCollapsed.shipInfo ? 'rotate(-90deg)' : 'rotate(0deg)' }">
                <path d="M9 18l6-6-6-6"/>
              </svg>
              <h3>收货信息 (Shipping Info)</h3>
            </div>
            <div class="section-header-actions">
              <div class="select-mock-actions">
                <SmartSelect
                  v-model="selectedShipMock"
                  :options="shipMockOptions"
                  placeholder="选择预设数据"
                  style="width: 180px;"
                  :disabled="!transactionData.enableShipInfo || !mockDataLoaded"
                />
                <button 
                  @click="generateAllShipInfo" 
                  class="btn-small btn-random-section"
                  :disabled="!transactionData.enableShipInfo || !mockDataLoaded"
                >
                  随机生成
                </button>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="transactionData.enableShipInfo" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">{{ transactionData.enableShipInfo ? '启用' : '禁用' }}</span>
              </label>
            </div>
          </div>
          <div v-show="!sectionCollapsed.shipInfo" class="form-row-4" :class="{ 'disabled-section': !transactionData.enableShipInfo }">
            <div class="form-group">
              <label>收货名 (First Name)</label>
              <input 
                v-model="transactionData.shipFirstName" 
                type="text" 
                placeholder="First Name"
                class="input-field"
                :disabled="!transactionData.enableShipInfo"
              />
            </div>
            <div class="form-group">
              <label>收货姓 (Last Name)</label>
              <input 
                v-model="transactionData.shipLastName" 
                type="text" 
                placeholder="Last Name"
                class="input-field"
                :disabled="!transactionData.enableShipInfo"
              />
            </div>
            <div class="form-group">
              <label>收货邮箱 (Email)</label>
              <input 
                v-model="transactionData.shipEmail" 
                type="email" 
                placeholder="ship@example.com"
                class="input-field"
                :disabled="!transactionData.enableShipInfo"
              />
            </div>
            <div class="form-group">
              <label>收货电话 (Phone)</label>
              <input 
                v-model="transactionData.shipPhone" 
                type="text" 
                placeholder="+1234567890"
                class="input-field"
                :disabled="!transactionData.enableShipInfo"
              />
            </div>
          </div>
          <div v-show="!sectionCollapsed.shipInfo" class="form-row-4" :class="{ 'disabled-section': !transactionData.enableShipInfo }">
            <div class="form-group">
              <label>收货地址 (Address Line1)</label>
              <input 
                v-model="transactionData.shipAddressLine1" 
                type="text" 
                placeholder="Address Line 1"
                class="input-field"
                :disabled="!transactionData.enableShipInfo"
              />
            </div>
            <div class="form-group">
              <label>收货国家 (Country)</label>
              <SmartSelect
                v-model="transactionData.shipCountry"
                :options="[
                  { value: 'CN', label: 'CN - 中国' },
                  { value: 'US', label: 'US - 美国' },
                  { value: 'GB', label: 'GB - 英国' },
                  { value: 'FR', label: 'FR - 法国' },
                  { value: 'JP', label: 'JP - 日本' },
                  { value: 'SG', label: 'SG - 新加坡' },
                  { value: 'HK', label: 'HK - 香港' },
                  { value: 'DE', label: 'DE - 德国' }
                ]"
                placeholder="选择或输入国家代码"
                :disabled="!transactionData.enableShipInfo"
              />
            </div>
            <div class="form-group">
              <label>收货州/省 (State)</label>
              <input 
                v-model="transactionData.shipState" 
                type="text" 
                placeholder="State/Province"
                class="input-field"
                :disabled="!transactionData.enableShipInfo"
              />
            </div>
            <div class="form-group">
              <label>收货城市 (City)</label>
              <input 
                v-model="transactionData.shipCity" 
                type="text" 
                placeholder="City"
                class="input-field"
                :disabled="!transactionData.enableShipInfo"
              />
            </div>
          </div>
          <div v-show="!sectionCollapsed.shipInfo" class="form-row-4" :class="{ 'disabled-section': !transactionData.enableShipInfo }">
            <div class="form-group">
              <label>收货邮编 (Postal Code)</label>
              <input 
                v-model="transactionData.shipPostalCode" 
                type="text" 
                placeholder="Postal Code"
                class="input-field"
                :disabled="!transactionData.enableShipInfo"
              />
            </div>
            <div class="form-group">
              <label>区号 (Area Code)</label>
              <input 
                v-model="transactionData.shipAreaCode" 
                type="text" 
                placeholder="Area Code"
                class="input-field"
                :disabled="!transactionData.enableShipInfo"
              />
            </div>
          </div>

          <div class="divider"></div>

          <div class="section-header">
            <div class="section-header-title" @click="sectionCollapsed.queryTransaction = !sectionCollapsed.queryTransaction" style="cursor: pointer;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem; transition: transform 0.3s;" :style="{ transform: sectionCollapsed.queryTransaction ? 'rotate(-90deg)' : 'rotate(0deg)' }">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              <h3>交易查询</h3>
            </div>
            <div class="section-header-actions">
              <label class="toggle-switch">
                <input type="checkbox" v-model="queryData.enabled" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">{{ queryData.enabled ? '启用' : '禁用' }}</span>
              </label>
            </div>
          </div>
          
          <div v-show="!sectionCollapsed.queryTransaction" class="query-tip">
            <p>💡 <strong>提示：</strong></p>
            <ul>
              <li>提交交易成功后，交易ID会自动填入查询参数</li>
              <li>至少需要填写<strong>交易ID (Trans ID)</strong>或<strong>订单ID (Order ID)</strong>之一</li>
              <li>查询交易使用与提交交易相同的签名逻辑（SHA256_WITH_RSA）</li>
              <li>查询结果会显示在"交易查询结果"部分</li>
            </ul>
          </div>
          
          <div v-show="!sectionCollapsed.queryTransaction" class="form-row-2" :class="{ 'disabled-section': !queryData.enabled }">
            <div class="form-group">
              <label>商户ID (Merchant ID)</label>
              <input 
                v-model="queryData.merchantId" 
                type="text" 
                placeholder="18356675194960"
                class="input-field"
                :disabled="!queryData.enabled"
              />
            </div>
            <div class="form-group">
              <label>交易ID (Trans ID)</label>
              <input 
                v-model="queryData.transId" 
                type="text" 
                placeholder="留空则查询 order_id"
                class="input-field"
                :disabled="!queryData.enabled"
              />
            </div>
          </div>
          
          <div v-show="!sectionCollapsed.queryTransaction" class="form-row-2" :class="{ 'disabled-section': !queryData.enabled }">
            <div class="form-group">
              <label>订单ID (Order ID)</label>
              <input 
                v-model="queryData.orderId" 
                type="text" 
                placeholder="GW20620xxxxx6999"
                class="input-field"
                :disabled="!queryData.enabled"
              />
            </div>
            <div class="form-group">
              <label>会话ID (Session ID)</label>
              <input 
                v-model="queryData.sessionId" 
                type="text" 
                placeholder="留空"
                class="input-field"
                :disabled="!queryData.enabled"
              />
            </div>
          </div>
          
          <div v-show="!sectionCollapsed.queryTransaction" class="form-group" :class="{ 'disabled-section': !queryData.enabled }">
            <label>时间戳 (Timestamp)</label>
            <input 
              v-model="queryData.timestamp" 
              type="number" 
              placeholder="自动生成当前时间戳"
              class="input-field"
              :disabled="!queryData.enabled"
            />
            <small class="field-desc">留空则自动使用当前时间戳</small>
          </div>

          <div class="button-group">
            <button @click="generateAllRandom" class="btn-random">一键随机生成所有参数</button>
            <button @click="submitTransaction" :disabled="loading" class="btn-primary">
              {{ loading ? '处理中...' : '提交交易' }}
            </button>
            <button @click="queryTransaction" class="btn-primary" :disabled="!canQuery || queryLoading || !queryData.enabled">
              {{ queryLoading ? '查询中...' : '🔍 查询交易' }}
            </button>
            <button @click="resetForm" class="btn-secondary">重置表单</button>
          </div>
        </div>

        <div class="result-section">
          <div class="form-group">
            <div class="json-header">
              <label>生成的请求参数 (Request Parameters)</label>
              <button @click="toggleJsonCollapse" class="btn-toggle-collapse" :title="isJsonCollapsed ? '展开' : '折叠'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path v-if="isJsonCollapsed" d="M9 18l6-6-6-6"/>
                  <path v-else d="M18 15l-6-6-6 6"/>
                </svg>
                {{ isJsonCollapsed ? '展开' : '折叠' }}
              </button>
            </div>
            <div v-show="!isJsonCollapsed" class="json-display-container">
              <textarea 
                v-model="editableJson" 
                class="json-edit"
                :placeholder="requestParamsJson"
                spellcheck="false"
              ></textarea>
              <div class="json-actions">
                <button @click="updateFormFromJson" class="btn-update" title="更新表单">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  更新表单
                </button>
                <button @click="copyJson" class="btn-copy" title="复制JSON">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  复制
                </button>
                <button @click="resetJson" class="btn-reset" title="重置JSON">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                  重置
                </button>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <h2>交易查询结果</h2>
          
          <div v-if="queryResult" class="query-result-container">
            <div class="result-header">
              <label>查询响应结果</label>
              <div class="result-header-actions">
                <button @click="queryResultCollapsed = !queryResultCollapsed" class="btn-toggle-collapse" :title="queryResultCollapsed ? '展开' : '折叠'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path v-if="queryResultCollapsed" d="M9 18l6-6-6-6"/>
                    <path v-else d="M18 15l-6-6-6 6"/>
                  </svg>
                  {{ queryResultCollapsed ? '展开' : '折叠' }}
                </button>
              </div>
            </div>
            <div v-show="!queryResultCollapsed" class="json-display-container">
              <textarea 
                :value="queryResultText" 
                readonly
                class="json-edit"
                spellcheck="false"
              ></textarea>
              <div class="json-actions">
                <button @click="extractRecurringAgreementId" class="btn-extract" title="提取循环协议ID和Token">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  提取循环协议ID和Token
                </button>
                <button @click="copyQueryResult" class="btn-copy" title="复制">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  复制
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="queryError" class="query-error-container">
            <div class="result-header">
              <label>查询错误信息</label>
              <div class="result-header-actions">
                <button @click="queryErrorCollapsed = !queryErrorCollapsed" class="btn-toggle-collapse" :title="queryErrorCollapsed ? '展开' : '折叠'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path v-if="queryErrorCollapsed" d="M9 18l6-6-6-6"/>
                    <path v-else d="M18 15l-6-6-6 6"/>
                  </svg>
                  {{ queryErrorCollapsed ? '展开' : '折叠' }}
                </button>
              </div>
            </div>
            <div v-show="!queryErrorCollapsed" class="json-display-container">
              <textarea 
                :value="queryError" 
                readonly
                class="json-edit error-text"
                spellcheck="false"
              ></textarea>
              <div class="json-actions">
                <button @click="copyQueryError" class="btn-copy" title="复制">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  复制
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="!queryResult && !queryError" class="empty-state">
            <p>暂无查询结果</p>
            <p class="empty-state-desc">点击"查询交易"按钮查询交易信息</p>
          </div>
          
          <div class="divider"></div>

          <h2>测试结果</h2>
          
          <div v-if="!result" class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.3;">
              <path d="M9 12l2 2 4-4"></path>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
              <path d="M12 21c0-1-1-3-3-3s-3 2-3 3 1 3 3 3 3-2 3-3"></path>
              <path d="M12 3c0 1-1 3-3 3S6 4 6 3s1-3 3-3 3 2 3 3"></path>
            </svg>
            <p>暂无测试结果</p>
            <p class="empty-state-desc">请提交交易进行测试</p>
          </div>

          <div v-else class="result-content">
            <div class="result-header">
              <div class="result-status-group">
              <span class="status-badge" :class="result.status">
                  <svg v-if="result.status === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <svg v-else-if="result.status === 'error'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                {{ result.status === 'success' ? '成功' : result.status === 'error' ? '失败' : '进行中' }}
              </span>
                <span class="timestamp">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {{ result.timestamp }}
                </span>
              </div>
            </div>

            <div class="result-body">
              <div v-if="result.responseData" class="form-group">
                <div class="json-header">
                  <label>API响应结果</label>
                  <button @click="resultCollapsed.responseData = !resultCollapsed.responseData" class="btn-toggle-collapse" :title="resultCollapsed.responseData ? '展开' : '折叠'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path v-if="resultCollapsed.responseData" d="M9 18l6-6-6-6"/>
                      <path v-else d="M18 15l-6-6-6 6"/>
                    </svg>
                    {{ resultCollapsed.responseData ? '展开' : '折叠' }}
                  </button>
              </div>
                <div v-show="!resultCollapsed.responseData" class="json-display-container">
                  <textarea 
                    :value="formatJson(result.responseData)" 
                    readonly
                    class="json-edit"
                    spellcheck="false"
                  ></textarea>
                  <div class="json-actions">
                    <button @click="copyResultText(formatJson(result.responseData))" class="btn-copy" title="复制JSON">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      复制
                    </button>
              </div>
                </div>
              </div>

              <div v-if="result.error" class="form-group">
                <div class="json-header">
                  <label>错误信息</label>
                  <button @click="resultCollapsed.error = !resultCollapsed.error" class="btn-toggle-collapse" :title="resultCollapsed.error ? '展开' : '折叠'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path v-if="resultCollapsed.error" d="M9 18l6-6-6-6"/>
                      <path v-else d="M18 15l-6-6-6 6"/>
                    </svg>
                    {{ resultCollapsed.error ? '展开' : '折叠' }}
                  </button>
              </div>
                <div v-show="!resultCollapsed.error" class="json-display-container">
                  <textarea 
                    :value="result.error" 
                    readonly
                    class="json-edit error-text"
                    spellcheck="false"
                  ></textarea>
                  <div class="json-actions">
                    <button @click="copyResultText(result.error)" class="btn-copy" title="复制">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      复制
                    </button>
            </div>
          </div>
        </div>
      </div>
    </div>
        </div>
      </div>
              </div>

    <!-- Toast 提示 -->
    <Toast />
    
    <!-- 测试卡号选择模态框 -->
    <div v-if="showTestCardModal" class="modal-overlay" @click="showTestCardModal = false">
      <div class="modal-content card-modal" @click.stop>
        <div class="modal-header">
          <h3>选择测试卡号</h3>
          <button @click="showTestCardModal = false" class="modal-close" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <!-- 筛选工具栏 -->
          <div class="card-filter-toolbar">
            <div class="filter-group">
              <label>支付渠道：</label>
              <div class="filter-buttons">
                <button 
                  v-for="provider in cardProviders" 
                  :key="provider.value"
                  @click="selectedCardProvider = provider.value"
                  :class="['filter-btn', { active: selectedCardProvider === provider.value }]"
                  type="button"
                >
                  {{ provider.label }}
                </button>
              </div>
            </div>
            <div class="filter-group">
              <label>类别：</label>
              <div class="filter-buttons">
                <button 
                  v-for="category in cardCategories" 
                  :key="category.value"
                  @click="selectedCardCategory = category.value"
                  :class="['filter-btn', { active: selectedCardCategory === category.value }]"
                  type="button"
                >
                  {{ category.label }}
                </button>
              </div>
            </div>
            <div class="filter-group search-group">
              <label>搜索：</label>
              <input 
                v-model="cardSearchText"
                type="text"
                placeholder="输入卡号、类型或描述搜索"
                class="card-search-input"
              />
            </div>
              </div>

          <!-- 测试卡号列表 -->
          <div class="test-card-list">
            <div 
              v-for="(group, index) in filteredGroupedTestCards" 
              :key="index"
              class="card-group"
            >
              <div class="card-group-header">
                <span class="provider-label">{{ group.providerLabel }}</span>
                <span class="category-label">{{ group.categoryLabel }}</span>
                <span class="card-count">({{ group.cards.length }})</span>
              </div>
              <div class="card-items">
                <div 
                  v-for="card in group.cards" 
                  :key="card.id || card.cardNo"
                  class="card-item"
                  @click="selectTestCard(card.cardNo)"
                >
                  <div class="card-number">{{ card.cardNo }}</div>
                  <div class="card-info">
                    <span v-if="card.cardType" class="card-type">{{ card.cardType.toUpperCase() }}</span>
                    <span v-if="card.description" class="card-description">{{ card.description }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="filteredGroupedTestCards.length === 0" class="empty-state">
              <p>暂无匹配的测试卡号</p>
              <p class="empty-state-desc">请调整筛选条件或搜索关键词</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import Toast from './Toast.vue'
import SmartSelect from './SmartSelect.vue'
import { getAllPersonalInfo } from '../services/mockDataManager'
import { payKKaApi, queryTransaction as queryTransactionApi } from '../services/paykkaApi'
import { showError, showSuccess, showInfo } from '../utils/toast'
import { useNavigation } from '../composables/useNavigation'
import { useMerchantConfig } from '../composables/useMerchantConfig'
import { getAllTestCards } from '../services/testCardManager'
import { 
  generateRandomIP,
  generateRandomFirstName,
  generateRandomLastName,
  generateRandomEmail as generateRandomEmailUtil,
  generateRandomPhone as generateRandomPhoneUtil,
  generateRandomAddress as generateRandomAddressUtil,
  generateRandomCountry as generateRandomCountryUtil,
  generateRandomState as generateRandomStateUtil,
  generateRandomCity as generateRandomCityUtil,
  generateRandomPostalCode as generateRandomPostalCodeUtil,
  generateRandomAreaCode as generateRandomAreaCodeUtil
} from '../services/utils'

const { goHome: goBack } = useNavigation()

const loading = ref(false)

// API配置 - 必须在 useMerchantConfig 之前定义
const apiConfig = reactive({
  baseUrl: '', // 从商户配置中选择后自动填充
  merchantId: '', // 从商户配置中选择后自动填充
  appId: '', // 从商户配置中选择后自动填充
  privateKey: '', // 从商户配置中选择后自动填充
  apiKey: '' // 向后兼容，使用 privateKey
})

// 使用商户配置 composable
const { merchantConfigs, selectedMerchantId, onMerchantChange, loadMerchantConfigs } = useMerchantConfig(apiConfig)

// 商户选择变化时，同步 apiKey（向后兼容）
watch(() => apiConfig.privateKey, (newVal) => {
  apiConfig.apiKey = newVal
}, { immediate: true })

// 私钥展开/收起状态
const showPrivateKeyFull = ref(false)

// 生成默认过期时间（当前时间之后半小时）
const getDefaultExpireTime = () => {
  const now = new Date()
  const expireTime = new Date(now.getTime() + 30 * 60 * 1000) // 加30分钟
  
  const year = expireTime.getFullYear()
  const month = String(expireTime.getMonth() + 1).padStart(2, '0')
  const day = String(expireTime.getDate()).padStart(2, '0')
  const hours = String(expireTime.getHours()).padStart(2, '0')
  const minutes = String(expireTime.getMinutes()).padStart(2, '0')
  
  // datetime-local 格式：YYYY-MM-DDTHH:mm
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// 获取当前页面的基础URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol
    const host = window.location.host
    return `${protocol}//${host}`
  }
  return 'http://localhost:5173' // 开发环境默认值
}

// 生成默认成功返回地址
const getDefaultReturnUrl = () => {
  return `${getBaseUrl()}/payment/success`
}

// 生成默认失败返回地址
const getDefaultCancelUrl = () => {
  return `${getBaseUrl()}/payment/cancel`
}

const transactionData = reactive({
  transId: '',
  amount: 0,
  currency: 'USD',
  paymentType: 'PURCHASE',
  recurringAgreementId: '',
  mit: false,
  description: '',
  captureMethod: 'AUTOMATIC',
  expireTime: getDefaultExpireTime(),
  returnUrl: getDefaultReturnUrl(),
  cancelUrl: getDefaultCancelUrl(),
  callbackUrl: '',
  addressCollection: 'AUTO',
  // 开关控制
  enableCustomerInfo: true,
  enableBillInfo: true,
  enableShipInfo: true,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  customerId: '',
  customerOrderIp: '',
  customerPayIp: '',
  customer: '',
  goods: '',
  // 账单信息
  billFirstName: '',
  billLastName: '',
  billEmail: '',
  billPhone: '',
  billAddressLine1: '',
  billCountry: '',
  billState: '',
  billCity: '',
  billPostalCode: '',
  billAreaCode: '',
  billDescriptor: '',
  billAddressCollection: '',
  // 收货信息
  shipFirstName: '',
  shipLastName: '',
  shipEmail: '',
  shipPhone: '',
  shipAddressLine1: '',
  shipCountry: '',
  shipState: '',
  shipCity: '',
  shipPostalCode: '',
  shipAreaCode: '',
  // 支付信息
  enablePaymentInfo: true,
  paymentMethod: 'BANKCARD',
  shopperReference: '',
  cardNo: '',
  expYear: '',
  expMonth: '',
  cvv: '',
  holderName: '',
  holderEmail: '',
  storePaymentMethod: false, // 是否存储卡信息
  tokenUsage: '', // Token用途 (CARD_ON_FILE/SUBSCRIPTION)
  token: '', // 卡令牌 (0-64字符)
  // 浏览器信息
  enableBrowserInfo: true,
  userAgent: '',
  colorDepth: '',
  language: '',
  javaEnabled: false,
  deviceType: 'PC',
  terminalType: 'WEB',
  deviceOs: 'WINDOWS',
  timezoneOffset: '',
  screenHeight: '',
  screenWidth: '',
  cookies: '',
  deviceFingerPrintId: ''
})

const result = ref(null)

// 交易查询相关
const queryData = reactive({
  enabled: true,
  merchantId: '',
  transId: '',
  orderId: '',
  sessionId: '',
  timestamp: ''
})
const queryResult = ref(null)
const queryError = ref(null)
const queryResultCollapsed = ref(false)
const queryErrorCollapsed = ref(false)
const queryLoading = ref(false)

// Mock数据相关
const mockData = ref(null)
const mockDataLoaded = ref(false)
const selectedBillMock = ref('')
const selectedShipMock = ref('')
const isFirstTimeGenerate = ref(true) // 标记是否是第一次生成
const lastSubmittedTransId = ref('') // 记录上次提交的交易ID
const showTestCardModal = ref(false) // 是否显示测试卡号选择模态框
const selectedCardProvider = ref('all') // 选中的支付渠道（all表示全部）
const selectedCardCategory = ref('all') // 选中的类别（all表示全部）
const cardSearchText = ref('') // 卡号搜索文本

// 各个信息部分的折叠状态（默认折叠，减少页面显示）
const sectionCollapsed = reactive({
  paymentInfo: true, // 支付信息默认折叠
  browserInfo: true, // 浏览器信息默认折叠
  customerInfo: true, // 客户信息默认折叠
  billInfo: true, // 账单信息默认折叠
  shipInfo: true, // 收货信息默认折叠
  queryTransaction: true // 交易查询默认折叠
})

// JSON展示相关
const isJsonCollapsed = ref(false)
const editableJson = ref('')
const isManuallyEditingJson = ref(false) // 标记用户是否正在手动编辑JSON

// 测试结果部分的折叠状态
const resultCollapsed = reactive({
  responseData: false,
  error: false
})

// Java Enabled 文本输入处理（布尔值转文本）
const javaEnabledText = computed({
  get: () => {
    if (transactionData.javaEnabled === true || transactionData.javaEnabled === 'true') return 'true'
    if (transactionData.javaEnabled === false || transactionData.javaEnabled === 'false') return 'false'
    return String(transactionData.javaEnabled || 'false')
  },
  set: (val) => {
    if (val === 'true' || val === true) {
      transactionData.javaEnabled = true
    } else if (val === 'false' || val === false) {
      transactionData.javaEnabled = false
    } else {
      // 尝试解析
      const lowerVal = String(val).toLowerCase().trim()
      transactionData.javaEnabled = lowerVal === 'true' || lowerVal === '1' || lowerVal === 'yes'
    }
  }
})

// MIT 文本输入处理（布尔值转文本）
const mitText = computed({
  get: () => {
    if (transactionData.mit === true || transactionData.mit === 'true') return 'true'
    if (transactionData.mit === false || transactionData.mit === 'false') return 'false'
    return String(transactionData.mit || 'false')
  },
  set: (val) => {
    if (val === 'true' || val === true) {
      transactionData.mit = true
    } else if (val === 'false' || val === false) {
      transactionData.mit = false
    } else {
      // 尝试解析
      const lowerVal = String(val).toLowerCase().trim()
      transactionData.mit = lowerVal === 'true' || lowerVal === '1' || lowerVal === 'yes'
    }
  }
})

// Store Payment Method 文本输入处理（布尔值转文本）
const storePaymentMethodText = computed({
  get: () => {
    if (transactionData.storePaymentMethod === true || transactionData.storePaymentMethod === 'true') return 'true'
    if (transactionData.storePaymentMethod === false || transactionData.storePaymentMethod === 'false') return 'false'
    return String(transactionData.storePaymentMethod || 'false')
  },
  set: (val) => {
    if (val === 'true' || val === true) {
      transactionData.storePaymentMethod = true
    } else if (val === 'false' || val === false) {
      transactionData.storePaymentMethod = false
    } else {
      // 尝试解析
      const lowerVal = String(val).toLowerCase().trim()
      transactionData.storePaymentMethod = lowerVal === 'true' || lowerVal === '1' || lowerVal === 'yes'
    }
  }
})

// 随机生成交易ID
const generateTransId = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 100000)
  transactionData.transId = `TXN${timestamp}${random}`
}

// 构建 customer JSON 对象（从表单字段）
const buildCustomerJson = () => {
  if (!transactionData.enableCustomerInfo) {
    return ''
  }
  
  const customerObj = {
    name: transactionData.customerName || '',
    email: transactionData.customerEmail || '',
    phone: transactionData.customerPhone || '',
    id: transactionData.customerId || '',
    order_ip: transactionData.customerOrderIp || '',
    pay_ip: transactionData.customerPayIp || ''
  }
  
  // 只有当所有必填字段都有值时才返回 JSON
  if (customerObj.name && customerObj.email && customerObj.phone && customerObj.id && customerObj.order_ip && customerObj.pay_ip) {
    return JSON.stringify(customerObj, null, 2)
  }
  
  return ''
}

// 监听客户信息字段变化，自动更新 customer JSON
watch([
  () => transactionData.customerName,
  () => transactionData.customerEmail,
  () => transactionData.customerPhone,
  () => transactionData.customerId,
  () => transactionData.customerOrderIp,
  () => transactionData.customerPayIp,
  () => transactionData.enableCustomerInfo
], () => {
  if (transactionData.enableCustomerInfo) {
    transactionData.customer = buildCustomerJson()
  } else {
    transactionData.customer = ''
  }
}, { immediate: true })

// 随机生成客户信息
const generateCustomer = () => {
  const firstName = generateRandomFirstName()
  const lastName = generateRandomLastName()
  const fullName = `${firstName} ${lastName}`
  const email = generateRandomEmailUtil(fullName.toLowerCase().replace(' ', '.'))
  const phone = generateRandomPhoneUtil('us')
  
  // 生成订单IP和支付IP（用于customer对象中的order_ip和pay_ip字段）
  const orderIp = generateRandomIP()
  const payIp = generateRandomIP()
  
  // 生成唯一的客户ID（时间戳 + 随机数）
  const randomSuffix = Math.floor(Math.random() * 1000000)
  transactionData.customerName = fullName
  transactionData.customerEmail = email
  transactionData.customerPhone = phone
  transactionData.customerId = `CUST${Date.now()}${randomSuffix}`
  transactionData.customerOrderIp = orderIp
  transactionData.customerPayIp = payIp
  
  // customer JSON 会通过 watch 自动更新
}

// 随机生成商品信息
const generateGoods = () => {
  const products = [
    { name: 'Laptop', price: 999.99, link: 'https://example.com/products/laptop' },
    { name: 'Smartphone', price: 699.99, link: 'https://example.com/products/smartphone' },
    { name: 'Tablet', price: 399.99, link: 'https://example.com/products/tablet' },
    { name: 'Headphones', price: 199.99, link: 'https://example.com/products/headphones' },
    { name: 'Keyboard', price: 79.99, link: 'https://example.com/products/keyboard' }
  ]
  
  const selectedProducts = []
  const count = Math.floor(Math.random() * 3) + 1 // 1-3个商品
  for (let i = 0; i < count; i++) {
    const product = products[Math.floor(Math.random() * products.length)]
    selectedProducts.push({
      name: product.name,
      quantity: Math.floor(Math.random() * 3) + 1,
      price: product.price,
      link: product.link // 必填字段，不能为null
    })
  }
  
  transactionData.goods = JSON.stringify(selectedProducts, null, 2)
}

// 随机生成金额
const generateRandomAmount = () => {
  const min = 1
  const max = 10000
  const decimals = 2
  transactionData.amount = parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

// 随机生成币种
const generateRandomCurrency = () => {
  const currencies = ['USD', 'EUR', 'GBP', 'CNY', 'JPY', 'HKD', 'SGD']
  transactionData.currency = currencies[Math.floor(Math.random() * currencies.length)]
}

// 随机生成商品描述
const generateRandomDescription = () => {
  const descriptions = [
    '电子产品购买',
    '在线课程订阅',
    '软件服务费用',
    '商品购买订单',
    '服务费用支付',
    '会员订阅费用',
    '数字产品购买',
    '在线服务费用'
  ]
  transactionData.description = descriptions[Math.floor(Math.random() * descriptions.length)]
}

// Mock数据选项（合并 mock_data.json 和用户添加的个人信息）
const billMockOptions = computed(() => {
  const options = []
  let index = 0
  
  // 首先添加 mock_data.json 中的个人信息（预设数据）
  if (mockData.value && mockData.value.personalInfo && mockData.value.personalInfo.length > 0) {
    mockData.value.personalInfo.forEach((item) => {
      const fullName = `${item.firstName} ${item.lastName}`
      const displayLabel = `${fullName} - ${item.city}, ${item.country}`
      const searchText = `${fullName} ${item.country} ${item.city} ${item.firstName} ${item.lastName}`.toLowerCase()
      options.push({
        value: `json_${index}`,
        label: displayLabel,
        searchText: searchText,
        displayName: fullName,
        source: 'json',
        dataIndex: index
      })
      index++
    })
  }
  
  // 然后添加用户添加的个人信息（localStorage）
  try {
    const userPersonalInfo = getAllPersonalInfo()
    if (userPersonalInfo && userPersonalInfo.length > 0) {
      userPersonalInfo.forEach((item) => {
        const fullName = `${item.firstName} ${item.lastName}`
        const displayLabel = `${fullName} - ${item.city}, ${item.country}`
        const searchText = `${fullName} ${item.country} ${item.city} ${item.firstName} ${item.lastName}`.toLowerCase()
        options.push({
          value: `user_${item.id || index}`,
          label: displayLabel,
          searchText: searchText,
          displayName: fullName,
          source: 'user',
          dataIndex: index,
          userData: item
        })
        index++
      })
    }
  } catch (error) {
    console.error('获取用户个人信息失败:', error)
  }
  
  return options
})

const shipMockOptions = computed(() => {
  const options = []
  let index = 0
  
  // 首先添加 mock_data.json 中的个人信息（预设数据）
  if (mockData.value && mockData.value.personalInfo && mockData.value.personalInfo.length > 0) {
    mockData.value.personalInfo.forEach((item) => {
      const fullName = `${item.firstName} ${item.lastName}`
      const displayLabel = `${fullName} - ${item.city}, ${item.country}`
      const searchText = `${fullName} ${item.country} ${item.city} ${item.firstName} ${item.lastName}`.toLowerCase()
      options.push({
        value: `json_${index}`,
        label: displayLabel,
        searchText: searchText,
        displayName: fullName,
        source: 'json',
        dataIndex: index
      })
      index++
    })
  }
  
  // 然后添加用户添加的个人信息（localStorage）
  try {
    const userPersonalInfo = getAllPersonalInfo()
    if (userPersonalInfo && userPersonalInfo.length > 0) {
      userPersonalInfo.forEach((item) => {
        const fullName = `${item.firstName} ${item.lastName}`
        const displayLabel = `${fullName} - ${item.city}, ${item.country}`
        const searchText = `${fullName} ${item.country} ${item.city} ${item.firstName} ${item.lastName}`.toLowerCase()
        options.push({
          value: `user_${item.id || index}`,
          label: displayLabel,
          searchText: searchText,
          displayName: fullName,
          source: 'user',
          dataIndex: index,
          userData: item
        })
        index++
      })
    }
  } catch (error) {
    console.error('获取用户个人信息失败:', error)
  }
  
  return options
})

// 测试卡号选项
const testCardOptions = computed(() => {
  try {
    const allCards = getAllTestCards()
    if (!allCards || allCards.length === 0) {
      return []
    }
    
    // 按渠道分组，然后按类别分组
    const groupedCards = {}
    allCards.forEach(card => {
      const provider = card.provider || 'other'
      const category = card.category || 'common'
      const key = `${provider}_${category}`
      
      if (!groupedCards[key]) {
        groupedCards[key] = {
          provider,
          category,
          cards: []
        }
      }
      groupedCards[key].cards.push(card)
    })
    
    // 构建选项列表
    const options = []
    const providerLabels = {
      'stripe': 'Stripe',
      'ecp': 'ECP',
      'cko': 'CKO',
      'other': '其他'
    }
    const categoryLabels = {
      'common': '常用卡',
      'special': '特殊卡'
    }
    
    // 按渠道和类别排序
    const sortedKeys = Object.keys(groupedCards).sort()
    sortedKeys.forEach(key => {
      const group = groupedCards[key]
      const providerLabel = providerLabels[group.provider] || group.provider
      const categoryLabel = categoryLabels[group.category] || group.category
      
      // 添加分组标题（使用特殊值作为分隔符）
      options.push({
        value: `__group_${key}__`,
        label: `${providerLabel} - ${categoryLabel}`,
        disabled: true,
        isGroup: true
      })
      
      // 添加该组下的所有卡号
      group.cards.forEach(card => {
        // 优化显示格式：卡号 + 卡类型 + 描述
        let displayLabel = card.cardNo
        const parts = []
        
        if (card.cardType) {
          parts.push(card.cardType.toUpperCase())
        }
        if (card.description) {
          parts.push(card.description)
        }
        
        if (parts.length > 0) {
          displayLabel = `${card.cardNo} [${parts.join(' | ')}]`
        }
        
        // 搜索关键词：卡号、卡类型、描述、渠道、类别
        const searchText = `${card.cardNo} ${card.cardType || ''} ${card.description || ''} ${providerLabel} ${categoryLabel}`.toLowerCase()
        
        options.push({
          value: card.cardNo,
          label: displayLabel,
          searchText: searchText,
          displayName: card.cardNo // 选中后只显示卡号
        })
      })
    })
    
    return options
  } catch (error) {
    console.error('获取测试卡号选项失败:', error)
    return []
  }
})

// 支付渠道选项
const cardProviders = [
  { value: 'all', label: '全部' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'ecp', label: 'ECP' },
  { value: 'cko', label: 'CKO' }
]

// 类别选项
const cardCategories = [
  { value: 'all', label: '全部' },
  { value: 'common', label: '常用卡' },
  { value: 'special', label: '特殊卡' }
]

// 分组后的测试卡号（用于模态框显示）
const groupedTestCards = computed(() => {
  try {
    const allCards = getAllTestCards()
    if (!allCards || allCards.length === 0) {
      return []
    }
    
    // 按渠道分组，然后按类别分组
    const grouped = {}
    allCards.forEach(card => {
      const provider = card.provider || 'other'
      const category = card.category || 'common'
      const key = `${provider}_${category}`
      
      if (!grouped[key]) {
        grouped[key] = {
          provider,
          category,
          providerLabel: getProviderLabel(provider),
          categoryLabel: getCategoryLabel(category),
          cards: []
        }
      }
      grouped[key].cards.push(card)
    })
    
    // 转换为数组并排序，Stripe 常用卡优先
    return Object.values(grouped).sort((a, b) => {
      // Stripe 常用卡排在最前面
      const aIsStripeCommon = a.provider === 'stripe' && a.category === 'common'
      const bIsStripeCommon = b.provider === 'stripe' && b.category === 'common'
      
      if (aIsStripeCommon && !bIsStripeCommon) {
        return -1
      }
      if (!aIsStripeCommon && bIsStripeCommon) {
        return 1
      }
      
      // 其他按原来的逻辑排序
      if (a.provider !== b.provider) {
        return a.provider.localeCompare(b.provider)
      }
      return a.category.localeCompare(b.category)
    })
  } catch (error) {
    console.error('获取分组测试卡号失败:', error)
    return []
  }
})

// 过滤后的分组测试卡号
const filteredGroupedTestCards = computed(() => {
  let filtered = groupedTestCards.value
  
  // 按渠道筛选
  if (selectedCardProvider.value !== 'all') {
    filtered = filtered.filter(group => group.provider === selectedCardProvider.value)
  }
  
  // 按类别筛选
  if (selectedCardCategory.value !== 'all') {
    filtered = filtered.filter(group => group.category === selectedCardCategory.value)
  }
  
  // 按搜索文本筛选
  if (cardSearchText.value && cardSearchText.value.trim()) {
    const searchLower = cardSearchText.value.toLowerCase().trim()
    filtered = filtered.map(group => {
      const filteredCards = group.cards.filter(card => {
        const cardNo = (card.cardNo || '').toLowerCase()
        const cardType = (card.cardType || '').toLowerCase()
        const description = (card.description || '').toLowerCase()
        return cardNo.includes(searchLower) || 
               cardType.includes(searchLower) || 
               description.includes(searchLower)
      })
      return {
        ...group,
        cards: filteredCards
      }
    }).filter(group => group.cards.length > 0)
  }
  
  return filtered
})

// 获取渠道标签
const getProviderLabel = (provider) => {
  const labels = {
    'stripe': 'Stripe',
    'ecp': 'ECP',
    'cko': 'CKO',
    'other': '其他'
  }
  return labels[provider] || provider
}

// 获取类别标签
const getCategoryLabel = (category) => {
  const labels = {
    'common': '常用卡',
    'special': '特殊卡'
  }
  return labels[category] || category
}

// 选择测试卡号
const selectTestCard = (cardNo) => {
  transactionData.cardNo = cardNo
  showTestCardModal.value = false
  // 重置筛选条件
  selectedCardProvider.value = 'all'
  selectedCardCategory.value = 'all'
  cardSearchText.value = ''
  showSuccess('已选择测试卡号')
}

// 从Mock数据应用账单信息
const applyBillFromMock = (value) => {
  let item = null
  
  // 根据 value 判断数据来源
  if (value.startsWith('json_')) {
    // 来自 mock_data.json
    const index = parseInt(value.replace('json_', ''))
    if (mockData.value && mockData.value.personalInfo && mockData.value.personalInfo[index]) {
      item = mockData.value.personalInfo[index]
    }
  } else if (value.startsWith('user_')) {
    // 来自用户添加的个人信息
    const id = value.replace('user_', '')
    const userPersonalInfo = getAllPersonalInfo()
    item = userPersonalInfo.find(p => p.id === id)
  }
  
  if (!item) {
    return
  }
  
  transactionData.billFirstName = item.firstName
  transactionData.billLastName = item.lastName
  transactionData.billEmail = item.email
  transactionData.billPhone = item.phone
  transactionData.billAddressLine1 = item.addressLine1
  transactionData.billCountry = item.country
  transactionData.billState = item.state
  transactionData.billCity = item.city
  transactionData.billPostalCode = item.postalCode
  transactionData.billAreaCode = item.areaCode
  transactionData.billDescriptor = `DESC${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  const options = ['REQUIRED', 'AUTO']
  transactionData.billAddressCollection = options[Math.floor(Math.random() * options.length)]
}

// 从Mock数据应用收货信息
const applyShipFromMock = (value) => {
  let item = null
  
  // 根据 value 判断数据来源
  if (value.startsWith('json_')) {
    // 来自 mock_data.json
    const index = parseInt(value.replace('json_', ''))
    if (mockData.value && mockData.value.personalInfo && mockData.value.personalInfo[index]) {
      item = mockData.value.personalInfo[index]
    }
  } else if (value.startsWith('user_')) {
    // 来自用户添加的个人信息
    const id = value.replace('user_', '')
    const userPersonalInfo = getAllPersonalInfo()
    item = userPersonalInfo.find(p => p.id === id)
  }
  
  if (!item) {
    return
  }
  
  transactionData.shipFirstName = item.firstName
  transactionData.shipLastName = item.lastName
  transactionData.shipEmail = item.email
  transactionData.shipPhone = item.phone
  transactionData.shipAddressLine1 = item.addressLine1
  transactionData.shipCountry = item.country
  transactionData.shipState = item.state
  transactionData.shipCity = item.city
  transactionData.shipPostalCode = item.postalCode
  transactionData.shipAreaCode = item.areaCode
}

// 监听账单信息Mock数据选择，自动应用
watch(selectedBillMock, (newValue) => {
  if (newValue && newValue !== '') {
    applyBillFromMock(newValue)
    showSuccess('已应用预设账单信息')
  }
})

// 监听收货信息Mock数据选择，自动应用
watch(selectedShipMock, (newValue) => {
  if (newValue && newValue !== '') {
    applyShipFromMock(newValue)
    showSuccess('已应用预设收货信息')
  }
})


// 批量生成所有客户信息
const generateAllCustomerInfo = () => {
  generateCustomer()
}

// 批量生成所有账单信息
const generateAllBillInfo = (forceRandom = false) => {
  if (!forceRandom && selectedBillMock.value) {
    // 如果选择了预设数据，应用该数据
    applyBillFromMock(parseInt(selectedBillMock.value))
    showSuccess('已应用预设账单信息')
  } else {
    // 否则从Mock数据中随机选择
    if (!forceRandom && mockData.value && mockData.value.personalInfo && mockData.value.personalInfo.length > 0) {
      const randomIndex = Math.floor(Math.random() * mockData.value.personalInfo.length)
      applyBillFromMock(randomIndex)
      showSuccess('已随机生成账单信息')
    } else {
      // 如果没有Mock数据或强制随机生成，使用原来的随机生成方法
      transactionData.billFirstName = generateRandomFirstName()
      transactionData.billLastName = generateRandomLastName()
      transactionData.billEmail = generateRandomEmailUtil('bill')
      transactionData.billPhone = generateRandomPhoneUtil('us')
      transactionData.billAddressLine1 = generateRandomAddressUtil('en')
      transactionData.billCountry = generateRandomCountryUtil()
      transactionData.billState = generateRandomStateUtil(transactionData.billCountry || 'US')
      transactionData.billCity = generateRandomCityUtil(transactionData.billCountry || 'US')
      transactionData.billPostalCode = generateRandomPostalCodeUtil()
      transactionData.billAreaCode = generateRandomAreaCodeUtil(transactionData.billCountry || 'CN')
      transactionData.billDescriptor = `DESC${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      const options = ['REQUIRED', 'AUTO']
      transactionData.billAddressCollection = options[Math.floor(Math.random() * options.length)]
    }
  }
}

// 批量生成所有收货信息
const generateAllShipInfo = (forceRandom = false) => {
  if (!forceRandom && selectedShipMock.value) {
    // 如果选择了预设数据，应用该数据
    applyShipFromMock(parseInt(selectedShipMock.value))
    showSuccess('已应用预设收货信息')
  } else {
    // 否则从Mock数据中随机选择
    if (!forceRandom && mockData.value && mockData.value.personalInfo && mockData.value.personalInfo.length > 0) {
      const randomIndex = Math.floor(Math.random() * mockData.value.personalInfo.length)
      applyShipFromMock(randomIndex)
      showSuccess('已随机生成收货信息')
    } else {
      // 如果没有Mock数据或强制随机生成，使用原来的随机生成方法
      transactionData.shipFirstName = generateRandomFirstName()
      transactionData.shipLastName = generateRandomLastName()
      transactionData.shipEmail = generateRandomEmailUtil('ship')
      transactionData.shipPhone = generateRandomPhoneUtil('fr')
      transactionData.shipAddressLine1 = generateRandomAddressUtil('en')
      transactionData.shipCountry = generateRandomCountryUtil()
      transactionData.shipState = generateRandomStateUtil(transactionData.shipCountry || 'FR')
      transactionData.shipCity = generateRandomCityUtil(transactionData.shipCountry || 'FR')
      transactionData.shipPostalCode = generateRandomPostalCodeUtil()
      transactionData.shipAreaCode = generateRandomAreaCodeUtil(transactionData.shipCountry || 'FR')
    }
  }
}

// 随机生成支付信息
const generatePaymentInfo = () => {
  // 生成购物者参考（32位十六进制字符串）
  const chars = '0123456789abcdef'
  let shopperRef = ''
  for (let i = 0; i < 32; i++) {
    shopperRef += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  transactionData.shopperReference = shopperRef
  
  // 生成测试卡号（Visa测试卡号）
  const testCards = [
    '4242424242424242',
    '4000000000000002',
    '4000000000009995',
    '5555555555554444'
  ]
  transactionData.cardNo = testCards[Math.floor(Math.random() * testCards.length)]
  
  // 生成过期年份（当前年份+1到+10）
  const currentYear = new Date().getFullYear()
  const expYear = currentYear + Math.floor(Math.random() * 10) + 1
  transactionData.expYear = String(expYear)
  
  // 生成过期月份（01-12）
  const expMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
  transactionData.expMonth = expMonth
  
  // 生成CVV（3位数字）
  transactionData.cvv = String(Math.floor(Math.random() * 900) + 100)
  
  // 生成持卡人姓名
  const firstName = generateRandomFirstName()
  const lastName = generateRandomLastName()
  transactionData.holderName = `${firstName} ${lastName}`
  
  // 生成持卡人邮箱
  transactionData.holderEmail = generateRandomEmailUtil(firstName.toLowerCase() + '.' + lastName.toLowerCase())
}

// 随机生成浏览器信息
const generateBrowserInfo = () => {
  // 生成 User Agent
  const userAgents = [
    'Mozilla/5.0 (Linux; U; Android 12.0.0; zh-cn; SONY-7XT78X Build/2DKKUF) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 Chrome/74.0.3729.157 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  ]
  transactionData.userAgent = userAgents[Math.floor(Math.random() * userAgents.length)]
  
  // 生成颜色深度（常见值：16, 24, 32）
  const colorDepths = ['16', '24', '32', '165']
  transactionData.colorDepth = colorDepths[Math.floor(Math.random() * colorDepths.length)]
  
  // 生成语言
  const languages = ['ko-KR', 'en-US', 'zh-CN', 'ja-JP', 'fr-FR', 'de-DE']
  transactionData.language = languages[Math.floor(Math.random() * languages.length)]
  
  // Java 启用（随机 true/false）
  transactionData.javaEnabled = Math.random() > 0.5
  
  // 设备类型
  const deviceTypes = ['PC', 'MOBILE', 'TABLET']
  transactionData.deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)]
  
  // 终端类型
  transactionData.terminalType = 'WEB'
  
  // 设备操作系统
  const deviceOsList = ['WINDOWS', 'MACOS', 'LINUX', 'ANDROID', 'IOS']
  transactionData.deviceOs = deviceOsList[Math.floor(Math.random() * deviceOsList.length)]
  
  // 生成时区偏移（-12:00 到 +14:00）
  const hours = Math.floor(Math.random() * 27) - 12 // -12 到 +14
  const minutes = Math.floor(Math.random() * 60)
  const sign = hours >= 0 ? '+' : '-'
  transactionData.timezoneOffset = `${sign}${Math.abs(hours).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  
  // 生成屏幕尺寸
  const screenSizes = [
    { width: '1920', height: '1080' },
    { width: '1366', height: '768' },
    { width: '128', height: '255' },
    { width: '375', height: '667' },
    { width: '414', height: '896' }
  ]
  const screenSize = screenSizes[Math.floor(Math.random() * screenSizes.length)]
  transactionData.screenWidth = screenSize.width
  transactionData.screenHeight = screenSize.height
  
  // 生成 Cookies
  const cookieValues = [
    'isg=BA4O1YD75-wYqlLAB-T9JZjXxxxJFHEUkjdslrlhj9 TB_TENANT_TYPE=organization',
    'session_id=abc123def456; user_pref=dark_mode',
    'csrf_token=xyz789; lang=en-US'
  ]
  transactionData.cookies = cookieValues[Math.floor(Math.random() * cookieValues.length)]
  
  // 生成设备指纹ID
  const chars = 'abcdefghijklmnopqrstuvwxyz.'
  let fingerPrintId = 'info.'
  for (let i = 0; i < 15; i++) {
    fingerPrintId += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  fingerPrintId += '.'
  for (let i = 0; i < 20; i++) {
    fingerPrintId += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  transactionData.deviceFingerPrintId = fingerPrintId
}

// 一键随机生成所有参数
const generateAllRandom = () => {
  // 清除预设数据选择，强制随机生成
  selectedBillMock.value = ''
  selectedShipMock.value = ''
  
  generateRandomAmount()
  generateRandomCurrency()
  generateTransId()
  generateGoods()
  
  // 只在第一次生成时生成这些信息
  const isFirstTime = isFirstTimeGenerate.value
  if (isFirstTime) {
    generateAllCustomerInfo()
    // 如果账单信息开关启用，则生成账单信息（与浏览器信息逻辑保持一致）
    if (transactionData.enableBillInfo) {
      generateAllBillInfo(true) // 强制随机生成
    }
    // 如果收货信息开关启用，则生成收货信息
    if (transactionData.enableShipInfo) {
      generateAllShipInfo(true) // 强制随机生成
    }
    // 如果支付信息开关启用，则生成支付信息
    if (transactionData.enablePaymentInfo) {
      generatePaymentInfo()
    }
    // 如果浏览器信息开关启用，则生成浏览器信息
    if (transactionData.enableBrowserInfo) {
      generateBrowserInfo()
    }
    // 标记已生成过，后续不再生成
    isFirstTimeGenerate.value = false
    showSuccess('已随机生成所有参数')
  } else {
    showSuccess('已更新交易参数（保留个人信息）')
  }
  
  // 保持过期时间为默认值（当前时间之后半小时），不随机生成
  transactionData.expireTime = getDefaultExpireTime()
  // 注意：addressCollection 不参与随机生成，保持用户设置的值或默认值 'AUTO'
  transactionData.returnUrl = getDefaultReturnUrl()
  transactionData.cancelUrl = getDefaultCancelUrl()
}

// 格式化JSON
const formatJson = (obj) => {
  if (!obj) return ''
  return JSON.stringify(obj, null, 2)
}

// 生成请求参数的辅助函数
const buildRequestParams = () => {
  try {
    // 解析JSON数据
    let customerObj = null
    let goodsObj = null
    
    // 从表单字段构建 customer 对象
    if (transactionData.enableCustomerInfo) {
      if (transactionData.customerName && transactionData.customerEmail && 
          transactionData.customerPhone && transactionData.customerId && 
          transactionData.customerOrderIp && transactionData.customerPayIp) {
        customerObj = {
          name: transactionData.customerName.trim(),
          email: transactionData.customerEmail.trim(),
          phone: transactionData.customerPhone.trim(),
          id: transactionData.customerId.trim(),
          order_ip: transactionData.customerOrderIp.trim(),
          pay_ip: transactionData.customerPayIp.trim()
        }
      }
    }
    
    if (transactionData.goods) {
      try {
        goodsObj = JSON.parse(transactionData.goods)
      } catch (e) {
        goodsObj = { error: 'JSON格式错误' }
      }
    }
    
    // 构建地址信息对象的辅助函数
    const buildAddressObject = (prefix) => {
      const obj = {}
      const fieldMap = {
        FirstName: 'first_name',
        LastName: 'last_name',
        Email: 'email',
        Phone: 'phone_number',
        AddressLine1: 'address_line1',
        Country: 'country',
        State: 'state',
        City: 'city',
        PostalCode: 'postal_code',
        AreaCode: 'area_code'
      }
      
      for (const [key, snakeKey] of Object.entries(fieldMap)) {
        const value = transactionData[`${prefix}${key}`]
        if (value) obj[snakeKey] = value
      }
      
      if (prefix === 'bill') {
        if (transactionData.billDescriptor) obj.descriptor = transactionData.billDescriptor
        if (transactionData.billAddressCollection) obj.billing_address_collection = transactionData.billAddressCollection
      }
      
      return Object.keys(obj).length > 0 ? obj : null
    }
    
    // 构建支付信息对象的辅助函数（与账单信息逻辑保持一致）
    const buildPaymentObject = () => {
      const obj = {}
      // payment_method 是必填字段，必须包含
      if (transactionData.paymentMethod) {
        obj.payment_method = transactionData.paymentMethod
      } else {
        obj.payment_method = 'BANKCARD' // 默认值
      }
      
      // 其他可选字段
      if (transactionData.shopperReference) obj.shopper_reference = transactionData.shopperReference
      if (transactionData.cardNo) obj.card_no = transactionData.cardNo
      if (transactionData.expYear) obj.exp_year = transactionData.expYear
      if (transactionData.expMonth) obj.exp_month = transactionData.expMonth
      if (transactionData.cvv) obj.cvv = transactionData.cvv
      if (transactionData.holderName) obj.holder_name = transactionData.holderName
      if (transactionData.holderEmail) obj.holder_email = transactionData.holderEmail
      
      // 存储卡信息字段（当 payment_type 为 RECURRING 时使用）
      if (transactionData.storePaymentMethod !== undefined && transactionData.storePaymentMethod !== null) {
        obj.store_payment_method = transactionData.storePaymentMethod === true || transactionData.storePaymentMethod === 'true'
      }
      
      // Token用途字段（当store_payment_method=true或者token支付时必传）
      if (transactionData.tokenUsage) {
        obj.token_usage = transactionData.tokenUsage
      }
      
      // 卡令牌字段（BANKCARD支付方式下[token, card_no, encrypted_card_no]三选一）
      if (transactionData.token) {
        obj.token = transactionData.token
      }
      
      // payment 对象必须存在（至少包含 payment_method），所以总是返回对象
      return obj
    }
    
    // 构建浏览器信息对象的辅助函数（与账单信息逻辑保持一致）
    const buildBrowserObject = () => {
      const obj = {}
      if (transactionData.userAgent) obj.user_agent = transactionData.userAgent
      if (transactionData.colorDepth) obj.color_depth = transactionData.colorDepth
      if (transactionData.language) obj.language = transactionData.language
      if (transactionData.javaEnabled !== undefined && transactionData.javaEnabled !== null) {
        obj.java_enabled = transactionData.javaEnabled
      }
      if (transactionData.deviceType) obj.device_type = transactionData.deviceType
      if (transactionData.terminalType) obj.terminal_type = transactionData.terminalType
      if (transactionData.deviceOs) obj.device_os = transactionData.deviceOs
      if (transactionData.timezoneOffset) obj.timezone_offset = transactionData.timezoneOffset
      if (transactionData.screenHeight) obj.screen_height = transactionData.screenHeight
      if (transactionData.screenWidth) obj.screen_width = transactionData.screenWidth
      if (transactionData.cookies) obj.cookies = transactionData.cookies
      if (transactionData.deviceFingerPrintId) obj.device_finger_print_id = transactionData.deviceFingerPrintId
      
      return Object.keys(obj).length > 0 ? obj : null
    }
    
    // 构建请求参数
    const params = {
      merchant_id: apiConfig.merchantId || '(未填写)',
      trans_id: transactionData.transId || '(未填写)',
      amount: transactionData.amount || 0,
      currency: transactionData.currency || 'USD',
      payment_type: transactionData.paymentType || 'PURCHASE',
      description: transactionData.description || '(未填写)',
      capture_method: transactionData.captureMethod || 'AUTOMATIC',
      expire_time: transactionData.expireTime ? formatExpireTime(transactionData.expireTime) : '(未填写)',
      address_collection: transactionData.addressCollection || 'AUTO',
      return_url: transactionData.returnUrl || '(未填写)',
      cancel_url: transactionData.cancelUrl || '(未填写)',
      goods: goodsObj || '(未填写)'
    }
    
    // 循环支付参数（仅当支付类型为 RECURRING 时添加）
    if (transactionData.paymentType === 'RECURRING') {
      if (transactionData.recurringAgreementId) {
        params.recurring_agreement_id = transactionData.recurringAgreementId
      }
      if (transactionData.mit !== undefined && transactionData.mit !== null) {
        params.mit = transactionData.mit
      }
    }
    
    // 只有当客户信息开关启用时，才添加客户信息字段和 customer 对象
    if (transactionData.enableCustomerInfo) {
      if (customerObj) {
        params.customer = customerObj
      }
    }
    
    // 构建账单信息对象（bill）- 只有当开关启用时才构建
    if (transactionData.enableBillInfo) {
      const billObj = buildAddressObject('bill')
      if (billObj) {
        params.bill = billObj
      }
    }
    
    // 构建收货信息对象（shipping）- 只有当开关启用时才构建
    if (transactionData.enableShipInfo) {
      const shipObj = buildAddressObject('ship')
      if (shipObj) {
        params.shipping = shipObj
      }
    }
    
    // 构建支付信息对象（payment）- 只有当开关启用时才构建
    if (transactionData.enablePaymentInfo) {
      const paymentObj = buildPaymentObject()
      if (paymentObj) {
        params.payment = paymentObj
      }
    }
    
    // 构建浏览器信息对象（browser）- 只有当开关启用时才构建
    if (transactionData.enableBrowserInfo) {
      const browserObj = buildBrowserObject()
      if (browserObj) {
        params.browser = browserObj
      }
    }
    
    return params
  } catch (error) {
    return { error: `生成JSON时出错: ${error.message}` }
  }
}

// 格式化过期时间：将 datetime-local 格式转换为 API 需要的格式
const formatExpireTime = (timeStr) => {
  if (!timeStr || timeStr.trim() === '') return ''
  
  // 如果已经是正确格式（包含时区），直接返回
  const timezonePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{4}/
  if (timezonePattern.test(timeStr)) {
    return timeStr
  }
  
  // 如果是 datetime-local 格式（"2023-11-24T11:34"），转换为 API 格式
  try {
    const date = new Date(timeStr)
    if (isNaN(date.getTime())) {
      return timeStr
    }
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    // 默认使用 +0800 时区（中国标准时间）
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+0800`
  } catch (e) {
    return timeStr
  }
}

// 计算生成的请求参数JSON
const requestParamsJson = computed(() => {
  const params = buildRequestParams()
  return formatJson(params)
})

// 使用 watch 来同步JSON - 当表单数据变化时自动更新
watch(requestParamsJson, (newValue) => {
  // 如果用户没有手动编辑JSON，则自动同步更新
  if (!isManuallyEditingJson.value) {
    editableJson.value = newValue
  }
}, { immediate: true })

// 监听 editableJson 的变化，检测用户是否在手动编辑
watch(editableJson, (newValue) => {
  // 如果 editableJson 与 requestParamsJson 不同，说明用户正在手动编辑
  if (newValue && newValue.trim() !== '' && newValue !== requestParamsJson.value) {
    isManuallyEditingJson.value = true
  }
})

// 监听支付类型变化，当选择循环支付时自动设置存储卡信息为 true 和 tokenUsage 为 SUBSCRIPTION
watch(() => transactionData.paymentType, (newValue) => {
  if (newValue === 'RECURRING') {
    transactionData.storePaymentMethod = true
    transactionData.tokenUsage = 'SUBSCRIPTION'
  }
})

// 切换JSON折叠状态
const toggleJsonCollapse = () => {
  isJsonCollapsed.value = !isJsonCollapsed.value
}

// 重置JSON为当前表单值
const resetJson = () => {
  isManuallyEditingJson.value = false
  editableJson.value = requestParamsJson.value
}

// 从JSON更新表单
const updateFormFromJson = () => {
  try {
    const jsonText = editableJson.value.trim()
    if (!jsonText) {
      showError('JSON内容为空')
      return
    }
    
    const params = JSON.parse(jsonText)
    
    // 更新基本字段
    if (params.trans_id && params.trans_id !== '(未填写)') {
      transactionData.transId = params.trans_id
    }
    if (params.amount !== undefined && params.amount !== '(未填写)') {
      transactionData.amount = params.amount
    }
    if (params.currency && params.currency !== '(未填写)') {
      transactionData.currency = params.currency
    }
    if (params.payment_type && params.payment_type !== '(未填写)') {
      transactionData.paymentType = params.payment_type
    }
    // 循环支付参数
    if (params.recurring_agreement_id && params.recurring_agreement_id !== '(未填写)') {
      transactionData.recurringAgreementId = params.recurring_agreement_id
    }
    if (params.mit !== undefined && params.mit !== null && params.mit !== '(未填写)') {
      transactionData.mit = params.mit === true || params.mit === 'true' || params.mit === 1
    }
    if (params.description && params.description !== '(未填写)') {
      transactionData.description = params.description
    }
    if (params.capture_method && params.capture_method !== '(未填写)') {
      transactionData.captureMethod = params.capture_method
    }
    if (params.expire_time && params.expire_time !== '(未填写)') {
      transactionData.expireTime = params.expire_time
    }
    if (params.address_collection && params.address_collection !== '(未填写)') {
      transactionData.addressCollection = params.address_collection
    }
    if (params.return_url && params.return_url !== '(未填写)') {
      transactionData.returnUrl = params.return_url
    }
    if (params.cancel_url && params.cancel_url !== '(未填写)') {
      transactionData.cancelUrl = params.cancel_url
    }
    if (params.merchant_id && params.merchant_id !== '(未填写)') {
      apiConfig.merchantId = params.merchant_id
    }
    
    // 更新商品信息
    if (params.goods && params.goods !== '(未填写)' && !params.goods.error) {
      transactionData.goods = formatJson(params.goods)
    }
    
    // 更新客户信息
    if (params.customer && !params.customer.error) {
      transactionData.enableCustomerInfo = true
      if (params.customer.name) transactionData.customerName = params.customer.name
      if (params.customer.email) transactionData.customerEmail = params.customer.email
      if (params.customer.phone) transactionData.customerPhone = params.customer.phone
      if (params.customer.id) transactionData.customerId = params.customer.id
      if (params.customer.order_ip) transactionData.customerOrderIp = params.customer.order_ip
      if (params.customer.pay_ip) transactionData.customerPayIp = params.customer.pay_ip
      // customer JSON 会通过 watch 自动更新
    }
    
    // 更新账单信息
    if (params.bill) {
      transactionData.enableBillInfo = true
      const fieldMap = {
        first_name: 'FirstName',
        last_name: 'LastName',
        email: 'Email',
        phone_number: 'Phone',
        address_line1: 'AddressLine1',
        country: 'Country',
        state: 'State',
        city: 'City',
        postal_code: 'PostalCode',
        area_code: 'AreaCode'
      }
      for (const [snakeKey, key] of Object.entries(fieldMap)) {
        if (params.bill[snakeKey]) {
          transactionData[`bill${key}`] = params.bill[snakeKey]
        }
      }
      if (params.bill.descriptor) transactionData.billDescriptor = params.bill.descriptor
      if (params.bill.billing_address_collection) transactionData.billAddressCollection = params.bill.billing_address_collection
    }
    
    // 更新收货信息
    if (params.shipping) {
      transactionData.enableShipInfo = true
      const fieldMap = {
        first_name: 'FirstName',
        last_name: 'LastName',
        email: 'Email',
        phone_number: 'Phone',
        address_line1: 'AddressLine1',
        country: 'Country',
        state: 'State',
        city: 'City',
        postal_code: 'PostalCode',
        area_code: 'AreaCode'
      }
      for (const [snakeKey, key] of Object.entries(fieldMap)) {
        if (params.shipping[snakeKey]) {
          transactionData[`ship${key}`] = params.shipping[snakeKey]
        }
      }
    }
    
    // 更新支付信息
    if (params.payment) {
      transactionData.enablePaymentInfo = true
      if (params.payment.payment_method) transactionData.paymentMethod = params.payment.payment_method
      if (params.payment.shopper_reference) transactionData.shopperReference = params.payment.shopper_reference
      if (params.payment.card_no) transactionData.cardNo = params.payment.card_no
      if (params.payment.exp_year) transactionData.expYear = params.payment.exp_year
      if (params.payment.exp_month) transactionData.expMonth = params.payment.exp_month
      if (params.payment.cvv) transactionData.cvv = params.payment.cvv
      if (params.payment.holder_name) transactionData.holderName = params.payment.holder_name
      if (params.payment.holder_email) transactionData.holderEmail = params.payment.holder_email
      if (params.payment.store_payment_method !== undefined && params.payment.store_payment_method !== null) {
        transactionData.storePaymentMethod = params.payment.store_payment_method === true || params.payment.store_payment_method === 'true'
      }
      if (params.payment.token_usage) transactionData.tokenUsage = params.payment.token_usage
      if (params.payment.token) transactionData.token = params.payment.token
    }
    
    // 更新浏览器信息
    if (params.browser) {
      transactionData.enableBrowserInfo = true
      if (params.browser.user_agent) transactionData.userAgent = params.browser.user_agent
      if (params.browser.color_depth) transactionData.colorDepth = params.browser.color_depth
      if (params.browser.language) transactionData.language = params.browser.language
      if (params.browser.java_enabled !== undefined && params.browser.java_enabled !== null) {
        transactionData.javaEnabled = params.browser.java_enabled
      }
      if (params.browser.device_type) transactionData.deviceType = params.browser.device_type
      if (params.browser.terminal_type) transactionData.terminalType = params.browser.terminal_type
      if (params.browser.device_os) transactionData.deviceOs = params.browser.device_os
      if (params.browser.timezone_offset) transactionData.timezoneOffset = params.browser.timezone_offset
      if (params.browser.screen_height) transactionData.screenHeight = params.browser.screen_height
      if (params.browser.screen_width) transactionData.screenWidth = params.browser.screen_width
      if (params.browser.cookies) transactionData.cookies = params.browser.cookies
      if (params.browser.device_finger_print_id) transactionData.deviceFingerPrintId = params.browser.device_finger_print_id
    }
    
    // 同步更新 editableJson，并清除手动编辑标记
    isManuallyEditingJson.value = false
    editableJson.value = requestParamsJson.value
    showSuccess('表单已更新')
  } catch (error) {
    showError(`JSON格式错误: ${error.message}`)
  }
}

// 降级复制方案（用于不支持 Clipboard API 的环境，如局域网 IP）
const fallbackCopyToClipboard = (text) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.width = '2em'
  textArea.style.height = '2em'
  textArea.style.padding = '0'
  textArea.style.border = 'none'
  textArea.style.outline = 'none'
  textArea.style.boxShadow = 'none'
  textArea.style.background = 'transparent'
  textArea.style.opacity = '0'
  textArea.style.zIndex = '-1'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    const successful = document.execCommand('copy')
    if (!successful) {
      throw new Error('execCommand copy failed')
    }
  } catch (err) {
    document.body.removeChild(textArea)
    throw err
  }
  
  document.body.removeChild(textArea)
}

// 复制JSON到剪贴板
const copyJson = async () => {
  try {
    const textToCopy = editableJson.value || requestParamsJson.value
    // 优先使用 Clipboard API（需要 HTTPS 或 localhost）
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy)
      showSuccess('JSON已复制到剪贴板')
    } else {
      // 降级方案：使用传统方法（适用于局域网 IP 等非安全上下文）
      fallbackCopyToClipboard(textToCopy)
      showSuccess('JSON已复制到剪贴板')
    }
  } catch (err) {
    // 如果 Clipboard API 失败，使用降级方案
    try {
      const textToCopy = editableJson.value || requestParamsJson.value
      fallbackCopyToClipboard(textToCopy)
      showSuccess('JSON已复制到剪贴板')
    } catch (e) {
      showError('复制失败，请手动复制')
    }
  }
}

// 提取循环协议ID和Token（从交易查询结果中读取）
const extractRecurringAgreementId = () => {
  if (!queryResult.value) {
    showError('暂无查询结果数据，请先查询交易')
    return
  }

  try {
    // 从交易查询结果中读取数据
    let queryData = null
    if (typeof queryResult.value === 'string') {
      queryData = JSON.parse(queryResult.value)
    } else {
      queryData = queryResult.value
    }

    let extractedCount = 0
    const extractedItems = []

    // 提取 recurring_agreement_id
    let recurringAgreementId = null
    if (queryData.data && queryData.data.recurring_agreement_id) {
      recurringAgreementId = queryData.data.recurring_agreement_id
    } else if (queryData.recurring_agreement_id) {
      recurringAgreementId = queryData.recurring_agreement_id
    }

    if (recurringAgreementId) {
      transactionData.recurringAgreementId = String(recurringAgreementId)
      // 自动设置商户主动发起 (MIT) 为 true
      transactionData.mit = true
      extractedCount++
      extractedItems.push(`循环协议ID: ${recurringAgreementId}`)
    }

    // 提取 token
    let token = null
    if (queryData.data && queryData.data.token) {
      token = queryData.data.token
    } else if (queryData.token) {
      token = queryData.token
    } else if (queryData.payment && queryData.payment.token) {
      token = queryData.payment.token
    }

    if (token) {
      transactionData.token = String(token)
      extractedCount++
      extractedItems.push(`Token: ${token}`)
    }

    if (extractedCount > 0) {
      // 如果支付类型不是 RECURRING，提示用户
      if (transactionData.paymentType !== 'RECURRING' && recurringAgreementId) {
        showInfo(`已提取：${extractedItems.join('，')}。请将支付类型设置为 RECURRING 以使用循环协议ID`)
      } else {
        showSuccess(`已提取：${extractedItems.join('，')}`)
      }
    } else {
      showError('未找到循环协议ID或Token，请确保查询结果中包含这些字段')
    }
  } catch (error) {
    showError(`提取失败：${error.message}`)
  }
}

// 复制测试结果文本到剪贴板
const copyResultText = async (text) => {
  if (!text) {
    showInfo('内容为空，无法复制')
    return
  }
  try {
    const textToCopy = typeof text === 'string' ? text : formatJson(text)
    // 优先使用 Clipboard API（需要 HTTPS 或 localhost）
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy)
      showSuccess('已复制到剪贴板')
    } else {
      // 降级方案：使用传统方法（适用于局域网 IP 等非安全上下文）
      fallbackCopyToClipboard(textToCopy)
      showSuccess('已复制到剪贴板')
    }
  } catch (err) {
    // 如果 Clipboard API 失败，使用降级方案
    try {
      const textToCopy = typeof text === 'string' ? text : formatJson(text)
      fallbackCopyToClipboard(textToCopy)
      showSuccess('已复制到剪贴板')
    } catch (e) {
      showError('复制失败，请手动复制')
    }
  }
}

// 重置表单
const resetForm = () => {
  // 重置首次生成标记，允许重新生成所有信息
  isFirstTimeGenerate.value = true
  // 重置上次提交的交易ID
  lastSubmittedTransId.value = ''
  
  transactionData.transId = ''
  transactionData.amount = 0
  transactionData.currency = 'USD'
  transactionData.paymentType = 'PURCHASE'
  transactionData.recurringAgreementId = ''
  transactionData.mit = false
  transactionData.description = ''
  transactionData.captureMethod = 'AUTOMATIC'
  transactionData.expireTime = getDefaultExpireTime()
  transactionData.addressCollection = 'AUTO'
  transactionData.returnUrl = getDefaultReturnUrl()
  transactionData.cancelUrl = getDefaultCancelUrl()
  // 重置开关
  transactionData.enableCustomerInfo = true
  transactionData.enableBillInfo = true
  transactionData.enableShipInfo = true
  transactionData.customerName = ''
  transactionData.customerEmail = ''
  transactionData.customerPhone = ''
  transactionData.customerId = ''
  transactionData.customerOrderIp = ''
  transactionData.customerPayIp = ''
  transactionData.customer = ''
  transactionData.goods = ''
  
  // 账单信息
  transactionData.billFirstName = ''
  transactionData.billLastName = ''
  transactionData.billEmail = ''
  transactionData.billPhone = ''
  transactionData.billAddressLine1 = ''
  transactionData.billCountry = ''
  transactionData.billState = ''
  transactionData.billCity = ''
  transactionData.billPostalCode = ''
  transactionData.billAreaCode = ''
  transactionData.billDescriptor = ''
  transactionData.billAddressCollection = ''
  
  // 收货信息
  transactionData.shipFirstName = ''
  transactionData.shipLastName = ''
  transactionData.shipEmail = ''
  transactionData.shipPhone = ''
  transactionData.shipAddressLine1 = ''
  transactionData.shipCountry = ''
  transactionData.shipState = ''
  transactionData.shipCity = ''
  transactionData.shipPostalCode = ''
  transactionData.shipAreaCode = ''
  
  // 支付信息
  transactionData.enablePaymentInfo = true
  transactionData.paymentMethod = 'BANKCARD'
  transactionData.shopperReference = ''
  transactionData.cardNo = ''
  transactionData.expYear = ''
  transactionData.expMonth = ''
  transactionData.cvv = ''
  transactionData.holderName = ''
  transactionData.holderEmail = ''
  transactionData.storePaymentMethod = false
  transactionData.tokenUsage = ''
  transactionData.token = ''
  
  // 浏览器信息
  transactionData.enableBrowserInfo = true
  transactionData.userAgent = ''
  transactionData.colorDepth = ''
  transactionData.language = ''
  transactionData.javaEnabled = false
  transactionData.deviceType = 'PC'
  transactionData.terminalType = 'WEB'
  transactionData.deviceOs = 'WINDOWS'
  transactionData.timezoneOffset = ''
  transactionData.screenHeight = ''
  transactionData.screenWidth = ''
  transactionData.cookies = ''
  transactionData.deviceFingerPrintId = ''
  
  result.value = null
}


// 验证JSON数据
const validateJsonData = () => {
  let customerObj = null
  let goodsObj = null
  
  // 只有当客户信息开关启用时，才验证客户信息字段
  if (transactionData.enableCustomerInfo) {
  // 验证必填字段
    if (!transactionData.customerName || transactionData.customerName.trim() === '') {
      showError('客户姓名 (Name) 不能为空')
      return null
    }
    if (!transactionData.customerEmail || transactionData.customerEmail.trim() === '') {
      showError('客户邮箱 (Email) 不能为空')
      return null
    }
    if (!transactionData.customerPhone || transactionData.customerPhone.trim() === '') {
      showError('客户电话 (Phone) 不能为空')
      return null
    }
    if (!transactionData.customerId || transactionData.customerId.trim() === '') {
      showError('客户ID (ID) 不能为空')
      return null
    }
    if (!transactionData.customerOrderIp || transactionData.customerOrderIp.trim() === '') {
      showError('订单IP (Order IP) 不能为空')
      return null
    }
    if (!transactionData.customerPayIp || transactionData.customerPayIp.trim() === '') {
      showError('支付IP (Pay IP) 不能为空')
      return null
    }
    
    // 构建 customer 对象
    customerObj = {
      name: transactionData.customerName.trim(),
      email: transactionData.customerEmail.trim(),
      phone: transactionData.customerPhone.trim(),
      id: transactionData.customerId.trim(),
      order_ip: transactionData.customerOrderIp.trim(),
      pay_ip: transactionData.customerPayIp.trim()
    }
  }

  try {
    goodsObj = JSON.parse(transactionData.goods)
    // 验证 goods[0].link 不能为null
    if (!Array.isArray(goodsObj) || goodsObj.length === 0) {
      showError('商品信息 (Goods) 必须是一个非空数组')
      return null
    }
    for (let i = 0; i < goodsObj.length; i++) {
      if (goodsObj[i].link === null || goodsObj[i].link === undefined) {
        showError(`商品信息 (Goods) 中第 ${i + 1} 个商品的 link 字段不能为null`)
        return null
      }
    }
  } catch (e) {
    showError('商品信息 (Goods) 格式错误，请输入有效的JSON')
    return null
  }
  
  return { customerObj, goodsObj }
}

// 验证商户配置
const validateMerchantConfig = () => {
  if (!selectedMerchantId.value) {
    showError('请先选择商户配置')
    return false
  }
  
  if (!apiConfig.baseUrl || !apiConfig.merchantId || !apiConfig.privateKey || !apiConfig.appId) {
    showError('商户配置不完整，请检查商户配置或重新选择')
    return false
  }
  return true
}

// 提交交易
// 交易查询
const canQuery = computed(() => {
  return !!(apiConfig.baseUrl && apiConfig.appId && apiConfig.privateKey && (queryData.merchantId || apiConfig.merchantId))
})

const queryTransaction = async () => {
  // 验证商户配置
  if (!apiConfig.baseUrl || !apiConfig.appId || !apiConfig.privateKey) {
    showError('请先配置 API 地址、App ID 和私钥')
    return
  }

  // 验证查询参数
  if (!queryData.transId && !queryData.orderId) {
    showError('请至少填写交易ID或订单ID')
    return
  }
  
  queryLoading.value = true
  queryResult.value = null
  queryError.value = null
  
  try {
    const queryParams = {
      merchant_id: queryData.merchantId || apiConfig.merchantId,
      trans_id: queryData.transId || '',
      order_id: queryData.orderId || '',
      session_id: queryData.sessionId || '',
      timestamp: queryData.timestamp || Date.now()
    }
    
    const response = await queryTransactionApi(
      apiConfig.baseUrl,
      apiConfig.merchantId,
      apiConfig.appId,
      apiConfig.privateKey,
      queryParams
    )
    
    queryResult.value = response.data
    showSuccess('查询成功')
  } catch (error) {
    console.error('查询交易失败:', error)
    queryError.value = error.message || '查询失败'
    showError('查询失败: ' + (error.message || '未知错误'))
  } finally {
    queryLoading.value = false
  }
}

// 重置查询表单
const resetQueryForm = () => {
  queryData.merchantId = apiConfig.merchantId || ''
  queryData.transId = ''
  queryData.orderId = ''
  queryData.sessionId = ''
  queryData.timestamp = ''
  queryResult.value = null
  queryError.value = null
  queryResultCollapsed.value = false
  queryErrorCollapsed.value = false
}

// 查询结果文本
const queryResultText = computed(() => {
  if (!queryResult.value) return ''
  return JSON.stringify(queryResult.value, null, 2)
})

// 复制查询结果
const copyQueryResult = async () => {
  await copyToClipboard(queryResultText.value)
}

// 复制查询错误
const copyQueryError = async () => {
  await copyToClipboard(queryError.value)
}

const submitTransaction = async () => {
  // 验证商户配置
  if (!validateMerchantConfig()) return

  // 如果交易ID为空，生成新的
  if (!transactionData.transId) {
    generateTransId()
  } else if (transactionData.transId === lastSubmittedTransId.value) {
    // 如果交易ID与上次提交的相同，自动生成新的
    generateTransId()
    showInfo('交易ID已更新，避免重复提交')
  }

  if (!transactionData.amount || transactionData.amount <= 0) {
    showError('请输入有效的交易金额')
    return
  }

  // 验证JSON格式和必填字段
  const jsonData = validateJsonData()
  if (!jsonData) return
  
  const { customerObj, goodsObj } = jsonData

  loading.value = true

  try {
    // 构建请求数据（使用下划线命名，与 PayKKaCheckoutBase 保持一致）
    const requestData = {
      transId: transactionData.transId,
      amount: transactionData.amount,
      currency: transactionData.currency,
      paymentType: transactionData.paymentType || 'PURCHASE',
      description: transactionData.description || `订单 ${transactionData.transId}`,
      captureMethod: transactionData.captureMethod || 'AUTOMATIC',
      expireTime: transactionData.expireTime ? formatExpireTime(transactionData.expireTime) : '',
      addressCollection: transactionData.addressCollection || 'AUTO',
      returnUrl: transactionData.returnUrl || '',
      cancelUrl: transactionData.cancelUrl || ''
    }
    
    // 循环支付参数（仅当支付类型为 RECURRING 时添加）
    if (transactionData.paymentType === 'RECURRING') {
      if (transactionData.recurringAgreementId) {
        requestData.recurring_agreement_id = transactionData.recurringAgreementId
      }
      if (transactionData.mit !== undefined && transactionData.mit !== null) {
        requestData.mit = transactionData.mit
      }
    }

    // 只有当客户信息开关启用时，才添加客户信息字段和 customer 对象
    if (transactionData.enableCustomerInfo && customerObj) {
      requestData.customer = customerObj
    }

    // 添加商品信息
    if (goodsObj) {
      requestData.goods = goodsObj
    }

    // 构建地址信息对象的辅助函数
    const buildAddressObject = (prefix) => {
      const obj = {}
      const fieldMap = {
        FirstName: 'first_name',
        LastName: 'last_name',
        Email: 'email',
        Phone: 'phone_number',
        AddressLine1: 'address_line1',
        Country: 'country',
        State: 'state',
        City: 'city',
        PostalCode: 'postal_code',
        AreaCode: 'area_code'
      }
      
      for (const [key, snakeKey] of Object.entries(fieldMap)) {
        const value = transactionData[`${prefix}${key}`]
        if (value) obj[snakeKey] = value
      }
      
      // 特殊字段处理
      if (prefix === 'bill') {
        if (transactionData.billDescriptor) obj.descriptor = transactionData.billDescriptor
        if (transactionData.billAddressCollection) obj.billing_address_collection = transactionData.billAddressCollection
      }
      
      return Object.keys(obj).length > 0 ? obj : null
    }
    
    // 构建支付信息对象的辅助函数（与账单信息逻辑保持一致）
    const buildPaymentObject = () => {
      const obj = {}
      // payment_method 是必填字段，必须包含
      if (transactionData.paymentMethod) {
        obj.payment_method = transactionData.paymentMethod
      } else {
        obj.payment_method = 'BANKCARD' // 默认值
      }
      
      // 其他可选字段
      if (transactionData.shopperReference) obj.shopper_reference = transactionData.shopperReference
      if (transactionData.cardNo) obj.card_no = transactionData.cardNo
      if (transactionData.expYear) obj.exp_year = transactionData.expYear
      if (transactionData.expMonth) obj.exp_month = transactionData.expMonth
      if (transactionData.cvv) obj.cvv = transactionData.cvv
      if (transactionData.holderName) obj.holder_name = transactionData.holderName
      if (transactionData.holderEmail) obj.holder_email = transactionData.holderEmail
      
      // 存储卡信息字段（当 payment_type 为 RECURRING 时使用）
      if (transactionData.storePaymentMethod !== undefined && transactionData.storePaymentMethod !== null) {
        obj.store_payment_method = transactionData.storePaymentMethod === true || transactionData.storePaymentMethod === 'true'
      }
      
      // Token用途字段（当store_payment_method=true或者token支付时必传）
      if (transactionData.tokenUsage) {
        obj.token_usage = transactionData.tokenUsage
      }
      
      // 卡令牌字段（BANKCARD支付方式下[token, card_no, encrypted_card_no]三选一）
      if (transactionData.token) {
        obj.token = transactionData.token
      }
      
      // payment 对象必须存在（至少包含 payment_method），所以总是返回对象
      return obj
    }
    
    // 构建浏览器信息对象的辅助函数（与账单信息逻辑保持一致）
    const buildBrowserObject = () => {
      const obj = {}
      if (transactionData.userAgent) obj.user_agent = transactionData.userAgent
      if (transactionData.colorDepth) obj.color_depth = transactionData.colorDepth
      if (transactionData.language) obj.language = transactionData.language
      if (transactionData.javaEnabled !== undefined && transactionData.javaEnabled !== null) {
        obj.java_enabled = transactionData.javaEnabled
      }
      if (transactionData.deviceType) obj.device_type = transactionData.deviceType
      if (transactionData.terminalType) obj.terminal_type = transactionData.terminalType
      if (transactionData.deviceOs) obj.device_os = transactionData.deviceOs
      if (transactionData.timezoneOffset) obj.timezone_offset = transactionData.timezoneOffset
      if (transactionData.screenHeight) obj.screen_height = transactionData.screenHeight
      if (transactionData.screenWidth) obj.screen_width = transactionData.screenWidth
      if (transactionData.cookies) obj.cookies = transactionData.cookies
      if (transactionData.deviceFingerPrintId) obj.device_finger_print_id = transactionData.deviceFingerPrintId
      
      return Object.keys(obj).length > 0 ? obj : null
    }

    // 构建账单信息对象（bill）- 只有当开关启用时才构建
    if (transactionData.enableBillInfo) {
      const billObj = buildAddressObject('bill')
      if (billObj) {
        requestData.bill = billObj
      }
    }

    // 构建收货信息对象（shipping）- 只有当开关启用时才构建
    if (transactionData.enableShipInfo) {
      const shipObj = buildAddressObject('ship')
      if (shipObj) {
        requestData.shipping = shipObj
      }
    }

    // 构建支付信息对象（payment）- 只有当开关启用时才构建
    if (transactionData.enablePaymentInfo) {
      const paymentObj = buildPaymentObject()
      if (paymentObj) {
        requestData.payment = paymentObj
      }
    }

    // 构建浏览器信息对象（browser）- 只有当开关启用时才构建
    if (transactionData.enableBrowserInfo) {
      const browserObj = buildBrowserObject()
      if (browserObj) {
        requestData.browser = browserObj
      }
    }

    // 调用 API（使用 privateKey 和 appId，与 PayKKaCheckoutBase 保持一致）
    const response = await payKKaApi.submitTransaction(
      apiConfig.baseUrl,
      apiConfig.merchantId,
      apiConfig.privateKey, // 私钥用于签名
      requestData,
      apiConfig.appId // App ID 用于请求头
    )

    // 记录本次提交的交易ID
    lastSubmittedTransId.value = transactionData.transId

    result.value = {
      status: 'success',
      timestamp: new Date().toLocaleString('zh-CN'),
      requestUrl: `${apiConfig.baseUrl}/v3/payment/acq`,
      requestData: requestData,
      responseData: response.data || response // 只保存API返回的响应数据
    }
    
    // 提交成功后，自动填入查询参数
    if (queryData.enabled) {
      queryData.merchantId = apiConfig.merchantId || queryData.merchantId
      queryData.transId = transactionData.transId
      // 如果响应中有 order_id，也自动填入
      if (response.data && response.data.order_id) {
        queryData.orderId = response.data.order_id
      }
      queryData.timestamp = Date.now()
      showInfo('交易ID已自动填入查询参数')
    }
  } catch (error) {
    // 即使失败也记录交易ID，避免重复提交
    lastSubmittedTransId.value = transactionData.transId
    
    result.value = {
      status: 'error',
      timestamp: new Date().toLocaleString('zh-CN'),
      requestUrl: `${apiConfig.baseUrl}/v3/payment/acq`,
      requestData: transactionData,
      responseData: null,
      error: error.message
    }
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载商户配置（与 PayKKaCheckoutBase 保持一致）
// 加载Mock数据
const loadMockData = async () => {
  try {
    const response = await fetch('/mock-data/mock_data.json')
    if (!response.ok) {
      throw new Error('加载Mock数据失败')
    }
    const data = await response.json()
    mockData.value = data
    mockDataLoaded.value = true
    console.log('Mock数据加载成功:', data.personalInfo?.length || 0, '条个人信息')
  } catch (error) {
    console.error('加载Mock数据失败:', error)
    mockDataLoaded.value = false
    // 不显示错误提示，允许使用原来的随机生成方法
  }
}

onMounted(() => {
  loadMerchantConfigs()
  loadMockData()
  // 初始化查询表单的商户ID
  queryData.merchantId = apiConfig.merchantId || ''
})
</script>

<style scoped>
.paykka-test {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0.4rem 0.6rem;
  width: 100%;
  box-sizing: border-box;
}

.container {
  width: 100%;
  margin: 0;
  max-width: 100%;
}

.header-with-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.4rem;
  position: relative;
}

.back-button {
  position: absolute;
  left: 0;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateX(-2px);
}

.title {
  color: white;
  text-align: center;
  font-size: 1.4rem;
  margin-bottom: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  font-weight: 600;
  padding: 0;
  flex: 1;
}

.test-panel {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15), 0 0 0 1px rgba(102, 126, 234, 0.1);
  min-height: calc(100vh - 60px);
  max-height: calc(100vh - 60px);
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.form-section {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100vh - 100px);
  padding-right: 0.8rem;
  padding-left: 0.2rem;
}

.form-section::-webkit-scrollbar {
  width: 8px;
}

.form-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.form-section::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

.form-section::-webkit-scrollbar-thumb:hover {
  background: #5568d3;
}

.form-section h2,
.result-section h2 {
  color: #1a1a1a;
  margin-bottom: 1rem;
  margin-top: 0;
  font-size: 1.2rem;
  border-bottom: 3px solid #667eea;
  padding-bottom: 0.5rem;
  font-weight: 700;
  position: relative;
  letter-spacing: 0.3px;
}

.form-section h2::after,
.result-section h2::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

.form-section h3 {
  color: #2d3748;
  margin: 0.6rem 0 0.4rem 0;
  font-size: 0.95rem;
  font-weight: 700;
  padding-left: 0.6rem;
  border-left: 4px solid #667eea;
  line-height: 1.4;
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.05) 0%, transparent 100%);
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  border-radius: 0 4px 4px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.6rem 0 0.4rem 0;
  padding: 0.5rem 0.8rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 10px;
  border: 2px solid #e8ebf0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.section-header:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f4ff 100%);
  border-color: #667eea;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.section-header-title {
  display: flex;
  align-items: center;
  flex: 1;
  user-select: none;
  padding: 0.3rem 0.5rem;
  margin: -0.3rem -0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.section-header-title:hover {
  background-color: rgba(102, 126, 234, 0.12);
  transform: translateX(2px);
}

.section-header-title h3 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  pointer-events: none;
  line-height: 1.3;
}

.section-header-title svg {
  flex-shrink: 0;
  color: #667eea;
  transition: transform 0.3s ease, color 0.2s ease;
}

.section-header-title:hover svg {
  color: #5568d3;
}

.section-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.select-mock-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-random-section {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 3px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-random-section:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-1px);
}

.btn-random-section:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.toggle-switch input[type="checkbox"] {
  position: relative;
  width: 44px;
  height: 24px;
  appearance: none;
  background: #ccc;
  border-radius: 12px;
  outline: none;
  transition: background 0.3s;
  cursor: pointer;
}

.toggle-switch input[type="checkbox"]:checked {
  background: #667eea;
}

.toggle-switch input[type="checkbox"]::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input[type="checkbox"]:checked::before {
  transform: translateX(20px);
}

.toggle-label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
}

.disabled-section {
  opacity: 0.6;
  pointer-events: none;
  position: relative;
}

.disabled-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  z-index: 1;
}

.disabled-section .input-field:disabled,
.disabled-section .btn-small:disabled {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  cursor: not-allowed;
  opacity: 0.7;
  border-color: #d0d0d0;
}

.form-group {
  margin-bottom: 0.35rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.15rem;
  color: #2d3748;
  font-weight: 700;
  font-size: 0.82rem;
  line-height: 1.3;
  letter-spacing: 0.2px;
}

.input-field {
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: 2px solid #e0e4e8;
  border-radius: 6px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: #ffffff;
  color: #1a1a1a;
  line-height: 1.4;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15), 0 2px 8px rgba(102, 126, 234, 0.2);
  background: #ffffff;
  color: #000000;
  transform: translateY(-1px);
}

.input-field:hover:not(:disabled) {
  border-color: #b8c5d1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.input-field.readonly,
.textarea.readonly {
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
  cursor: not-allowed;
  color: #666;
  border-color: #d0d0d0;
}

.input-field.readonly:hover,
.textarea.readonly:hover {
  border-color: #c0c0c0;
}

.textarea {
  resize: vertical;
  font-family: inherit;
  min-height: 60px;
  line-height: 1.3;
}

.field-desc {
  display: block;
  margin-top: 0.15rem;
  color: #888;
  font-size: 0.7rem;
  line-height: 1.2;
  font-style: italic;
  padding-left: 0.3rem;
  border-left: 2px solid #e0e0e0;
}

.required {
  color: #e74c3c;
  font-weight: bold;
}

.private-key-container {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
}

.private-key-container .input-field,
.private-key-container .textarea {
  flex: 1;
}

.btn-toggle-key {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 0.35rem 0.6rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  white-space: nowrap;
  height: fit-content;
  margin-top: 0;
  flex-shrink: 0;
}

.btn-toggle-key:hover {
  background: #5568d3;
}

.private-key-container input[readonly] {
  cursor: pointer;
}

.input-with-button {
  display: flex;
  gap: 0.3rem;
  align-items: center;
}

.input-with-button .input-field {
  flex: 1;
}

.input-with-select {
  display: flex;
  gap: 0.3rem;
  align-items: center;
}

.input-with-select .input-field {
  flex: 1;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
}

.form-row-1 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.4rem;
}

.form-row-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.4rem;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
  margin-bottom: 0.3rem;
}

.form-row-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.4rem;
  margin-bottom: 0.3rem;
}

.form-row-4 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 0.4rem;
  margin-bottom: 0.3rem;
}

.divider {
  height: 2px;
  background: linear-gradient(to right, transparent, rgba(102, 126, 234, 0.2) 20%, rgba(102, 126, 234, 0.2) 80%, transparent);
  margin: 0.8rem 0;
  position: relative;
  border-radius: 1px;
}

.divider::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  background: #667eea;
  border-radius: 50%;
  opacity: 0.5;
}

.button-group {
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  border-top: 2px solid rgba(102, 126, 234, 0.15);
  flex-wrap: wrap;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, transparent 100%);
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  border-radius: 8px;
}

.button-group button {
  flex: 1;
  min-width: 120px;
}

.btn-primary,
.btn-secondary,
.btn-random,
.btn-info,
.btn-small {
  padding: 0.3rem 0.5rem;
  border: none;
  border-radius: 5px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
  line-height: 1.3;
  height: fit-content;
  box-sizing: border-box;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.2);
}

.btn-small {
  background: #667eea;
  color: white;
  white-space: nowrap;
  margin: 0;
}

.btn-small:hover {
  background: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex: 1;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  min-width: 100px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5568d3 0%, #6a3d8a 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  color: #333;
  flex: 1;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  min-width: 100px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #e8e8e8 0%, #d8d8d8 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-random {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  flex: 1;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  min-width: 100px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

.btn-random:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(245, 87, 108, 0.5);
}

.btn-info {
  background: #17a2b8;
  color: white;
  flex: 1;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  min-width: 100px;
}

.btn-info:hover:not(:disabled) {
  background: #138496;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
}

.btn-info:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.result-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  padding: 1.5rem;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  overflow-x: hidden;
  position: sticky;
  top: 0;
  border: 2px solid #e8ebf0;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.result-section::-webkit-scrollbar {
  width: 8px;
}

.result-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.result-section::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

.result-section::-webkit-scrollbar-thumb:hover {
  background: #5568d3;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 3rem 2rem;
  font-size: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
  border-radius: 8px;
  border: 2px dashed #e0e0e0;
}

.empty-state svg {
  display: block;
  margin: 0 auto 1rem;
}

.empty-state p {
  margin: 0.5rem 0;
  color: #666;
}

.empty-state-desc {
  font-size: 0.85rem;
  color: #999;
}

.result-content {
  background: white;
  border-radius: 10px;
  padding: 1.2rem;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.result-status-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.status-badge.success {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  border: 1px solid #b8dacc;
}

.status-badge.error {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
  border: 1px solid #f1b0b7;
}

.status-badge.pending {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  color: #856404;
  border: 1px solid #ffe082;
}

.timestamp {
  color: #666;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.result-section-item {
  margin-bottom: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 2px solid #e0e0e0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.result-section-item:hover {
  border-color: #d0d0d0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.result-section-item.error {
  background: #f8f9fa;
  border-color: #e0e0e0;
  border: 2px solid #e0e0e0;
}

.result-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  border-bottom: 1px solid #e5e7eb;
}

.result-section-header:hover {
  background: linear-gradient(135deg, #f0f2f5 0%, #e8ebef 100%);
}

.result-section-item.error .result-section-header {
  background: linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%);
}

.result-section-title {
  display: flex;
  align-items: center;
  flex: 1;
}

.result-section-title label {
  color: #1a1a1a;
  font-weight: 700;
  font-size: 1rem;
  margin: 0;
  cursor: pointer;
  letter-spacing: 0.3px;
}

.result-section-item.error .result-section-title label {
  color: #c53030;
}

.btn-copy-small {
  padding: 0.3rem 0.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s ease;
  opacity: 0.8;
}

.btn-copy-small:hover {
  background: #5568d3;
  opacity: 1;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

.result-section-content {
  padding: 0;
  background: #f8f9fa;
  border-top: none;
}

.code-block {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.8rem;
  line-height: 1.6;
  border: none;
  max-height: 400px;
  overflow-y: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  color: #333;
  margin: 0;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.code-block::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.code-block::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.code-block::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

.code-block::-webkit-scrollbar-thumb:hover {
  background: #5568d3;
}

.code-block.success {
  background: #f8f9fa;
  border: none;
  color: #333;
}

.code-block.error-text {
  background: #f8f9fa;
  border: none;
  color: #c53030;
}

.error-text {
  color: #c53030;
  font-weight: 500;
}

code {
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  font-size: 0.85rem;
  word-break: break-all;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  border: 1px solid #e0e0e0;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
}

.result-code {
  display: block;
  padding: 0.8rem 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  font-size: 0.85rem;
  word-break: break-all;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.json-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.json-header label {
  margin-bottom: 0;
}

.btn-toggle-collapse {
  padding: 0.4rem 0.8rem;
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s;
}

.btn-toggle-collapse:hover {
  background: #e0e0e0;
  border-color: #bbb;
}

.btn-toggle-collapse svg {
  width: 14px;
  height: 14px;
}

.json-display-container {
  position: relative;
  background: #ffffff;
  border: 2px solid #e8ebf0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.json-edit {
  width: 100%;
  min-height: 400px;
  max-height: 800px;
  padding: 1rem;
  margin: 0;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.8rem;
  line-height: 1.6;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  color: #333;
  resize: vertical;
  box-sizing: border-box;
}

.json-edit:focus {
  outline: 2px solid #667eea;
  outline-offset: -2px;
  background: #fff;
}

.json-edit.error-text {
  color: #c53030;
}

.json-edit[readonly] {
  cursor: default;
}

.json-actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f0f0f0;
  border-top: 1px solid #e0e0e0;
  justify-content: flex-end;
}

.btn-update,
.btn-copy,
.btn-reset,
.btn-extract {
  padding: 0.4rem 0.8rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s;
}

.btn-update:hover {
  background: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.btn-extract {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.btn-extract:hover {
  background: linear-gradient(135deg, #e084f0 0%, #e4475c 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
}

.btn-copy {
  background: #17a2b8;
}

.btn-copy:hover {
  background: #138496;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
}

.btn-reset {
  background: #6c757d;
}

.btn-reset:hover {
  background: #5a6268;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
}

.btn-update svg,
.btn-copy svg,
.btn-reset svg,
.btn-extract svg {
  width: 14px;
  height: 14px;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

.card-modal {
  max-width: 1000px;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  border-bottom: 2px solid #e0e0e0;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.modal-close {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #e0e0e0;
  color: #333;
}

.modal-body {
  padding: 0;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-filter-toolbar {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
  border-bottom: 2px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.8rem;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.85rem;
  min-width: 60px;
}

.filter-buttons {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.4rem 0.8rem;
  border: 2px solid #e0e0e0;
  background: white;
  color: #666;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.search-group {
  flex: 1;
}

.search-group label {
  min-width: 50px;
}

.card-search-input {
  flex: 1;
  padding: 0.4rem 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.card-search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.test-card-list {
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-group {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;
}

.card-group-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 0.8rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

.card-count {
  margin-left: auto;
  font-size: 0.85rem;
  opacity: 0.9;
}

.provider-label {
  font-size: 1rem;
  letter-spacing: 0.5px;
}

.category-label {
  font-size: 0.85rem;
  opacity: 0.9;
  padding: 0.2rem 0.6rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.card-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.6rem;
  padding: 0.8rem;
  background: white;
}

.card-item {
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.card-item:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.card-number {
  font-size: 0.9rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.4rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  letter-spacing: 0.5px;
  word-break: break-all;
}

.card-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.card-type {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.card-description {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: #f0f0f0;
  color: #666;
  border-radius: 4px;
  font-size: 0.75rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
}

.empty-state p {
  margin: 0.5rem 0;
}

.empty-state-desc {
  font-size: 0.85rem;
  color: #bbb;
}

.query-tip {
  padding: 0.8rem 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-left: 4px solid #667eea;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.query-tip p {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: #667eea;
  font-size: 0.85rem;
}

.query-tip ul {
  margin: 0;
  padding-left: 1.2rem;
  list-style: none;
}

.query-tip li {
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
  color: #666;
  line-height: 1.5;
  position: relative;
}

.query-tip li::before {
  content: "•";
  color: #667eea;
  font-weight: bold;
  position: absolute;
  left: -1rem;
}

.query-tip li strong {
  color: #333;
  font-weight: 600;
}

.btn-select-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  white-space: nowrap;
}

.btn-select-card:hover:not(:disabled) {
  background: linear-gradient(135deg, #5568d3 0%, #653a91 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.btn-select-card:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .paykka-test {
    padding: 0.4rem;
  }

  .test-panel {
    grid-template-columns: 1fr;
    gap: 0.6rem;
    padding: 0.6rem;
  }

  .form-section {
    max-height: none;
  }

  .result-section {
    max-height: none;
    position: static;
  }

  .form-row,
  .form-row-2,
  .form-row-3,
  .form-row-4 {
    grid-template-columns: 1fr;
  }

  .button-group {
    flex-direction: column;
  }
}

/* Select 下拉框样式优化，使其更明显 */
.input-field select,
select.input-field {
  border: 2px solid #d0d0d0;
  font-weight: 500;
  color: #1a1a1a;
}

.input-field select:focus,
select.input-field:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  color: #000000;
}

.input-field select:hover:not(:disabled),
select.input-field:hover:not(:disabled) {
  border-color: #999999;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
}
</style>
