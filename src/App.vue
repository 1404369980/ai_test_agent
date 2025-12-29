<script setup>
</script>

<template>
  <router-view />
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
