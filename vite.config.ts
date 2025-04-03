import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    }
  },
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      imports: ["vue", "vue-router"],      // 指定自动导入的模块
      resolvers: [ElementPlusResolver()],  // 可选：配合组件库的解析器
      dts: "src/types/auto-imports.d.ts",  // 生成类型声明文件
      eslintrc: { enabled: true },         // 生成 ESLint 配置
    }),
    Components({
      resolvers: [ElementPlusResolver()],  // 解析 UI 库组件
      dirs: ["src/components"],            // 自动注册项目内组件
      dts: "src/types/components.d.ts",    // 生成组件类型声明
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5090, // 端口号
    open: false, // 是否自动打开浏览器
  }
})
