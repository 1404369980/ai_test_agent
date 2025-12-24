<template>
  <PayKKaCheckoutBase
    title="PayKKa Component 支付组件测试"
    default-session-mode="COMPONENT"
    session-mode-description="默认值：COMPONENT（通过高度定制化的UI，无缝融入商户页面）"
    @back="$emit('back')"
  />
</template>

<script setup>
import PayKKaCheckoutBase from './PayKKaCheckoutBase.vue'

defineEmits(['back'])
</script>
