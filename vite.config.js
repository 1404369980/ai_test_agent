import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 5173, // 默认端口
    open: true, // 自动打开浏览器
    cors: true, // 启用CORS
    proxy: {
      // Vite 代理配置已移除，现在使用后端代理接口
      // 后端代理接口路径可通过环境变量 VITE_PROXY_BASE_URL 配置（默认：/api/proxy）
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000
  }
})
