import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import progress from 'vite-plugin-progress'
import viteCompression from 'vite-plugin-compression'
import topLevelAwait from 'vite-plugin-top-level-await'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import stylelint from 'vite-plugin-stylelint'

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_BASE_PATH,
    build: {
      minify: 'terser',
      outDir: 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          drop_console: env.VITE_DROP_CONSOLE === 'true'
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            echarts: ['echarts'] // 将 echarts 单独打包
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      progress(),
      tailwindcss(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'vue-i18n',
          '@vueuse/core',
          'pinia',
        ],  // 指定自动导入的模块
        resolvers: [ElementPlusResolver()],  // 可选：配合组件库的解析器
        dts: 'types/auto-imports.d.ts',  // 生成类型声明文件
        dirs: ['src/stores/**', 'src/hooks/**'],
        eslintrc: { enabled: true }         // 生成 ESLint 配置
      }),
      Components({
        resolvers: [ElementPlusResolver()],  // 解析 UI 库组件
        dts: 'types/components.d.ts',    // 生成组件类型声明
        dirs: ['src/components'],            // 自动注册项目内组件
      }),
      viteCompression({
        verbose: true,    // 输出压缩结果
        disable: false,   // 是否禁用
        threshold: 10240, // 大于10KB的文件才压缩
        algorithm: 'gzip', // 压缩算法，可选 ['gzip', 'brotliCompress', 'deflate','deflateRaw']
        ext: '.gz',       // 生成的压缩包后缀
        deleteOriginFile: false // 是否删除原始文件
      }),
      stylelint({
        fix: true, // 启用自动修复（包含排序）
        include: ['src/**/*.{vue,css,scss}'], // 检查的文件类型
        cache: false, // 缓存提升性能
        emitError: true, // 构建时发现错误终止构建
        emitWarning: true, // 构建时显示警告
        lintInWorker: true, // 启用 worker 线程提升性能
        formatter: 'string' // 选择错误信息格式
      }),
      topLevelAwait({
        // The export name of top-level await promise for each chunk module
        promiseExportName: '__tla',
        // The function to generate import names of top-level await promise in each chunk module
        promiseImportName: i => `__tla_${i}`
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5090, // 端口号
      open: false // 是否自动打开浏览器
    }
  }
})
