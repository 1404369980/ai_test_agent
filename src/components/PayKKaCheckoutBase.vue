<template>
  <div class="checkout-test">
    <div class="container">
      <div class="header-with-back">
        <button @click="goBack" class="back-button">← 返回首页</button>
        <h1 class="title">{{ title }}</h1>
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

          <h3>收银台参数</h3>

          <div class="form-row-3">
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

            <div class="form-group">
              <label>交易金额 (Amount)</label>
              <div class="input-with-button">
                <input 
                  v-model.number="checkoutData.amount" 
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
                <input 
                  v-model="checkoutData.currency" 
                  type="text" 
                  list="currency-list"
                  placeholder="选择或输入币种"
                  class="input-field"
                />
                <datalist id="currency-list">
                  <option value="USD">USD - 美元</option>
                  <option value="EUR">EUR - 欧元</option>
                  <option value="GBP">GBP - 英镑</option>
                  <option value="CNY">CNY - 人民币</option>
                  <option value="JPY">JPY - 日元</option>
                  <option value="HKD">HKD - 港币</option>
                  <option value="SGD">SGD - 新加坡元</option>
                </datalist>
                <button @click="generateRandomCurrency" class="btn-small">随机币种</button>
              </div>
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>支付类型 (Payment Type) <span class="required">*</span></label>
              <input 
                v-model="checkoutData.paymentType" 
                type="text" 
                list="payment-type-list"
                placeholder="选择或输入支付类型"
                class="input-field"
              />
              <datalist id="payment-type-list">
                <option value="PURCHASE">PURCHASE - 消费</option>
                <option value="PREPARE_AUTHORIZE">PREPARE_AUTHORIZE - 预授权</option>
                <option value="RECURRING">RECURRING - 循环支付</option>
                <option value="REFUND">REFUND - 退款</option>
              </datalist>
              <small class="field-desc">默认值：PURCHASE</small>
            </div>

            <div class="form-group">
              <label>会话模式 (Session Mode)</label>
              <input 
                v-model="checkoutData.sessionMode" 
                type="text" 
                list="session-mode-list"
                placeholder="选择或输入会话模式"
                class="input-field"
              />
              <datalist id="session-mode-list">
                <option value="HOSTED">HOSTED - 托管模式</option>
                <option value="COMPONENT">COMPONENT - 组件模式</option>
                <option value="DROP_IN">DROP_IN - 嵌入模式</option>
              </datalist>
              <small class="field-desc">{{ sessionModeDescription }}</small>
            </div>
          </div>

          <div class="form-group">
            <label>商品描述 (Description)</label>
            <textarea 
              v-model="checkoutData.description" 
              placeholder="请输入商品描述"
              class="input-field textarea"
              rows="2"
            ></textarea>
            <button @click="generateRandomDescription" class="btn-small" style="margin-top: 0.3rem;">随机描述</button>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label>请款方式 (Capture Method) <span class="required">*</span></label>
              <select v-model="checkoutData.captureMethod" class="input-field">
                <option value="AUTOMATIC">AUTOMATIC - 自动</option>
                <option value="MANUAL">MANUAL - 手动</option>
              </select>
            </div>

            <div class="form-group">
              <label>过期时间 (Expire Time)</label>
              <input 
                v-model="checkoutData.expireTime" 
                type="datetime-local"
                class="input-field"
                placeholder="2023-11-24T11:34:37+0800"
              />
              <small class="field-desc">格式: YYYY-MM-DDTHH:mm:ss+0800</small>
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
          </div>

          <div class="form-row-3">
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
            <div class="section-header-actions">
              <button 
                @click="generateAllCustomerInfo" 
                class="btn-small btn-random-section"
                :disabled="!checkoutData.enableCustomerInfo"
              >
                随机生成
              </button>
              <label class="toggle-switch">
                <input type="checkbox" v-model="checkoutData.enableCustomerInfo" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">{{ checkoutData.enableCustomerInfo ? '启用' : '禁用' }}</span>
              </label>
            </div>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableCustomerInfo }">
            <div class="form-group">
              <label>客户姓名 (Name) <span class="required">*</span></label>
              <input 
                v-model="checkoutData.customerName" 
                type="text" 
                placeholder="Charlie Brown"
                class="input-field"
                :disabled="!checkoutData.enableCustomerInfo"
              />
            </div>
            <div class="form-group">
              <label>客户邮箱 (Email) <span class="required">*</span></label>
              <input 
                v-model="checkoutData.customerEmail" 
                type="email" 
                placeholder="charlie.brown2519@gmail.com"
                class="input-field"
                :disabled="!checkoutData.enableCustomerInfo"
              />
            </div>
            <div class="form-group">
              <label>客户电话 (Phone) <span class="required">*</span></label>
              <input 
                v-model="checkoutData.customerPhone" 
                type="text" 
                placeholder="+1 622 5406475"
                class="input-field"
                :disabled="!checkoutData.enableCustomerInfo"
              />
            </div>
            <div class="form-group">
              <label>客户ID (ID) <span class="required">*</span></label>
              <input 
                v-model="checkoutData.customerId" 
                type="text" 
                placeholder="CUST1766744364378"
                class="input-field"
                :disabled="!checkoutData.enableCustomerInfo"
              />
            </div>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableCustomerInfo }">
            <div class="form-group">
              <label>订单IP (Order IP) <span class="required">*</span></label>
              <input 
                v-model="checkoutData.customerOrderIp" 
                type="text" 
                placeholder="234.53.90.193"
                class="input-field"
                :disabled="!checkoutData.enableCustomerInfo"
              />
            </div>
          </div>

          <div class="divider"></div>

          <div class="section-header">
            <h3>账单信息 (Billing Info)</h3>
            <div class="section-header-actions">
              <button 
                @click="generateAllBillInfo" 
                class="btn-small btn-random-section"
                :disabled="!checkoutData.enableBillInfo"
              >
                随机生成
              </button>
              <label class="toggle-switch">
                <input type="checkbox" v-model="checkoutData.enableBillInfo" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">{{ checkoutData.enableBillInfo ? '启用' : '禁用' }}</span>
              </label>
            </div>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableBillInfo }">
            <div class="form-group">
              <label>账单名 (First Name)</label>
              <input 
                v-model="checkoutData.billFirstName" 
                type="text" 
                placeholder="First Name"
                class="input-field"
                :disabled="!checkoutData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>账单姓 (Last Name)</label>
              <input 
                v-model="checkoutData.billLastName" 
                type="text" 
                placeholder="Last Name"
                class="input-field"
                :disabled="!checkoutData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>账单邮箱 (Email)</label>
              <input 
                v-model="checkoutData.billEmail" 
                type="email" 
                placeholder="bill@example.com"
                class="input-field"
                :disabled="!checkoutData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>账单电话 (Phone)</label>
              <input 
                v-model="checkoutData.billPhone" 
                type="text" 
                placeholder="+1234567890"
                class="input-field"
                :disabled="!checkoutData.enableBillInfo"
              />
            </div>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableBillInfo }">
            <div class="form-group">
              <label>账单地址 (Address Line1)</label>
              <input 
                v-model="checkoutData.billAddressLine1" 
                type="text" 
                placeholder="Address Line 1"
                class="input-field"
                :disabled="!checkoutData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>账单国家 (Country)</label>
              <input 
                v-model="checkoutData.billCountry" 
                type="text" 
                list="bill-country-list"
                placeholder="选择或输入国家代码"
                class="input-field"
                :disabled="!checkoutData.enableBillInfo"
              />
              <datalist id="bill-country-list">
                <option value="CN">CN - 中国</option>
                <option value="US">US - 美国</option>
                <option value="GB">GB - 英国</option>
                <option value="FR">FR - 法国</option>
                <option value="JP">JP - 日本</option>
                <option value="SG">SG - 新加坡</option>
                <option value="HK">HK - 香港</option>
                <option value="DE">DE - 德国</option>
              </datalist>
            </div>
            <div class="form-group">
              <label>账单州/省 (State)</label>
              <input 
                v-model="checkoutData.billState" 
                type="text" 
                placeholder="State/Province"
                class="input-field"
                :disabled="!checkoutData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>账单城市 (City)</label>
              <input 
                v-model="checkoutData.billCity" 
                type="text" 
                placeholder="City"
                class="input-field"
                :disabled="!checkoutData.enableBillInfo"
              />
            </div>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableBillInfo }">
            <div class="form-group">
              <label>账单邮编 (Postal Code)</label>
              <input 
                v-model="checkoutData.billPostalCode" 
                type="text" 
                placeholder="Postal Code"
                class="input-field"
                :disabled="!checkoutData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>区号 (Area Code)</label>
              <input 
                v-model="checkoutData.billAreaCode" 
                type="text" 
                placeholder="Area Code"
                class="input-field"
                :disabled="!checkoutData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>描述符 (Descriptor)</label>
              <input 
                v-model="checkoutData.billDescriptor" 
                type="text" 
                placeholder="Descriptor"
                class="input-field"
                :disabled="!checkoutData.enableBillInfo"
              />
            </div>
            <div class="form-group">
              <label>地址收集 (Address Collection)</label>
              <input 
                v-model="checkoutData.billAddressCollection" 
                type="text" 
                list="bill-address-collection-list"
                placeholder="选择或输入地址收集方式"
                class="input-field"
                :disabled="!checkoutData.enableBillInfo"
              />
              <datalist id="bill-address-collection-list">
                <option value="REQUIRED">REQUIRED - 必填</option>
                <option value="AUTO">AUTO - 自动</option>
              </datalist>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section-header">
            <h3>收货信息 (Shipping Info)</h3>
            <div class="section-header-actions">
              <button 
                @click="generateAllShipInfo" 
                class="btn-small btn-random-section"
                :disabled="!checkoutData.enableShipInfo"
              >
                随机生成
              </button>
              <label class="toggle-switch">
                <input type="checkbox" v-model="checkoutData.enableShipInfo" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">{{ checkoutData.enableShipInfo ? '启用' : '禁用' }}</span>
              </label>
            </div>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableShipInfo }">
            <div class="form-group">
              <label>收货名 (First Name)</label>
              <input 
                v-model="checkoutData.shipFirstName" 
                type="text" 
                placeholder="First Name"
                class="input-field"
                :disabled="!checkoutData.enableShipInfo"
              />
            </div>
            <div class="form-group">
              <label>收货姓 (Last Name)</label>
              <input 
                v-model="checkoutData.shipLastName" 
                type="text" 
                placeholder="Last Name"
                class="input-field"
                :disabled="!checkoutData.enableShipInfo"
              />
            </div>
            <div class="form-group">
              <label>收货邮箱 (Email)</label>
              <input 
                v-model="checkoutData.shipEmail" 
                type="email" 
                placeholder="ship@example.com"
                class="input-field"
                :disabled="!checkoutData.enableShipInfo"
              />
            </div>
            <div class="form-group">
              <label>收货电话 (Phone)</label>
              <input 
                v-model="checkoutData.shipPhone" 
                type="text" 
                placeholder="+1234567890"
                class="input-field"
                :disabled="!checkoutData.enableShipInfo"
              />
            </div>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableShipInfo }">
            <div class="form-group">
              <label>收货地址 (Address Line1)</label>
              <input 
                v-model="checkoutData.shipAddressLine1" 
                type="text" 
                placeholder="Address Line 1"
                class="input-field"
                :disabled="!checkoutData.enableShipInfo"
              />
            </div>
            <div class="form-group">
              <label>收货国家 (Country)</label>
              <input 
                v-model="checkoutData.shipCountry" 
                type="text" 
                list="ship-country-list"
                placeholder="选择或输入国家代码"
                class="input-field"
                :disabled="!checkoutData.enableShipInfo"
              />
              <datalist id="ship-country-list">
                <option value="CN">CN - 中国</option>
                <option value="US">US - 美国</option>
                <option value="GB">GB - 英国</option>
                <option value="FR">FR - 法国</option>
                <option value="JP">JP - 日本</option>
                <option value="SG">SG - 新加坡</option>
                <option value="HK">HK - 香港</option>
                <option value="DE">DE - 德国</option>
              </datalist>
            </div>
            <div class="form-group">
              <label>收货州/省 (State)</label>
              <input 
                v-model="checkoutData.shipState" 
                type="text" 
                placeholder="State/Province"
                class="input-field"
                :disabled="!checkoutData.enableShipInfo"
              />
            </div>
            <div class="form-group">
              <label>收货城市 (City)</label>
              <input 
                v-model="checkoutData.shipCity" 
                type="text" 
                placeholder="City"
                class="input-field"
                :disabled="!checkoutData.enableShipInfo"
              />
            </div>
          </div>
          <div class="form-row-4" :class="{ 'disabled-section': !checkoutData.enableShipInfo }">
            <div class="form-group">
              <label>收货邮编 (Postal Code)</label>
              <input 
                v-model="checkoutData.shipPostalCode" 
                type="text" 
                placeholder="Postal Code"
                class="input-field"
                :disabled="!checkoutData.enableShipInfo"
              />
            </div>
            <div class="form-group">
              <label>区号 (Area Code)</label>
              <input 
                v-model="checkoutData.shipAreaCode" 
                type="text" 
                placeholder="Area Code"
                class="input-field"
                :disabled="!checkoutData.enableShipInfo"
              />
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
                <label>响应数据:</label>
                <pre class="code-block">{{ formatJson(result.responseData) }}</pre>
              </div>

              <div v-if="result.sessionUrl || result.checkoutUrl" class="result-item success">
                <label>收银台URL:</label>
                <a :href="result.sessionUrl || result.checkoutUrl" target="_blank" class="checkout-link">
                  {{ result.sessionUrl || result.checkoutUrl }}
                </a>
                <small class="field-desc">点击链接在新页面打开收银台</small>
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
    
    <!-- Toast 提示 -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Toast from './Toast.vue'
import { showError, showSuccess, showInfo } from '../utils/toast'
import { useNavigation } from '../composables/useNavigation'
import { useMerchantConfig } from '../composables/useMerchantConfig'
import { payKKaCheckoutApi } from '../services/paykkaCheckoutApi'
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
// 签名相关功能已由 payKKaCheckoutApi 内部管理，无需在此处导入
// 商户配置管理已移至 useMerchantConfig composable

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  defaultSessionMode: {
    type: String,
    required: true,
    validator: (value) => ['HOSTED', 'DROP_IN', 'COMPONENT'].includes(value)
  },
  sessionModeDescription: {
    type: String,
    required: true
  }
})

const { goHome: goBack } = useNavigation()

const loading = ref(false)

// 私钥展开/收起状态
const showPrivateKeyFull = ref(false)

// API配置 - 必须在 useMerchantConfig 之前定义
const apiConfig = reactive({
  baseUrl: '', // 从商户配置中选择后自动填充
  merchantId: '', // 从商户配置中选择后自动填充
  privateKey: '', // 从商户配置中选择后自动填充
  appId: '' // 从商户配置中选择后自动填充
  // timestamp, nonce, signAlg, sign 由签名方法自动管理，无需在配置中存储
})

// 使用商户配置 composable
const { merchantConfigs, selectedMerchantId, onMerchantChange, loadMerchantConfigs } = useMerchantConfig(apiConfig)

// 清空API配置（保留用于其他地方）
const clearApiConfig = () => {
  apiConfig.baseUrl = ''
  apiConfig.merchantId = ''
  apiConfig.appId = ''
  apiConfig.privateKey = ''
}

// 填充API配置（保留用于其他地方）
const fillApiConfig = (config) => {
  if (config) {
    apiConfig.baseUrl = config.baseUrl || 'https://openapi-dev.paykka.com'
    apiConfig.merchantId = config.merchantId
    apiConfig.appId = config.appId
    apiConfig.privateKey = config.privateKey
  }
}

const router = useRouter()

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

const checkoutData = reactive({
  transId: '',
  amount: 0,
  currency: 'USD',
  paymentType: 'PURCHASE',
  sessionMode: props.defaultSessionMode,
  description: '',
  captureMethod: 'AUTOMATIC',
  expireTime: getDefaultExpireTime(),
  returnUrl: getDefaultReturnUrl(),
  cancelUrl: getDefaultCancelUrl(),
  // 开关控制
  enableCustomerInfo: true,
  enableBillInfo: true,
  enableShipInfo: true,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  customerId: '',
  customerOrderIp: '',
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
  shipAreaCode: ''
})

const result = ref(null)

// JSON展示相关
const isJsonCollapsed = ref(false)
const editableJson = ref('')
const isManuallyEditingJson = ref(false) // 标记用户是否正在手动编辑JSON

// 随机生成交易ID
const generateTransId = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 100000)
  checkoutData.transId = `TXN${timestamp}${random}`
}

// 构建 customer JSON 对象（从表单字段）
const buildCustomerJson = () => {
  if (!checkoutData.enableCustomerInfo) {
    return ''
  }
  
  const customerObj = {
    name: checkoutData.customerName || '',
    email: checkoutData.customerEmail || '',
    phone: checkoutData.customerPhone || '',
    id: checkoutData.customerId || '',
    order_ip: checkoutData.customerOrderIp || ''
  }
  
  // 只有当所有必填字段都有值时才返回 JSON
  if (customerObj.name && customerObj.email && customerObj.phone && customerObj.id && customerObj.order_ip) {
    return JSON.stringify(customerObj, null, 2)
  }
  
  return ''
}

// 监听客户信息字段变化，自动更新 customer JSON
watch([
  () => checkoutData.customerName,
  () => checkoutData.customerEmail,
  () => checkoutData.customerPhone,
  () => checkoutData.customerId,
  () => checkoutData.customerOrderIp,
  () => checkoutData.enableCustomerInfo
], () => {
  if (checkoutData.enableCustomerInfo) {
    checkoutData.customer = buildCustomerJson()
  } else {
    checkoutData.customer = ''
  }
}, { immediate: true })

// 随机生成客户信息（使用公共方法）
const generateCustomer = () => {
  const firstName = generateRandomFirstName()
  const lastName = generateRandomLastName()
  const fullName = `${firstName} ${lastName}`
  const email = generateRandomEmailUtil(fullName.toLowerCase().replace(' ', '.'))
  const phone = generateRandomPhoneUtil('us')
  
  // 生成订单IP（用于customer对象中的order_ip字段）
  const orderIp = generateRandomIP()
  
  checkoutData.customerName = fullName
  checkoutData.customerEmail = email
  checkoutData.customerPhone = phone
  checkoutData.customerId = `CUST${Date.now()}`
  checkoutData.customerOrderIp = orderIp
  
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

// generateRandomPaymentMethods 已移除，支付方式字段已删除

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

// 客户信息字段（customerEmail、customerPhone、customerName、customerId）已移除
// 这些信息现在只存在于 customer JSON 对象中

// 批量生成所有客户信息
const generateAllCustomerInfo = () => {
  // 更新customer JSON对象（包含name、email、phone、id等信息）
  generateCustomer()
}

// timestamp 和 nonce 由签名方法自动管理，无需手动生成函数

// generateAppId 已移除，App ID从商户配置中获取

// 生成请求头随机数（内部函数）
// 生成请求头签名（自动生成timestamp和nonce）- 使用公共方法
// 签名方法已由 createCheckout 函数内部自动管理，无需手动生成


// orderIp 和 customerAddress 已移除，order_ip 在 customer 对象中自动生成

// 批量生成所有账单信息
const generateAllBillInfo = () => {
  checkoutData.billFirstName = generateRandomFirstName()
  checkoutData.billLastName = generateRandomLastName()
  checkoutData.billEmail = generateRandomEmailUtil('bill')
  checkoutData.billPhone = generateRandomPhoneUtil('us')
  checkoutData.billAddressLine1 = generateRandomAddressUtil('en')
  checkoutData.billCountry = generateRandomCountryUtil()
  checkoutData.billState = generateRandomStateUtil(checkoutData.billCountry || 'US')
  checkoutData.billCity = generateRandomCityUtil(checkoutData.billCountry || 'US')
  checkoutData.billPostalCode = generateRandomPostalCodeUtil()
  checkoutData.billAreaCode = generateRandomAreaCodeUtil(checkoutData.billCountry || 'CN')
  checkoutData.billDescriptor = `DESC${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  const options = ['REQUIRED', 'AUTO']
  checkoutData.billAddressCollection = options[Math.floor(Math.random() * options.length)]
}

// 批量生成所有收货信息
const generateAllShipInfo = () => {
  checkoutData.shipFirstName = generateRandomFirstName()
  checkoutData.shipLastName = generateRandomLastName()
  checkoutData.shipEmail = generateRandomEmailUtil('ship')
  checkoutData.shipPhone = generateRandomPhoneUtil('fr')
  checkoutData.shipAddressLine1 = generateRandomAddressUtil('en')
  checkoutData.shipCountry = generateRandomCountryUtil()
  checkoutData.shipState = generateRandomStateUtil(checkoutData.shipCountry || 'FR')
  checkoutData.shipCity = generateRandomCityUtil(checkoutData.shipCountry || 'FR')
  checkoutData.shipPostalCode = generateRandomPostalCodeUtil()
  checkoutData.shipAreaCode = generateRandomAreaCodeUtil(checkoutData.shipCountry || 'FR')
}

// 一键随机生成所有参数
const generateAllRandom = () => {
  generateRandomAmount()
  generateRandomCurrency()
  // sessionMode 使用下拉框，默认值为 HOSTED，不需要随机生成
  generateRandomDescription()
  // 使用批量生成函数生成客户信息
  generateAllCustomerInfo()
  
  // 生成必填字段
  generateTransId()
  // paymentType 使用下拉框，默认值为 PURCHASE，不需要随机生成
  // generateCustomer() 已在 generateAllCustomerInfo() 中调用
  generateGoods()
  
  // 签名相关参数由签名方法自动管理，无需手动清空
  
  // 使用批量生成函数生成账单信息
  generateAllBillInfo()
  
  // 使用批量生成函数生成收货信息
  generateAllShipInfo()
  
  // timestamp 和 nonce 由签名方法自动管理，无需手动生成
  
  // 保持过期时间为默认值（当前时间之后半小时），不随机生成
  checkoutData.expireTime = getDefaultExpireTime()
  
  checkoutData.returnUrl = getDefaultReturnUrl()
  checkoutData.cancelUrl = getDefaultCancelUrl()
}

// 格式化JSON
const formatJson = (obj) => {
  if (!obj) return ''
  return JSON.stringify(obj, null, 2)
}

// 格式化过期时间：将 datetime-local 格式转换为 API 需要的格式
// 输入格式: "2023-11-24T11:34" 或 "2023-11-24T11:34:37+0800"
// 输出格式: "2023-11-24T11:34:37+0800"
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

// 重置表单
const resetForm = () => {
  checkoutData.transId = ''
  checkoutData.amount = 0
  checkoutData.currency = 'USD'
  checkoutData.paymentType = 'PURCHASE'
  checkoutData.sessionMode = props.defaultSessionMode
  checkoutData.description = ''
  checkoutData.captureMethod = 'AUTOMATIC'
  checkoutData.expireTime = getDefaultExpireTime()
  checkoutData.returnUrl = getDefaultReturnUrl()
  checkoutData.cancelUrl = getDefaultCancelUrl()
  // 重置开关
  checkoutData.enableCustomerInfo = true
  checkoutData.enableBillInfo = true
  checkoutData.enableShipInfo = true
  checkoutData.customerName = ''
  checkoutData.customerEmail = ''
  checkoutData.customerPhone = ''
  checkoutData.customerId = ''
  checkoutData.customerOrderIp = ''
  checkoutData.customer = ''
  checkoutData.goods = ''
  
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
  
  // 重置请求头参数（不清空，因为从商户配置中获取）
  // apiConfig 中的 baseUrl, merchantId, appId, privateKey 从商户配置中获取，不清空
  
  result.value = null
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

// 验证收银台数据
const validateCheckoutData = () => {
  if (!checkoutData.amount || checkoutData.amount <= 0) {
    showError('请输入有效的交易金额')
    return false
  }

  return true
}

// 验证JSON数据
const validateJsonData = () => {
  let customerObj = null
  let goodsObj = null
  
  // 只有当客户信息开关启用时，才验证客户信息字段
  if (checkoutData.enableCustomerInfo) {
    // 验证必填字段
    if (!checkoutData.customerName || checkoutData.customerName.trim() === '') {
      showError('客户姓名 (Name) 不能为空')
      return null
    }
    if (!checkoutData.customerEmail || checkoutData.customerEmail.trim() === '') {
      showError('客户邮箱 (Email) 不能为空')
      return null
    }
    if (!checkoutData.customerPhone || checkoutData.customerPhone.trim() === '') {
      showError('客户电话 (Phone) 不能为空')
      return null
    }
    if (!checkoutData.customerId || checkoutData.customerId.trim() === '') {
      showError('客户ID (ID) 不能为空')
      return null
    }
    if (!checkoutData.customerOrderIp || checkoutData.customerOrderIp.trim() === '') {
      showError('订单IP (Order IP) 不能为空')
      return null
    }
    
    // 构建 customer 对象
    customerObj = {
      name: checkoutData.customerName.trim(),
      email: checkoutData.customerEmail.trim(),
      phone: checkoutData.customerPhone.trim(),
      id: checkoutData.customerId.trim(),
      order_ip: checkoutData.customerOrderIp.trim()
    }
  }

  try {
    goodsObj = JSON.parse(checkoutData.goods)
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

// 生成请求参数的辅助函数
const buildRequestParams = () => {
  try {
    // 解析JSON数据
    let customerObj = null
    let goodsObj = null
    
    // 从表单字段构建 customer 对象
    if (checkoutData.enableCustomerInfo) {
      if (checkoutData.customerName && checkoutData.customerEmail && 
          checkoutData.customerPhone && checkoutData.customerId && checkoutData.customerOrderIp) {
        customerObj = {
          name: checkoutData.customerName.trim(),
          email: checkoutData.customerEmail.trim(),
          phone: checkoutData.customerPhone.trim(),
          id: checkoutData.customerId.trim(),
          order_ip: checkoutData.customerOrderIp.trim()
        }
      }
    }
    
    if (checkoutData.goods) {
      try {
        goodsObj = JSON.parse(checkoutData.goods)
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
        const value = checkoutData[`${prefix}${key}`]
        if (value) obj[snakeKey] = value
      }
      
      if (prefix === 'bill') {
        if (checkoutData.billDescriptor) obj.descriptor = checkoutData.billDescriptor
        if (checkoutData.billAddressCollection) obj.billing_address_collection = checkoutData.billAddressCollection
      }
      
      return Object.keys(obj).length > 0 ? obj : null
    }
    
    // 构建请求参数
    const params = {
      merchant_id: apiConfig.merchantId || '(未填写)',
      trans_id: checkoutData.transId || '(未填写)',
      amount: checkoutData.amount || 0,
      currency: checkoutData.currency || 'USD',
      payment_type: checkoutData.paymentType || 'PURCHASE',
      session_mode: checkoutData.sessionMode || props.defaultSessionMode,
      description: checkoutData.description || '(未填写)',
      capture_method: checkoutData.captureMethod || 'AUTOMATIC',
      expire_time: checkoutData.expireTime ? formatExpireTime(checkoutData.expireTime) : '(未填写)',
      return_url: checkoutData.returnUrl || '(未填写)',
      cancel_url: checkoutData.cancelUrl || '(未填写)',
      goods: goodsObj || '(未填写)'
    }
    
    // 只有当客户信息开关启用时，才添加客户信息字段和 customer 对象
    if (checkoutData.enableCustomerInfo) {
      if (customerObj) {
        params.customer = customerObj
      }
    }
    
    // 构建账单信息对象（bill）- 只有当开关启用时才构建
    if (checkoutData.enableBillInfo) {
      const billObj = buildAddressObject('bill')
      if (billObj) {
        params.bill = billObj
      }
    }
    
    // 构建收货信息对象（shipping）- 只有当开关启用时才构建
    if (checkoutData.enableShipInfo) {
      const shipObj = buildAddressObject('ship')
      if (shipObj) {
        params.shipping = shipObj
      }
    }
    
    return params
  } catch (error) {
    return { error: `生成JSON时出错: ${error.message}` }
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
      checkoutData.transId = params.trans_id
    }
    if (params.amount !== undefined && params.amount !== '(未填写)') {
      checkoutData.amount = params.amount
    }
    if (params.currency && params.currency !== '(未填写)') {
      checkoutData.currency = params.currency
    }
    if (params.payment_type && params.payment_type !== '(未填写)') {
      checkoutData.paymentType = params.payment_type
    }
    if (params.session_mode && params.session_mode !== '(未填写)') {
      checkoutData.sessionMode = params.session_mode
    }
    if (params.description && params.description !== '(未填写)') {
      checkoutData.description = params.description
    }
    if (params.capture_method && params.capture_method !== '(未填写)') {
      checkoutData.captureMethod = params.capture_method
    }
    if (params.expire_time && params.expire_time !== '(未填写)') {
      checkoutData.expireTime = params.expire_time
    }
    if (params.return_url && params.return_url !== '(未填写)') {
      checkoutData.returnUrl = params.return_url
    }
    if (params.cancel_url && params.cancel_url !== '(未填写)') {
      checkoutData.cancelUrl = params.cancel_url
    }
    
    // 更新商品信息
    if (params.goods && params.goods !== '(未填写)' && !params.goods.error) {
      checkoutData.goods = formatJson(params.goods)
    }
    
    // 更新客户信息
    if (params.customer && !params.customer.error) {
      checkoutData.enableCustomerInfo = true
      if (params.customer.name) checkoutData.customerName = params.customer.name
      if (params.customer.email) checkoutData.customerEmail = params.customer.email
      if (params.customer.phone) checkoutData.customerPhone = params.customer.phone
      if (params.customer.id) checkoutData.customerId = params.customer.id
      if (params.customer.order_ip) checkoutData.customerOrderIp = params.customer.order_ip
      // customer JSON 会通过 watch 自动更新
    }
    
    // 更新账单信息
    if (params.bill) {
      checkoutData.enableBillInfo = true
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
          checkoutData[`bill${key}`] = params.bill[snakeKey]
        }
      }
      if (params.bill.descriptor) checkoutData.billDescriptor = params.bill.descriptor
      if (params.bill.billing_address_collection) checkoutData.billAddressCollection = params.bill.billing_address_collection
    }
    
    // 更新收货信息
    if (params.shipping) {
      checkoutData.enableShipInfo = true
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
          checkoutData[`ship${key}`] = params.shipping[snakeKey]
        }
      }
    }
    
    // 同步更新 editableJson，并清除手动编辑标记
    isManuallyEditingJson.value = false
    editableJson.value = requestParamsJson.value
    showSuccess('表单已更新')
  } catch (error) {
    showError(`JSON格式错误: ${error.message}`)
  }
}

// 复制JSON到剪贴板
const copyJson = async () => {
  try {
    const textToCopy = editableJson.value || requestParamsJson.value
    await navigator.clipboard.writeText(textToCopy)
    showSuccess('JSON已复制到剪贴板')
  } catch (err) {
    // 降级方案：使用传统方法
    const textArea = document.createElement('textarea')
    const textToCopy = editableJson.value || requestParamsJson.value
    textArea.value = textToCopy
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      showSuccess('JSON已复制到剪贴板')
    } catch (e) {
      showError('复制失败，请手动复制')
    }
    document.body.removeChild(textArea)
  }
}

// 创建收银台
const createCheckout = async () => {
  // 验证必填字段
  if (!validateMerchantConfig()) return

  if (!validateCheckoutData()) return

  // 验证JSON格式和必填字段
  const jsonData = validateJsonData()
  if (!jsonData) return
  
  const { customerObj, goodsObj } = jsonData

  loading.value = true

  try {
    // 构建请求数据（使用下划线命名，与API服务保持一致）
    // timestamp 和 nonce 由签名方法自动管理，不应在请求体中
    const requestData = {
      merchant_id: apiConfig.merchantId,
      trans_id: checkoutData.transId,
      amount: checkoutData.amount,
      currency: checkoutData.currency,
      payment_type: checkoutData.paymentType,
      session_mode: checkoutData.sessionMode,
      description: checkoutData.description || `订单 ${checkoutData.transId}`,
      capture_method: checkoutData.captureMethod || 'AUTOMATIC',
      expire_time: checkoutData.expireTime ? formatExpireTime(checkoutData.expireTime) : '',
      return_url: checkoutData.returnUrl || '',
      cancel_url: checkoutData.cancelUrl || '',
      goods: goodsObj
    }

    // 只有当客户信息开关启用时，才添加客户信息字段和 customer 对象
    if (checkoutData.enableCustomerInfo) {
      // 添加 customer JSON 对象（包含所有客户信息：name、email、phone、id等）
      if (customerObj) {
        requestData.customer = customerObj
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
        const value = checkoutData[`${prefix}${key}`]
        if (value) obj[snakeKey] = value
      }
      
      // 特殊字段处理
      if (prefix === 'bill') {
        if (checkoutData.billDescriptor) obj.descriptor = checkoutData.billDescriptor
        if (checkoutData.billAddressCollection) obj.billing_address_collection = checkoutData.billAddressCollection
      }
      
      return Object.keys(obj).length > 0 ? obj : null
    }

    // 构建账单信息对象（bill）- 只有当开关启用时才构建
    if (checkoutData.enableBillInfo) {
      const billObj = buildAddressObject('bill')
      if (billObj) {
        requestData.bill = billObj
      }
    }

    // 构建收货信息对象（shipping）- 只有当开关启用时才构建
    if (checkoutData.enableShipInfo) {
      const shipObj = buildAddressObject('ship')
      if (shipObj) {
        requestData.shipping = shipObj
      }
    }

    // 保存签名前的数据
    const requestDataBeforeSign = JSON.parse(JSON.stringify(requestData))

    // 验证必填的请求头参数
    if (!apiConfig.appId) {
      showError('请填写x-paykka-appid')
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
        timestamp: null, // 由签名方法自动生成
        nonce: null, // 由签名方法自动生成
        signAlg: 'SHA256_WITH_RSA', // 固定值
        sign: null, // 由签名方法自动生成
        privateKey: apiConfig.privateKey
      }
    )
    
    // 签名相关参数由签名方法自动管理，无需更新显示值

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

// 组件挂载时加载商户配置
// 组件挂载时加载商户配置
onMounted(() => {
  loadMerchantConfigs()
})
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

.section-header-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
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

.input-field.readonly,
.textarea.readonly {
  background: #f5f5f5;
  cursor: not-allowed;
  color: #666;
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

.info-box {
  background: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 6px;
  padding: 0.8rem 1rem;
  margin-top: 0.5rem;
}

.info-box p {
  margin: 0 0 0.5rem 0;
  color: #1976d2;
  font-size: 0.85rem;
}

.info-box ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #424242;
  font-size: 0.8rem;
  line-height: 1.6;
}

.info-box li {
  margin-bottom: 0.3rem;
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
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.json-edit {
  width: 100%;
  min-height: 200px;
  max-height: 400px;
  padding: 1rem;
  margin: 0;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.85rem;
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
.btn-reset {
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
.btn-reset svg {
  width: 14px;
  height: 14px;
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
