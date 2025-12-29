import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import PayKKaApiTest from '../components/PayKKaApiTest.vue'
import PayKKaCheckoutTest from '../components/PayKKaCheckoutTest.vue'
import PayKKaDropInTest from '../components/PayKKaDropInTest.vue'
import PayKKaComponentTest from '../components/PayKKaComponentTest.vue'
import UserConfig from '../components/UserConfig.vue'
import PaymentResult from '../components/PaymentResult.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/api-test',
    name: 'api-test',
    component: PayKKaApiTest
  },
  {
    path: '/hosted-test',
    name: 'hosted-test',
    component: PayKKaCheckoutTest
  },
  {
    path: '/dropin-test',
    name: 'dropin-test',
    component: PayKKaDropInTest
  },
  {
    path: '/component-test',
    name: 'component-test',
    component: PayKKaComponentTest
  },
  {
    path: '/user-config',
    name: 'user-config',
    component: UserConfig
  },
  {
    path: '/payment/success',
    name: 'payment-success',
    component: PaymentResult
  },
  {
    path: '/payment/cancel',
    name: 'payment-cancel',
    component: PaymentResult
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

