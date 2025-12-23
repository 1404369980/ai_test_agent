<template>
  <div class="checkout-test">
    <div class="container">
      <h1 class="title">PayKKa 收银台页面测试</h1>
      
      <div class="test-panel">
        <div class="form-section">
          <h2>API 配置</h2>
          
          <div class="form-row-2">
            <div class="form-group">
              <label>API 地址</label>
              <input 
                v-model="apiConfig.baseUrl" 
                type="text" 
                placeholder="https://openapi-dev.paykka.com"
                class="input-field"
              />
            </div>

            <div class="form-group">
              <label>商户ID (Merchant ID)</label>
              <input 
                v-model="apiConfig.merchantId" 
                type="text" 
                placeholder="请输入商户ID"
                class="input-field"
              />
            </div>
          </div>

          <div class="form-group">
            <label>私钥 (Private Key) <span class="required">*</span></label>
            <textarea 
              v-model="apiConfig.privateKey" 
              placeholder="请输入RSA私钥（支持PEM格式或Base64格式）&#10;示例：MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzvEZPGgaoixnlUcvV+Mxoefm6z4DGOaSwfXlUwa6VytxivhWmTBs7Pkv/axjIc1qthlc8dWK9orOFjixqzYqBmuXLC9mokIDSIuDwdH1I3ORgPrrwwtloxwR2FfG0qOWNT8GtUZN3obzVVCeS8LriDOBeNB3k8kpe4uIjoevSo7L59XjOyocSs4Rt7kABLr04l9MGQXmYEL65Ww8940/A2YFr0PBFzBEBcVTl/sMRfVEM14oxQXTxShaWjNrBBSEQfVDPXjpvqZiO5gbBjiqyi2dRbs+imFRX74zAdOhiO/2V4Y7W5INqcwi75ytJC1O713Yc1h9ZVrxStNorhlsPAgMBAAECggEAHDhpia36cag1jq4DJTuFTLoqHczK2VTfqN5qmIY4lUhexho2Z//3HpwvbpEwOPjzud8n/1QnBsNvEH88NiDDqInbnr/jkvXtZBEZ5GdF7JTSPtJao8bUQAFPkALuCoGiWUe2jzIJx3Tbo1stQ4MMtMV0zRW9w97PEorpGtMnpdDN1asM9ZuCShDZVKx5NeASD8YNXUv8zXB6+rCNQiJkauj+EzLTKi1rmUiv6r0K3mfrn7tyc6oh1DDhI1R8ijyltOQN781fXrza6hzrgsgKYlL1bekKvcKsbacOeMBa8ezEXof3esrDeYXsNt4vghsxsfqQ8bcRfWA6zKGRE7fQkQKBgQD9K89eM0NBZpq4stADrmv7fE7wD0JQstyxr+JzrsJYrK3KftV/SVK09jy9rRnWZM3iOR58SLz/xR/9iJcUSfTV/RDfDrR+dZQPQtfUf5EN9wGNYopUkui1VxQz34/lKFsrJO7akTH/DqGZWxlg1o3ijGLczS9CW6lDx/26kX4qQwKBgQC1vmdR3wl9KXTPxeuV+g/U/s6a7s2MrCZbeYkg11W+X4SBoZPwCnD0x8cLqwNV+WQZmhPbOlps9F6CPFfMxChTy3saIk20T8KZl+Op1NU6VDWeZvHMpJLbWbxYb3pKkhrIG/RlSfhrRiOXKgLsBqYl+Sn9dw8fwPsjIylsMhE9RQKBgQDIa+hMILT7j2ipExXN9EUT4AL11H6hOBeyqxTQk+bTIFCs39/QVpGdJNpNJj4wFblPf/x8U3Eb4khDA+DmdO3YgfDbRN7qxdYihr4qQZrpvUODVCFCdtK2zGr37eISffI+o4xbh1pXGpQfvZjHqtLEKHMTbXQeSkYjnK1nB0sj1QKBgBORPG6EJPFk1T7JgGPVWH8GMBhePaM3pamTnD/87y5f+lQ6oULm3OJ93+BRuTo4b56SCDFCRxoT9VjwRkO1muHqtoZJyzPuonUG9WwDjjGJf3xeeQofbfBP6QdceT4uHNQOrnF5VVW3Z32O+GGRFbJg8TRo7SfuDxvpXTxY56JBAoGAHf5a+WNcd/PFJ5YS9MCQa1lt6s/ioOKNxRNOvmJ+JLh5WmGy2ke0FUHdLGWZG/u83zaavrFtayrycnudOGG7ZVzihdEPHmbkG9CzwB94jj7rqf43OhwwUhL8Z0QGmOUGtlFJJZHYTs+mJZQc2je8jI8A0sw//q/wMumAQ2fqhlc="
              class="input-field textarea"
              rows="6"
            ></textarea>
            <small class="field-desc">RSA私钥，支持PEM格式（包含BEGIN/END）或Base64格式（纯字符串），系统会自动识别并转换</small>
          </div>

          <div class="divider"></div>

          <h3>请求头参数 (Headers)</h3>

          <div class="form-row-3">
            <div class="form-group">
              <label>x-paykka-appid <span class="required">*</span></label>
              <input 
                v-model="apiConfig.appId" 
                type="text" 
                placeholder="调用方唯一标识"
                class="input-field"
              />
              <small class="field-desc">Unique identifier of the caller [1,64]</small>
            </div>

            <div class="form-group">
              <label>x-paykka-timestamp <span class="required">*</span></label>
              <input 
                :value="apiConfig.timestamp || '(生成签名时自动生成)'" 
                type="text" 
                readonly
                class="input-field readonly"
              />
              <small class="field-desc">Timestamp in milliseconds [1,11] - 生成签名时自动生成</small>
            </div>

            <div class="form-group">
              <label>x-paykka-nonce <span class="required">*</span></label>
              <input 
                :value="apiConfig.nonce || '(生成签名时自动生成)'" 
                type="text" 
                readonly
                class="input-field readonly"
              />
              <small class="field-desc">Random number for replay prevention [10,100] - 生成签名时自动生成</small>
            </div>
          </div>

          <div class="form-group">
            <label>x-paykka-sign-alg</label>
            <input 
              v-model="apiConfig.signAlg" 
              type="text" 
              value="SHA256_WITH_RSA"
              readonly
              class="input-field readonly"
            />
            <small class="field-desc">Signature type, fixed value: SHA256_WITH_RSA</small>
          </div>

          <div class="form-group">
            <label>x-paykka-sign <span class="required">*</span></label>
            <div class="input-with-button">
              <input 
                v-model="apiConfig.sign" 
                type="text" 
                placeholder="自动生成（基于请求方法、URL、时间戳、随机数、消息体）"
                class="input-field readonly"
                readonly
              />
              <button @click="generateHeaderSign" class="btn-small">生成签名</button>
            </div>
            <small class="field-desc">Request signature [1,500]，签名方法：HTTP方法\nURL\n时间戳\n随机数\n消息体</small>
          </div>

          <div class="divider"></div>

          <h3>收银台参数</h3>

          <div class="form-row-2">
            <div class="form-group">
              <label>订单号 (Order No) <span class="required">*</span></label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.orderNo" 
                  type="text" 
                  placeholder="自动生成"
                  class="input-field"
                />
                <button @click="generateOrderNo" class="btn-small">随机生成</button>
              </div>
            </div>

            <div class="form-group">
              <label>交易ID (Trans ID) <span class="required">*</span></label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.transId" 
                  type="text" 
                  placeholder="自动生成"
                  class="input-field"
                />
                <button @click="generateTransId" class="btn-small">随机生成</button>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>交易金额 (Amount)</label>
              <input 
                v-model.number="checkoutData.amount" 
                type="number" 
                step="0.01"
                placeholder="0.00"
                class="input-field"
              />
              <button @click="generateRandomAmount" class="btn-small">随机金额</button>
            </div>

            <div class="form-group">
              <label>币种 (Currency)</label>
              <select v-model="checkoutData.currency" class="input-field">
                <option value="USD">USD - 美元</option>
                <option value="EUR">EUR - 欧元</option>
                <option value="GBP">GBP - 英镑</option>
                <option value="CNY">CNY - 人民币</option>
                <option value="JPY">JPY - 日元</option>
                <option value="HKD">HKD - 港币</option>
                <option value="SGD">SGD - 新加坡元</option>
              </select>
              <button @click="generateRandomCurrency" class="btn-small">随机币种</button>
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>支付类型 (Payment Type) <span class="required">*</span></label>
              <select v-model="checkoutData.paymentType" class="input-field">
                <option value="PURCHASE">PURCHASE - 消费</option>
                <option value="PREPARE_AUTHORIZE">PREPARE_AUTHORIZE - 预授权</option>
                <option value="RECURRING">RECURRING - 循环支付</option>
                <option value="REFUND">REFUND - 退款</option>
              </select>
              <small class="field-desc">支付类型，默认值：PURCHASE</small>
            </div>

            <div class="form-group">
              <label>会话模式 (Session Mode)</label>
              <select v-model="checkoutData.sessionMode" class="input-field">
                <option value="HOSTED">HOSTED - 托管模式</option>
                <option value="COMPONENT">COMPONENT - 组件模式</option>
                <option value="DROP_IN">DROP_IN - 嵌入模式</option>
              </select>
              <small class="field-desc">默认值：HOSTED</small>
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>支付方式 (Payment Methods)</label>
              <select v-model="checkoutData.paymentMethods" class="input-field">
                <option value="">请选择</option>
                <option value="card">信用卡 (Card)</option>
                <option value="alipay">支付宝 (Alipay)</option>
                <option value="wechat">微信支付 (WeChat)</option>
                <option value="bank_transfer">银行转账 (Bank Transfer)</option>
              </select>
              <button @click="generateRandomPaymentMethods" class="btn-small">随机选择</button>
            </div>

            <div class="form-group">
              <label>商品描述 (Description)</label>
              <textarea 
                v-model="checkoutData.description" 
                placeholder="请输入商品描述"
                class="input-field textarea"
                rows="2"
              ></textarea>
              <button @click="generateRandomDescription" class="btn-small">随机描述</button>
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label>回调地址 (Callback URL)</label>
              <input 
                v-model="checkoutData.callbackUrl" 
                type="text" 
                placeholder="https://your-domain.com/callback"
                class="input-field"
              />
            </div>

            <div class="form-group">
              <label>成功返回地址 (Return URL)</label>
              <input 
                v-model="checkoutData.returnUrl" 
                type="text" 
                placeholder="https://your-domain.com/success"
                class="input-field"
              />
            </div>

            <div class="form-group">
              <label>失败返回地址 (Cancel URL)</label>
              <input 
                v-model="checkoutData.cancelUrl" 
                type="text" 
                placeholder="https://your-domain.com/cancel"
                class="input-field"
              />
            </div>
          </div>

          <div class="divider"></div>

          <div class="section-header">
            <h3>客户信息 (Customer Info) <span class="required">*</span></h3>
            <label class="toggle-switch">
              <input type="checkbox" v-model="checkoutData.enableCustomerInfo" />
              <span class="toggle-slider"></span>
              <span class="toggle-label">{{ checkoutData.enableCustomerInfo ? '启用' : '禁用' }}</span>
            </label>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableCustomerInfo }">
            <div class="form-group">
              <label>客户邮箱 (Email)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.customerEmail" 
                  type="email" 
                  placeholder="customer@example.com"
                  class="input-field"
                  :disabled="!checkoutData.enableCustomerInfo"
                />
                <button @click="generateRandomEmail" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>客户电话 (Phone)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.customerPhone" 
                  type="text" 
                  placeholder="13800138000"
                  class="input-field"
                  :disabled="!checkoutData.enableCustomerInfo"
                />
                <button @click="generateRandomPhone" class="btn-small" :disabled="!checkoutData.enableCustomerInfo">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>客户姓名 (Name)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.customerName" 
                  type="text" 
                  placeholder="客户姓名"
                  class="input-field"
                  :disabled="!checkoutData.enableCustomerInfo"
                />
                <button @click="generateRandomName" class="btn-small" :disabled="!checkoutData.enableCustomerInfo">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>客户ID (Customer ID)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.customerId" 
                  type="text" 
                  placeholder="客户ID"
                  class="input-field"
                  :disabled="!checkoutData.enableCustomerInfo"
                />
                <button @click="generateRandomCustomerId" class="btn-small" :disabled="!checkoutData.enableCustomerInfo">随机</button>
              </div>
            </div>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableCustomerInfo }">
            <div class="form-group">
              <label>国家代码 (Country)</label>
              <div class="input-with-button">
                <select v-model="checkoutData.country" class="input-field" :disabled="!checkoutData.enableCustomerInfo">
                  <option value="">请选择</option>
                  <option value="CN">CN - 中国</option>
                  <option value="US">US - 美国</option>
                  <option value="GB">GB - 英国</option>
                  <option value="JP">JP - 日本</option>
                  <option value="SG">SG - 新加坡</option>
                  <option value="HK">HK - 香港</option>
                </select>
                <button @click="generateRandomCountry" class="btn-small" :disabled="!checkoutData.enableCustomerInfo">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>语言 (Language)</label>
              <div class="input-with-button">
                <select v-model="checkoutData.language" class="input-field" :disabled="!checkoutData.enableCustomerInfo">
                  <option value="">请选择</option>
                  <option value="zh-CN">zh-CN - 简体中文</option>
                  <option value="zh-TW">zh-TW - 繁体中文</option>
                  <option value="en-US">en-US - 英语</option>
                  <option value="ja-JP">ja-JP - 日语</option>
                </select>
                <button @click="generateRandomLanguage" class="btn-small" :disabled="!checkoutData.enableCustomerInfo">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>订单IP (Order IP) <span class="required">*</span></label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.orderIp" 
                  type="text" 
                  placeholder="192.168.1.1"
                  class="input-field"
                  :disabled="!checkoutData.enableCustomerInfo"
                />
                <button @click="generateRandomOrderIp" class="btn-small" :disabled="!checkoutData.enableCustomerInfo">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>客户地址 (Address)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.customerAddress" 
                  type="text" 
                  placeholder="客户地址"
                  class="input-field"
                  :disabled="!checkoutData.enableCustomerInfo"
                />
                <button @click="generateRandomAddress" class="btn-small" :disabled="!checkoutData.enableCustomerInfo">随机</button>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section-header">
            <h3>账单信息 (Billing Info)</h3>
            <label class="toggle-switch">
              <input type="checkbox" v-model="checkoutData.enableBillInfo" />
              <span class="toggle-slider"></span>
              <span class="toggle-label">{{ checkoutData.enableBillInfo ? '启用' : '禁用' }}</span>
            </label>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableBillInfo }">
            <div class="form-group">
              <label>账单名 (First Name)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.billFirstName" 
                  type="text" 
                  placeholder="First Name"
                  class="input-field"
                  :disabled="!checkoutData.enableBillInfo"
                />
                <button @click="generateRandomBillFirstName" class="btn-small" :disabled="!checkoutData.enableBillInfo">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>账单姓 (Last Name)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.billLastName" 
                  type="text" 
                  placeholder="Last Name"
                  class="input-field"
                  :disabled="!checkoutData.enableBillInfo"
                />
                <button @click="generateRandomBillLastName" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>账单邮箱 (Email)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.billEmail" 
                  type="email" 
                  placeholder="bill@example.com"
                  class="input-field"
                  :disabled="!checkoutData.enableBillInfo"
                />
                <button @click="generateRandomBillEmail" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>账单电话 (Phone)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.billPhone" 
                  type="text" 
                  placeholder="+1234567890"
                  class="input-field"
                  :disabled="!checkoutData.enableBillInfo"
                />
                <button @click="generateRandomBillPhone" class="btn-small">随机</button>
              </div>
            </div>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableBillInfo }">
            <div class="form-group">
              <label>账单地址 (Address Line1)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.billAddressLine1" 
                  type="text" 
                  placeholder="Address Line 1"
                  class="input-field"
                  :disabled="!checkoutData.enableBillInfo"
                />
                <button @click="generateRandomBillAddress" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>账单国家 (Country)</label>
              <div class="input-with-button">
                <select v-model="checkoutData.billCountry" class="input-field" :disabled="!checkoutData.enableBillInfo">
                  <option value="">请选择</option>
                  <option value="CN">CN - 中国</option>
                  <option value="US">US - 美国</option>
                  <option value="GB">GB - 英国</option>
                  <option value="FR">FR - 法国</option>
                  <option value="JP">JP - 日本</option>
                </select>
                <button @click="generateRandomBillCountry" class="btn-small" :disabled="!checkoutData.enableBillInfo">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>账单州/省 (State)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.billState" 
                  type="text" 
                  placeholder="State/Province"
                  class="input-field"
                  :disabled="!checkoutData.enableBillInfo"
                />
                <button @click="generateRandomBillState" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>账单城市 (City)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.billCity" 
                  type="text" 
                  placeholder="City"
                  class="input-field"
                  :disabled="!checkoutData.enableBillInfo"
                />
                <button @click="generateRandomBillCity" class="btn-small">随机</button>
              </div>
            </div>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableBillInfo }">
            <div class="form-group">
              <label>账单邮编 (Postal Code)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.billPostalCode" 
                  type="text" 
                  placeholder="Postal Code"
                  class="input-field"
                  :disabled="!checkoutData.enableBillInfo"
                />
                <button @click="generateRandomBillPostalCode" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>区号 (Area Code)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.billAreaCode" 
                  type="text" 
                  placeholder="Area Code"
                  class="input-field"
                  :disabled="!checkoutData.enableBillInfo"
                />
                <button @click="generateRandomBillAreaCode" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>描述符 (Descriptor)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.billDescriptor" 
                  type="text" 
                  placeholder="Descriptor"
                  class="input-field"
                  :disabled="!checkoutData.enableBillInfo"
                />
                <button @click="generateRandomBillDescriptor" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>地址收集 (Address Collection)</label>
              <div class="input-with-button">
                <select v-model="checkoutData.billAddressCollection" class="input-field" :disabled="!checkoutData.enableBillInfo">
                  <option value="">请选择</option>
                  <option value="REQUIRED">REQUIRED - 必填</option>
                  <option value="AUTO">AUTO - 自动</option>
                </select>
                <button @click="generateRandomBillAddressCollection" class="btn-small" :disabled="!checkoutData.enableBillInfo">随机</button>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section-header">
            <h3>收货信息 (Shipping Info)</h3>
            <label class="toggle-switch">
              <input type="checkbox" v-model="checkoutData.enableShipInfo" />
              <span class="toggle-slider"></span>
              <span class="toggle-label">{{ checkoutData.enableShipInfo ? '启用' : '禁用' }}</span>
            </label>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableShipInfo }">
            <div class="form-group">
              <label>收货名 (First Name)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.shipFirstName" 
                  type="text" 
                  placeholder="First Name"
                  class="input-field"
                  :disabled="!checkoutData.enableShipInfo"
                />
                <button @click="generateRandomShipFirstName" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>收货姓 (Last Name)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.shipLastName" 
                  type="text" 
                  placeholder="Last Name"
                  class="input-field"
                  :disabled="!checkoutData.enableShipInfo"
                />
                <button @click="generateRandomShipLastName" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>收货邮箱 (Email)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.shipEmail" 
                  type="email" 
                  placeholder="ship@example.com"
                  class="input-field"
                  :disabled="!checkoutData.enableShipInfo"
                />
                <button @click="generateRandomShipEmail" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>收货电话 (Phone)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.shipPhone" 
                  type="text" 
                  placeholder="+1234567890"
                  class="input-field"
                  :disabled="!checkoutData.enableShipInfo"
                />
                <button @click="generateRandomShipPhone" class="btn-small">随机</button>
              </div>
            </div>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableShipInfo }">
            <div class="form-group">
              <label>收货地址 (Address Line1)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.shipAddressLine1" 
                  type="text" 
                  placeholder="Address Line 1"
                  class="input-field"
                  :disabled="!checkoutData.enableShipInfo"
                />
                <button @click="generateRandomShipAddress" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>收货国家 (Country)</label>
              <div class="input-with-button">
                <select v-model="checkoutData.shipCountry" class="input-field" :disabled="!checkoutData.enableShipInfo">
                  <option value="">请选择</option>
                  <option value="CN">CN - 中国</option>
                  <option value="US">US - 美国</option>
                  <option value="GB">GB - 英国</option>
                  <option value="FR">FR - 法国</option>
                  <option value="JP">JP - 日本</option>
                </select>
                <button @click="generateRandomShipCountry" class="btn-small" :disabled="!checkoutData.enableShipInfo">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>收货州/省 (State)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.shipState" 
                  type="text" 
                  placeholder="State/Province"
                  class="input-field"
                  :disabled="!checkoutData.enableShipInfo"
                />
                <button @click="generateRandomShipState" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>收货城市 (City)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.shipCity" 
                  type="text" 
                  placeholder="City"
                  class="input-field"
                  :disabled="!checkoutData.enableShipInfo"
                />
                <button @click="generateRandomShipCity" class="btn-small">随机</button>
              </div>
            </div>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableShipInfo }">
            <div class="form-group">
              <label>收货邮编 (Postal Code)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.shipPostalCode" 
                  type="text" 
                  placeholder="Postal Code"
                  class="input-field"
                  :disabled="!checkoutData.enableShipInfo"
                />
                <button @click="generateRandomShipPostalCode" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>区号 (Area Code)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.shipAreaCode" 
                  type="text" 
                  placeholder="Area Code"
                  class="input-field"
                  :disabled="!checkoutData.enableShipInfo"
                />
                <button @click="generateRandomShipAreaCode" class="btn-small">随机</button>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <h3>高级参数</h3>

          <div class="form-row-3">
            <div class="form-group">
              <label>时间戳 (Timestamp)</label>
              <div class="input-with-button">
                <input 
                  v-model.number="checkoutData.timestamp" 
                  type="number" 
                  placeholder="自动生成"
                  class="input-field"
                />
                <button @click="generateTimestamp" class="btn-small">生成</button>
              </div>
            </div>
            <div class="form-group">
              <label>随机数 (Nonce)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.nonce" 
                  type="text" 
                  placeholder="自动生成"
                  class="input-field"
                />
                <button @click="generateNonce" class="btn-small">生成</button>
              </div>
            </div>
            <div class="form-group">
              <label>超时时间 (Timeout 秒)</label>
              <div class="input-with-button">
                <input 
                  v-model.number="checkoutData.timeout" 
                  type="number" 
                  placeholder="1800"
                  class="input-field"
                />
                <button @click="generateRandomTimeout" class="btn-small">随机</button>
              </div>
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label>商品ID (Product ID)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.productId" 
                  type="text" 
                  placeholder="商品ID"
                  class="input-field"
                />
                <button @click="generateRandomProductId" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>商品类别 (Product Category)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.productCategory" 
                  type="text" 
                  placeholder="商品类别"
                  class="input-field"
                />
                <button @click="generateRandomCategory" class="btn-small">随机</button>
              </div>
            </div>
            <div class="form-group">
              <label>备注 (Remark)</label>
              <div class="input-with-button">
                <input 
                  v-model="checkoutData.remark" 
                  type="text" 
                  placeholder="备注信息"
                  class="input-field"
                />
                <button @click="generateRandomRemark" class="btn-small">随机</button>
              </div>
            </div>
          </div>

          <div class="button-group">
            <button @click="generateAllRandom" class="btn-random">一键随机生成所有参数</button>
            <button @click="createCheckout" :disabled="loading" class="btn-primary">
              {{ loading ? '创建中...' : '创建收银台' }}
            </button>
            <button @click="resetForm" class="btn-secondary">重置表单</button>
          </div>
        </div>

        <div class="result-section">
          <h2>测试结果</h2>
          
          <div v-if="!result" class="empty-state">
            <p>暂无测试结果，请创建收银台进行测试</p>
          </div>

          <div v-else class="result-content">
            <div class="result-header">
              <span class="status-badge" :class="result.status">
                {{ result.status === 'success' ? '成功' : result.status === 'error' ? '失败' : '进行中' }}
              </span>
              <span class="timestamp">{{ result.timestamp }}</span>
            </div>

            <div class="result-body">
              <div class="result-item">
                <label>请求URL:</label>
                <code>{{ result.requestUrl }}</code>
              </div>

              <div v-if="result.requestHeaders" class="result-item">
                <label>请求头 (Headers):</label>
                <pre class="code-block">{{ formatJson(result.requestHeaders) }}</pre>
              </div>

              <div class="result-item">
                <label>请求参数 (签名前):</label>
                <pre class="code-block">{{ formatJson(result.requestDataBeforeSign) }}</pre>
              </div>


              <div class="result-item">
                <label>最终请求参数 (含签名):</label>
                <pre class="code-block">{{ formatJson(result.requestData) }}</pre>
              </div>

              <div class="result-item">
                <label>响应数据:</label>
                <pre class="code-block">{{ formatJson(result.responseData) }}</pre>
              </div>

              <div v-if="result.sessionUrl" class="result-item success">
                <label>收银台URL (Session URL):</label>
                <a :href="result.sessionUrl" target="_blank" class="checkout-link">
                  {{ result.sessionUrl }}
                </a>
                <small class="field-desc">点击链接在新页面打开收银台</small>
              </div>

              <div v-if="result.checkoutUrl && !result.sessionUrl" class="result-item success">
                <label>收银台URL:</label>
                <a :href="result.checkoutUrl" target="_blank" class="checkout-link">
                  {{ result.checkoutUrl }}
                </a>
              </div>

              <div v-if="result.error" class="result-item error">
                <label>错误信息:</label>
                <pre class="code-block error-text">{{ result.error }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { payKKaCheckoutApi } from '../services/paykkaCheckoutApi'
import { generateRandomIP } from '../services/utils'

const loading = ref(false)

const apiConfig = reactive({
  baseUrl: 'https://openapi-dev.paykka.com',
  merchantId: '18543041582480',
  privateKey: 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzvEZPGgaoixnlUcvV+Mxoefm6z4DGOaSwfXlUwa6VytxivhWmTBs7Pkv/axjIc1qthlc8dWK9orOFjixqzYqBmuXLC9mokIDSIuDwdH1I3ORgPrrwwtloxwR2FfG0qOWNT8GtUZN3obzVVCeS8LriDOBeNB3k8kpe4uIjoevSo7L59XjOyocSs4Rt7kABLr04l9MGQXmYEL65Ww8940/A2YFr0PBFzBEBcVTl/sMRfVEM14oxQXTxShaWjNrBBSEQfVDPXjpvqZiO5gbBjiqyi2dRbs+imFRX74zAdOhiO/2V4Y7W5INqcwi75ytJC1O713Yc1h9ZVrxStNorhlsPAgMBAAECggEAHDhpia36cag1jq4DJTuFTLoqHczK2VTfqN5qmIY4lUhexho2Z//3HpwvbpEwOPjzud8n/1QnBsNvEH88NiDDqInbnr/jkvXtZBEZ5GdF7JTSPtJao8bUQAFPkALuCoGiWUe2jzIJx3Tbo1stQ4MMtMV0zRW9w97PEorpGtMnpdDN1asM9ZuCShDZVKx5NeASD8YNXUv8zXB6+rCNQiJkauj+EzLTKi1rmUiv6r0K3mfrn7tyc6oh1DDhI1R8ijyltOQN781fXrza6hzrgsgKYlL1bekKvcKsbacOeMBa8ezEXof3esrDeYXsNt4vghsxsfqQ8bcRfWA6zKGRE7fQkQKBgQD9K89eM0NBZpq4stADrmv7fE7wD0JQstyxr+JzrsJYrK3KftV/SVK09jy9rRnWZM3iOR58SLz/xR/9iJcUSfTV/RDfDrR+dZQPQtfUf5EN9wGNYopUkui1VxQz34/lKFsrJO7akTH/DqGZWxlg1o3ijGLczS9CW6lDx/26kX4qQwKBgQC1vmdR3wl9KXTPxeuV+g/U/s6a7s2MrCZbeYkg11W+X4SBoZPwCnD0x8cLqwNV+WQZmhPbOlps9F6CPFfMxChTy3saIk20T8KZl+Op1NU6VDWeZvHMpJLbWbxYb3pKkhrIG/RlSfhrRiOXKgLsBqYl+Sn9dw8fwPsjIylsMhE9RQKBgQDIa+hMILT7j2ipExXN9EUT4AL11H6hOBeyqxTQk+bTIFCs39/QVpGdJNpNJj4wFblPf/x8U3Eb4khDA+DmdO3YgfDbRN7qxdYihr4qQZrpvUODVCFCdtK2zGr37eISffI+o4xbh1pXGpQfvZjHqtLEKHMTbXQeSkYjnK1nB0sj1QKBgBORPG6EJPFk1T7JgGPVWH8GMBhePaM3pamTnD/87y5f+lQ6oULm3OJ93+BRuTo4b56SCDFCRxoT9VjwRkO1muHqtoZJyzPuonUG9WwDjjGJf3xeeQofbfBP6QdceT4uHNQOrnF5VVW3Z32O+GGRFbJg8TRo7SfuDxvpXTxY56JBAoGAHf5a+WNcd/PFJ5YS9MCQa1lt6s/ioOKNxRNOvmJ+JLh5WmGy2ke0FUHdLGWZG/u83zaavrFtayrycnudOGG7ZVzihdEPHmbkG9CzwB94jj7rqf43OhwwUhL8Z0QGmOUGtlFJJZHYTs+mJZQc2je8jI8A0sw//q/wMumAQ2fqhlc=',
  appId: '208383410695312',
  timestamp: null, // 生成签名时自动生成
  nonce: '', // 生成签名时自动生成
  signAlg: 'SHA256_WITH_RSA',
  sign: ''
})

const checkoutData = reactive({
  orderNo: '',
  transId: '',
  amount: 0,
  currency: 'USD',
  paymentType: 'PURCHASE',
  sessionMode: 'HOSTED',
  paymentMethods: '',
  description: '',
  callbackUrl: '',
  returnUrl: '',
  cancelUrl: '',
  // 开关控制
  enableCustomerInfo: true,
  enableBillInfo: false,
  enableShipInfo: false,
  customerEmail: '',
  customerPhone: '',
  customerName: '',
  customerId: '',
  customer: '',
  goods: '',
  country: '',
  language: '',
  orderIp: '',
  customerAddress: '',
  timestamp: Date.now(),
  nonce: '',
  timeout: 1800,
  productId: '',
  productCategory: '',
  remark: '',
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
  shipAreaCode: ''
})

const result = ref(null)

// 随机生成订单号
const generateOrderNo = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 100000)
  checkoutData.orderNo = `PK${timestamp}${random}`
}

// 随机生成交易ID
const generateTransId = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 100000)
  checkoutData.transId = `TXN${timestamp}${random}`
}

// 支付类型使用下拉框选择，不需要随机生成函数
// generateRandomIP 已从 '../services/utils' 导入，无需重复定义

// 随机生成客户信息
const generateCustomer = () => {
  const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson']
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com']
  const name = names[Math.floor(Math.random() * names.length)]
  const email = `${name.toLowerCase().replace(' ', '.')}@${domains[Math.floor(Math.random() * domains.length)]}`
  const phone = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
  
  // 如果没有orderIp，生成一个
  if (!checkoutData.orderIp) {
    checkoutData.orderIp = generateRandomIP()
  }
  
  checkoutData.customer = JSON.stringify({
    name: name,
    email: email,
    phone: phone,
    id: `CUST${Date.now()}`,
    order_ip: checkoutData.orderIp || generateRandomIP() // 必填字段，使用orderIp字段或随机生成
  }, null, 2)
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
  
  checkoutData.goods = JSON.stringify(selectedProducts, null, 2)
}

// 随机生成金额
const generateRandomAmount = () => {
  const min = 1
  const max = 10000
  const decimals = 2
  checkoutData.amount = parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

// 随机生成币种
const generateRandomCurrency = () => {
  const currencies = ['USD', 'EUR', 'GBP', 'CNY', 'JPY', 'HKD', 'SGD']
  checkoutData.currency = currencies[Math.floor(Math.random() * currencies.length)]
}

// 会话模式使用下拉框选择，默认值为 HOSTED，不需要随机生成函数

// 随机生成支付方式
const generateRandomPaymentMethods = () => {
  const allMethods = ['card', 'alipay', 'wechat', 'bank_transfer']
  checkoutData.paymentMethods = allMethods[Math.floor(Math.random() * allMethods.length)]
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
  checkoutData.description = descriptions[Math.floor(Math.random() * descriptions.length)]
}

// 随机生成邮箱
const generateRandomEmail = () => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'qq.com', '163.com']
  const randomNum = Math.floor(Math.random() * 10000)
  checkoutData.customerEmail = `customer${randomNum}@${domains[Math.floor(Math.random() * domains.length)]}`
}

// 随机生成电话
const generateRandomPhone = () => {
  const phonePrefixes = ['138', '139', '150', '151', '186', '188', '159', '177']
  const phoneSuffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
  checkoutData.customerPhone = `${phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)]}${phoneSuffix}`
}

// 随机生成姓名
const generateRandomName = () => {
  const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴']
  const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰']
  checkoutData.customerName = `${surnames[Math.floor(Math.random() * surnames.length)]}${names[Math.floor(Math.random() * names.length)]}`
}

// 随机生成客户ID
const generateRandomCustomerId = () => {
  checkoutData.customerId = `CUST${Date.now()}${Math.floor(Math.random() * 1000)}`
}

// 随机生成国家
const generateRandomCountry = () => {
  const countries = ['CN', 'US', 'GB', 'JP', 'SG', 'HK']
  checkoutData.country = countries[Math.floor(Math.random() * countries.length)]
}

// 随机生成语言
const generateRandomLanguage = () => {
  const languages = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP']
  checkoutData.language = languages[Math.floor(Math.random() * languages.length)]
}

// 生成时间戳
const generateTimestamp = () => {
  checkoutData.timestamp = Date.now()
}

// 生成随机数
const generateNonce = () => {
  checkoutData.nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// 生成AppId
const generateAppId = () => {
  apiConfig.appId = `APP${Date.now()}${Math.floor(Math.random() * 10000)}`
}

// 生成请求头随机数（内部函数）
const generateHeaderNonceInternal = () => {
  const length = Math.floor(Math.random() * 91) + 10 // 10-100字符
  let nonce = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return nonce
}

// 生成请求头签名（自动生成timestamp和nonce）
const generateHeaderSign = async () => {
  if (!apiConfig.privateKey) {
    alert('请先输入RSA私钥')
    return
  }
  
  // 自动生成timestamp和nonce
  const timestamp = Date.now()
  const nonce = generateHeaderNonceInternal()
  
  // 更新显示值
  apiConfig.timestamp = timestamp
  apiConfig.nonce = nonce
  
  console.log('========== 手动生成签名 ==========')
  console.log('时间戳:', timestamp)
  console.log('随机数:', nonce)
  
  try {
    const sign = await payKKaCheckoutApi.generateHeaderSign(
      'POST',
      '/v3/payment/acq/session',
      timestamp,
      nonce,
      JSON.stringify(checkoutData),
      apiConfig.privateKey
    )
    apiConfig.sign = sign
    console.log('签名已更新到界面')
  } catch (error) {
    console.error('签名生成失败:', error)
    alert('签名生成失败: ' + error.message)
  }
}

// 随机生成超时时间
const generateRandomTimeout = () => {
  const timeouts = [600, 900, 1800, 3600, 7200]
  checkoutData.timeout = timeouts[Math.floor(Math.random() * timeouts.length)]
}

// 随机生成商品ID
const generateRandomProductId = () => {
  checkoutData.productId = `PROD${Date.now()}${Math.floor(Math.random() * 100)}`
}

// 随机生成商品类别
const generateRandomCategory = () => {
  const categories = ['电子产品', '服装', '食品', '图书', '家居', '运动', '美妆', '汽车']
  checkoutData.productCategory = categories[Math.floor(Math.random() * categories.length)]
}

// 随机生成备注
const generateRandomRemark = () => {
  const remarks = ['测试订单', 'VIP客户', '优先处理', '批量订单', '特殊要求', '加急处理', '']
  checkoutData.remark = remarks[Math.floor(Math.random() * remarks.length)]
}

// 随机生成订单IP
const generateRandomOrderIp = () => {
  checkoutData.orderIp = generateRandomIP()
}

// 随机生成客户地址
const generateRandomAddress = () => {
  const addresses = [
    '北京市朝阳区建国路88号',
    '上海市浦东新区陆家嘴环路1000号',
    '广州市天河区天河路123号',
    '深圳市南山区科技园南路123号',
    '杭州市西湖区文三路456号'
  ]
  checkoutData.customerAddress = addresses[Math.floor(Math.random() * addresses.length)]
}

// 账单信息随机生成函数
const generateRandomBillFirstName = () => {
  const names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'David', 'Emma', 'Frank']
  checkoutData.billFirstName = names[Math.floor(Math.random() * names.length)]
}

const generateRandomBillLastName = () => {
  const names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis']
  checkoutData.billLastName = names[Math.floor(Math.random() * names.length)]
}

const generateRandomBillEmail = () => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com']
  const randomNum = Math.floor(Math.random() * 10000)
  checkoutData.billEmail = `bill${randomNum}@${domains[Math.floor(Math.random() * domains.length)]}`
}

const generateRandomBillPhone = () => {
  checkoutData.billPhone = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
}

const generateRandomBillAddress = () => {
  const addresses = [
    '123 Main Street',
    '456 Oak Avenue',
    '789 Pine Road',
    '321 Elm Street',
    '654 Maple Drive'
  ]
  checkoutData.billAddressLine1 = addresses[Math.floor(Math.random() * addresses.length)]
}

const generateRandomBillCountry = () => {
  const countries = ['CN', 'US', 'GB', 'FR', 'JP']
  checkoutData.billCountry = countries[Math.floor(Math.random() * countries.length)]
}

const generateRandomBillState = () => {
  const states = ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Beijing', 'Shanghai', 'Guangdong']
  checkoutData.billState = states[Math.floor(Math.random() * states.length)]
}

const generateRandomBillCity = () => {
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen']
  checkoutData.billCity = cities[Math.floor(Math.random() * cities.length)]
}

const generateRandomBillPostalCode = () => {
  checkoutData.billPostalCode = Math.floor(Math.random() * 90000) + 10000 + ''
}

const generateRandomBillAreaCode = () => {
  const areaCodes = ['010', '021', '020', '0755', '0571', '1', '44', '33']
  checkoutData.billAreaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)]
}

const generateRandomBillDescriptor = () => {
  checkoutData.billDescriptor = `DESC${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}

const generateRandomBillAddressCollection = () => {
  const options = ['REQUIRED', 'AUTO']
  checkoutData.billAddressCollection = options[Math.floor(Math.random() * options.length)]
}

// 收货信息随机生成函数
const generateRandomShipFirstName = () => {
  const names = ['Zhang', 'Li', 'Wang', 'Liu', 'Chen', 'Yang', 'Zhao', 'Huang']
  checkoutData.shipFirstName = names[Math.floor(Math.random() * names.length)]
}

const generateRandomShipLastName = () => {
  const names = ['Wei', 'Fang', 'Na', 'Min', 'Jing', 'Li', 'Qiang', 'Lei']
  checkoutData.shipLastName = names[Math.floor(Math.random() * names.length)]
}

const generateRandomShipEmail = () => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com']
  const randomNum = Math.floor(Math.random() * 10000)
  checkoutData.shipEmail = `ship${randomNum}@${domains[Math.floor(Math.random() * domains.length)]}`
}

const generateRandomShipPhone = () => {
  checkoutData.shipPhone = `+33${Math.floor(Math.random() * 900000000) + 100000000}`
}

const generateRandomShipAddress = () => {
  const addresses = [
    '16 Rue Crespin du Gast',
    '123 Avenue des Champs',
    '456 Boulevard Saint-Germain',
    '789 Rue de la Paix',
    '321 Place de la République'
  ]
  checkoutData.shipAddressLine1 = addresses[Math.floor(Math.random() * addresses.length)]
}

const generateRandomShipCountry = () => {
  const countries = ['CN', 'US', 'GB', 'FR', 'JP']
  checkoutData.shipCountry = countries[Math.floor(Math.random() * countries.length)]
}

const generateRandomShipState = () => {
  const states = ['Île-de-France', 'California', 'New York', 'Guangdong', 'Tokyo']
  checkoutData.shipState = states[Math.floor(Math.random() * states.length)]
}

const generateRandomShipCity = () => {
  const cities = ['Paris', 'London', 'New York', 'Beijing', 'Tokyo']
  checkoutData.shipCity = cities[Math.floor(Math.random() * cities.length)]
}

const generateRandomShipPostalCode = () => {
  checkoutData.shipPostalCode = Math.floor(Math.random() * 90000) + 10000 + ''
}

const generateRandomShipAreaCode = () => {
  const areaCodes = ['33', '1', '44', '86', '81']
  checkoutData.shipAreaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)]
}

// 一键随机生成所有参数
const generateAllRandom = () => {
  generateOrderNo()
  generateRandomAmount()
  generateRandomCurrency()
  // sessionMode 使用下拉框，默认值为 HOSTED，不需要随机生成
  generateRandomPaymentMethods()
  generateRandomDescription()
  generateRandomEmail()
  generateRandomPhone()
  generateRandomName()
  generateRandomCustomerId()
  generateRandomCountry()
  generateRandomLanguage()
  generateTimestamp()
  generateNonce()
  generateRandomTimeout()
  generateRandomProductId()
  generateRandomCategory()
  generateRandomRemark()
  
  // 生成必填字段
  generateTransId()
  // paymentType 使用下拉框，默认值为 PURCHASE，不需要随机生成
  generateCustomer()
  generateGoods()
  
  // 清空旧的签名和请求头参数，确保下次创建时重新生成
  apiConfig.timestamp = null
  apiConfig.nonce = ''
  apiConfig.sign = ''
  
  // 账单信息
  generateRandomBillFirstName()
  generateRandomBillLastName()
  generateRandomBillEmail()
  generateRandomBillPhone()
  generateRandomBillAddress()
  generateRandomBillCountry()
  generateRandomBillState()
  generateRandomBillCity()
  generateRandomBillPostalCode()
  generateRandomBillAreaCode()
  generateRandomBillDescriptor()
  generateRandomBillAddressCollection()
  
  // 收货信息
  generateRandomShipFirstName()
  generateRandomShipLastName()
  generateRandomShipEmail()
  generateRandomShipPhone()
  generateRandomShipAddress()
  generateRandomShipCountry()
  generateRandomShipState()
  generateRandomShipCity()
  generateRandomShipPostalCode()
  generateRandomShipAreaCode()
  
  generateRandomOrderIp()
  generateRandomAddress()
  
  // 请求头参数需要手动填写（timestamp和nonce在生成签名时自动生成）
  console.log('所有参数已随机生成，请填写请求头参数后生成签名')
  
  checkoutData.callbackUrl = 'https://example.com/callback'
  checkoutData.returnUrl = 'https://example.com/success'
  checkoutData.cancelUrl = 'https://example.com/cancel'
}

// 格式化JSON
const formatJson = (obj) => {
  if (!obj) return ''
  return JSON.stringify(obj, null, 2)
}

// 重置表单
const resetForm = () => {
  checkoutData.orderNo = ''
  checkoutData.transId = ''
  checkoutData.amount = 0
  checkoutData.currency = 'USD'
  checkoutData.paymentType = 'PURCHASE'
  checkoutData.sessionMode = 'HOSTED'
  checkoutData.paymentMethods = ''
  checkoutData.description = ''
  checkoutData.callbackUrl = ''
  checkoutData.returnUrl = ''
  checkoutData.cancelUrl = ''
  // 重置开关
  checkoutData.enableCustomerInfo = true
  checkoutData.enableBillInfo = false
  checkoutData.enableShipInfo = false
  checkoutData.customer = ''
  checkoutData.goods = ''
  checkoutData.customerEmail = ''
  checkoutData.customerPhone = ''
  checkoutData.customerName = ''
  checkoutData.customerId = ''
  checkoutData.country = ''
  checkoutData.language = ''
  checkoutData.orderIp = ''
  checkoutData.customerAddress = ''
  checkoutData.timestamp = Date.now()
  checkoutData.nonce = ''
  checkoutData.timeout = 1800
  checkoutData.productId = ''
  checkoutData.productCategory = ''
  checkoutData.remark = ''
  
  // 账单信息
  checkoutData.billFirstName = ''
  checkoutData.billLastName = ''
  checkoutData.billEmail = ''
  checkoutData.billPhone = ''
  checkoutData.billAddressLine1 = ''
  checkoutData.billCountry = ''
  checkoutData.billState = ''
  checkoutData.billCity = ''
  checkoutData.billPostalCode = ''
  checkoutData.billAreaCode = ''
  checkoutData.billDescriptor = ''
  checkoutData.billAddressCollection = ''
  
  // 收货信息
  checkoutData.shipFirstName = ''
  checkoutData.shipLastName = ''
  checkoutData.shipEmail = ''
  checkoutData.shipPhone = ''
  checkoutData.shipAddressLine1 = ''
  checkoutData.shipCountry = ''
  checkoutData.shipState = ''
  checkoutData.shipCity = ''
  checkoutData.shipPostalCode = ''
  checkoutData.shipAreaCode = ''
  
  // 重置请求头参数
  apiConfig.appId = '208383410695312'
  apiConfig.timestamp = null
  apiConfig.nonce = ''
  apiConfig.sign = ''
  // 保留私钥和signAlg，不清空
  
  result.value = null
}

// 创建收银台
const createCheckout = async () => {
  // 验证必填字段
  if (!apiConfig.merchantId || !apiConfig.privateKey) {
    alert('请填写商户ID和私钥')
    return
  }

  if (!checkoutData.orderNo) {
    generateOrderNo()
  }

  if (!checkoutData.amount || checkoutData.amount <= 0) {
    alert('请输入有效的交易金额')
    return
  }

  if (!checkoutData.paymentMethods || checkoutData.paymentMethods === '') {
    alert('请至少选择一种支付方式')
    return
  }

  // 验证JSON格式和必填字段
  let customerObj = null
  let goodsObj = null
  
  try {
    customerObj = JSON.parse(checkoutData.customer)
    // 验证 customer.order_ip 不能为空
    if (!customerObj.order_ip || customerObj.order_ip.trim() === '') {
      alert('客户信息 (Customer) 中的 order_ip 字段不能为空')
      return
    }
  } catch (e) {
    alert('客户信息 (Customer) 格式错误，请输入有效的JSON')
    return
  }

  try {
    goodsObj = JSON.parse(checkoutData.goods)
    // 验证 goods[0].link 不能为null
    if (!Array.isArray(goodsObj) || goodsObj.length === 0) {
      alert('商品信息 (Goods) 必须是一个非空数组')
      return
    }
    for (let i = 0; i < goodsObj.length; i++) {
      if (goodsObj[i].link === null || goodsObj[i].link === undefined) {
        alert(`商品信息 (Goods) 中第 ${i + 1} 个商品的 link 字段不能为null`)
        return
      }
    }
  } catch (e) {
    alert('商品信息 (Goods) 格式错误，请输入有效的JSON')
    return
  }

  loading.value = true

  try {
    // 如果没有时间戳和随机数，自动生成
    if (!checkoutData.timestamp) {
      checkoutData.timestamp = Date.now()
    }
    if (!checkoutData.nonce) {
      checkoutData.nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    // 构建请求数据（使用下划线命名，与API服务保持一致）
    const requestData = {
      merchant_id: apiConfig.merchantId,
      order_no: checkoutData.orderNo,
      trans_id: checkoutData.transId,
      amount: checkoutData.amount,
      currency: checkoutData.currency,
      payment_type: checkoutData.paymentType,
      session_mode: checkoutData.sessionMode,
      payment_methods: checkoutData.paymentMethods,
      description: checkoutData.description || `订单 ${checkoutData.orderNo}`,
      callback_url: checkoutData.callbackUrl || '',
      return_url: checkoutData.returnUrl || '',
      cancel_url: checkoutData.cancelUrl || '',
      customer: customerObj,
      goods: goodsObj,
      timestamp: checkoutData.timestamp,
      nonce: checkoutData.nonce,
      timeout: checkoutData.timeout || 1800,
      product_id: checkoutData.productId || '',
      product_category: checkoutData.productCategory || '',
      remark: checkoutData.remark || ''
    }

    // 只有当客户信息开关启用时，才添加客户信息字段
    if (checkoutData.enableCustomerInfo) {
      if (checkoutData.customerEmail) requestData.customer_email = checkoutData.customerEmail
      if (checkoutData.customerPhone) requestData.customer_phone = checkoutData.customerPhone
      if (checkoutData.customerName) requestData.customer_name = checkoutData.customerName
      if (checkoutData.customerId) requestData.customer_id = checkoutData.customerId
      if (checkoutData.country) requestData.country = checkoutData.country
      if (checkoutData.language) requestData.language = checkoutData.language
    }

    // 构建账单信息对象（bill）- 只有当开关启用时才构建
    if (checkoutData.enableBillInfo) {
      const billObj = {}
      if (checkoutData.billFirstName) billObj.first_name = checkoutData.billFirstName
      if (checkoutData.billLastName) billObj.last_name = checkoutData.billLastName
      if (checkoutData.billEmail) billObj.email = checkoutData.billEmail
      if (checkoutData.billPhone) billObj.phone_number = checkoutData.billPhone
      if (checkoutData.billAddressLine1) billObj.address_line1 = checkoutData.billAddressLine1
      if (checkoutData.billCountry) billObj.country = checkoutData.billCountry
      if (checkoutData.billState) billObj.state = checkoutData.billState
      if (checkoutData.billCity) billObj.city = checkoutData.billCity
      if (checkoutData.billPostalCode) billObj.postal_code = checkoutData.billPostalCode
      if (checkoutData.billAreaCode) billObj.area_code = checkoutData.billAreaCode
      if (checkoutData.billDescriptor) billObj.descriptor = checkoutData.billDescriptor
      if (checkoutData.billAddressCollection) billObj.billing_address_collection = checkoutData.billAddressCollection
      
      if (Object.keys(billObj).length > 0) {
        requestData.bill = billObj
      }
    }

    // 构建收货信息对象（shipping）- 只有当开关启用时才构建
    if (checkoutData.enableShipInfo) {
      const shipObj = {}
      if (checkoutData.shipFirstName) shipObj.first_name = checkoutData.shipFirstName
      if (checkoutData.shipLastName) shipObj.last_name = checkoutData.shipLastName
      if (checkoutData.shipEmail) shipObj.email = checkoutData.shipEmail
      if (checkoutData.shipPhone) shipObj.phone_number = checkoutData.shipPhone
      if (checkoutData.shipAddressLine1) shipObj.address_line1 = checkoutData.shipAddressLine1
      if (checkoutData.shipCountry) shipObj.country = checkoutData.shipCountry
      if (checkoutData.shipState) shipObj.state = checkoutData.shipState
      if (checkoutData.shipCity) shipObj.city = checkoutData.shipCity
      if (checkoutData.shipPostalCode) shipObj.postal_code = checkoutData.shipPostalCode
      if (checkoutData.shipAreaCode) shipObj.area_code = checkoutData.shipAreaCode
      
      if (Object.keys(shipObj).length > 0) {
        requestData.shipping = shipObj
      }
    }

    // 保存签名前的数据
    const requestDataBeforeSign = JSON.parse(JSON.stringify(requestData))

    // 验证必填的请求头参数
    if (!apiConfig.appId) {
      alert('请填写x-paykka-appid')
      loading.value = false
      return
    }
    
    // 每次创建收银台时，清空旧的签名、timestamp和nonce
    // 确保使用最新的参数重新生成签名，避免使用旧签名导致签名错误
    apiConfig.timestamp = null
    apiConfig.nonce = ''
    apiConfig.sign = ''

    const response = await payKKaCheckoutApi.createCheckout(
      apiConfig.baseUrl,
      apiConfig.merchantId,
      requestData,
      {
        appId: apiConfig.appId,
        timestamp: null, // 强制API服务自动生成新的timestamp
        nonce: null, // 强制API服务自动生成新的nonce
        signAlg: apiConfig.signAlg,
        sign: null, // 强制API服务自动生成新的签名（基于最新的请求数据）
        privateKey: apiConfig.privateKey
      }
    )
    
    // 更新显示值（从响应中获取实际使用的值）
    if (response.requestHeaders) {
      apiConfig.timestamp = response.requestHeaders._generated_timestamp || parseInt(response.requestHeaders['x-paykka-timestamp']) || apiConfig.timestamp
      apiConfig.nonce = response.requestHeaders._generated_nonce || response.requestHeaders['x-paykka-nonce'] || apiConfig.nonce
      apiConfig.sign = response.requestHeaders['x-paykka-sign'] || apiConfig.sign
    }

    // 从响应数据中提取 session_url
    const sessionUrl = response.data?.data?.session_url || response.data?.session_url || response.checkoutUrl || null

    result.value = {
      status: 'success',
      timestamp: new Date().toLocaleString('zh-CN'),
      requestUrl: `${apiConfig.baseUrl}/v3/payment/acq/session`,
      requestHeaders: response.requestHeaders || null,
      requestDataBeforeSign: requestDataBeforeSign,
      requestData: response.signedData,
      responseData: response.data,
      sessionUrl: sessionUrl,
      checkoutUrl: response.checkoutUrl || sessionUrl // 保留兼容性
    }
  } catch (error) {
    result.value = {
      status: 'error',
      timestamp: new Date().toLocaleString('zh-CN'),
      requestUrl: `${apiConfig.baseUrl}/v3/payment/acq/session`,
      requestHeaders: null,
      requestDataBeforeSign: checkoutData,
      requestData: null,
      responseData: null,
      error: error.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.checkout-test {
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

.title {
  color: white;
  text-align: center;
  font-size: 1.4rem;
  margin-bottom: 0.4rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  font-weight: 600;
  padding: 0;
}

.test-panel {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 0.8rem;
  background: white;
  border-radius: 6px;
  padding: 0.8rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  min-height: calc(100vh - 60px);
  max-height: calc(100vh - 60px);
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.form-section {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100vh - 100px);
  padding-right: 0.6rem;
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
  color: #333;
  margin-bottom: 0.4rem;
  font-size: 1rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.2rem;
  font-weight: 600;
}

.form-section h3 {
  color: #555;
  margin: 0.5rem 0 0.3rem 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3rem;
}

.section-header h3 {
  margin: 0;
  flex: 1;
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
  opacity: 0.5;
  pointer-events: none;
}

.disabled-section .input-field:disabled,
.disabled-section .btn-small:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.form-group {
  margin-bottom: 0.4rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.2rem;
  color: #333;
  font-weight: 600;
  font-size: 0.8rem;
}

.input-field {
  width: 100%;
  padding: 0.35rem 0.5rem;
  border: 1.5px solid #e0e0e0;
  border-radius: 3px;
  font-size: 0.85rem;
  transition: all 0.3s;
  box-sizing: border-box;
  background: #fff;
  line-height: 1.3;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.input-field:hover {
  border-color: #ccc;
}

.input-field.readonly {
  background: #f5f5f5;
  cursor: not-allowed;
}

.textarea {
  resize: vertical;
  font-family: inherit;
  min-height: 80px;
  line-height: 1.4;
}

.payment-methods-select {
  min-height: auto;
  height: calc(1.3em * 3 + 0.7rem);
  overflow-y: auto;
}

.payment-methods-select option {
  padding: 0.2rem 0.4rem;
  font-size: 0.85rem;
}

.field-desc {
  display: block;
  margin-top: 0.15rem;
  color: #666;
  font-size: 0.7rem;
  line-height: 1.2;
}

.required {
  color: #e74c3c;
  font-weight: bold;
}

.input-with-button {
  display: flex;
  gap: 0.3rem;
  align-items: center;
}

.input-with-button .input-field {
  flex: 1;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
}

.form-row-4 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 0.4rem;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  margin: 0.5rem 0;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.3rem;
  margin-top: 0.3rem;
  padding: 0.4rem;
  background: #f8f9fa;
  border-radius: 3px;
  border: 1.5px solid #e0e0e0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  padding: 0.3rem 0.4rem;
  border-radius: 3px;
  transition: all 0.2s;
  font-size: 0.75rem;
  font-weight: 500;
}

.checkbox-label:hover {
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
  accent-color: #667eea;
  flex-shrink: 0;
}

.button-group {
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1.5px solid #e0e0e0;
}

.btn-primary,
.btn-secondary,
.btn-random,
.btn-small {
  padding: 0.35rem 0.5rem;
  border: none;
  border-radius: 3px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  line-height: 1.3;
  height: fit-content;
  box-sizing: border-box;
}

.btn-small {
  background: #667eea;
  color: white;
  white-space: nowrap;
  margin: 0;
}

.btn-small:hover {
  background: #5568d3;
}

.btn-primary {
  background: #667eea;
  color: white;
  flex: 1;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  min-width: 100px;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  flex: 1;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  min-width: 100px;
}

.btn-secondary:hover {
  background: #e0e0e0;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.btn-random {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  flex: 1;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  min-width: 100px;
}

.btn-random:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(245, 87, 108, 0.4);
}


.result-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  overflow-x: hidden;
  position: sticky;
  top: 0;
  border: 2px solid #e0e0e0;
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
  padding: 4rem 2rem;
  font-size: 1.1rem;
}

.result-content {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.9rem;
}

.status-badge.success {
  background: #d4edda;
  color: #155724;
}

.status-badge.error {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.timestamp {
  color: #666;
  font-size: 0.9rem;
}

.result-item {
  margin-bottom: 0.8rem;
}

.result-item label {
  display: block;
  margin-bottom: 0.4rem;
  color: #333;
  font-weight: 600;
  font-size: 0.8rem;
}

.result-item code {
  color: #333;
  background: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.75rem;
  border: 1px solid #ddd;
}

.code-block {
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 3px;
  overflow-x: auto;
  font-size: 0.75rem;
  line-height: 1.4;
  border: 1px solid #e0e0e0;
  max-height: 300px;
  overflow-y: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  color: #212529;
}

.code-block::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.code-block::-webkit-scrollbar-track {
  background: #e8e8e8;
  border-radius: 3px;
}

.code-block::-webkit-scrollbar-thumb {
  background: #999;
  border-radius: 3px;
}

.result-item.error .code-block {
  background: #fff5f5;
  border-color: #fc8181;
}

.error-text {
  color: #c53030;
}

.result-item.success {
  background: #f0f9ff;
  padding: 0.5rem;
  border-radius: 3px;
  border: 1px solid #bae6fd;
}

.checkout-link {
  display: inline-block;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  word-break: break-all;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #bae6fd;
  transition: all 0.3s;
}

.checkout-link:hover {
  background: #e0f2fe;
  color: #5568d3;
  text-decoration: underline;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.checkout-link {
  color: #667eea;
  text-decoration: none;
  word-break: break-all;
  display: inline-block;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #667eea;
}

.checkout-link:hover {
  background: #667eea;
  color: white;
}

.signature-code {
  background: #fff3cd;
  padding: 0.8rem 1.2rem;
  border-radius: 6px;
  font-size: 0.95rem;
  word-break: break-all;
  display: block;
  border: 2px solid #ffc107;
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  margin-top: 0.5rem;
}

code {
  background: #f4f4f4;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.95rem;
  word-break: break-all;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  border: 1px solid #e0e0e0;
}

/* 桌面端优化 - 充分利用横向空间，减少留白 */
@media (min-width: 1600px) {
  .checkout-test {
    padding: 1rem 1.5rem;
  }

  .test-panel {
    grid-template-columns: 1.6fr 1fr;
    gap: 1.5rem;
    padding: 1.8rem;
  }
}

/* 标准桌面 */
@media (min-width: 1280px) and (max-width: 1599px) {
  .checkout-test {
    padding: 0.8rem 1rem;
  }

  .test-panel {
    grid-template-columns: 1.5fr 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }
}

/* 小屏桌面 - 调整列数 */
@media (min-width: 1024px) and (max-width: 1279px) {
  .checkout-test {
    padding: 0.8rem 1rem;
  }

  .test-panel {
    grid-template-columns: 1.4fr 1fr;
    gap: 1.2rem;
    padding: 1.5rem;
  }

  .form-row-3 {
    grid-template-columns: 1fr 1fr;
  }

  .checkbox-group {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
