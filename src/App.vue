<script setup>
import { ref } from 'vue'
import HomePage from './components/HomePage.vue'
import PayKKaTest from './components/PayKKaTest.vue'
import PayKKaCheckoutTest from './components/PayKKaCheckoutTest.vue'
import UserConfig from './components/UserConfig.vue'

const currentPage = ref('home')

const handleNavigate = (page) => {
  currentPage.value = page
}

const goBack = () => {
  currentPage.value = 'home'
}
</script>

<template>
  <HomePage v-if="currentPage === 'home'" @navigate="handleNavigate" />
  <PayKKaTest v-else-if="currentPage === 'api-test'" @back="goBack" />
  <PayKKaCheckoutTest v-else-if="currentPage === 'hosted-test'" @back="goBack" />
  <UserConfig v-else-if="currentPage === 'user-config'" @back="goBack" />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  width: 100% !important;
  max-width: 100% !important;
  min-height: 100vh;
  margin: 0 !important;
  padding: 0 !important;
  display: block !important;
  grid-template-columns: none !important;
}

@media (min-width: 1024px) {
  body {
    display: block !important;
    place-items: unset !important;
  }

  #app {
    display: block !important;
    grid-template-columns: none !important;
    padding: 0 !important;
  }
}
</style>
