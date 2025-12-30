import './assets/main.css'
// 全局引入 PayKKa Checkout UI 样式
import '@paykka/card-checkout-ui/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
