import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    // 基础路径配置（如果部署在子路径下，需要设置，例如 '/app'）
    // 如果部署在根路径，保持默认的 '/'
    base: '/',
    
    plugins: [
      vue(),
      // 生产环境禁用开发工具
      ...(isProduction ? [] : [vueDevTools()]),
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
      minify: 'esbuild', // 使用 esbuild（Vite 默认，更快且无需额外依赖）
      chunkSizeWarningLimit: 1000,
      // 确保构建输出适合 Spring Boot 静态资源目录
      // Spring Boot 默认从 src/main/resources/static 读取静态资源
      // 构建后将 dist 目录内容复制到 Spring Boot 的 static 目录即可
      rollupOptions: {
        output: {
          // 确保资源文件名包含哈希值，便于缓存管理
          assetFileNames: 'assets/[name].[hash].[ext]',
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
        }
      }
    }
  }
})
