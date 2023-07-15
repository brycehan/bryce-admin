import '@/assets/styles/index.scss'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { createPinia } from 'pinia'
import { registerStore } from '@/stores'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn
})
app.use(createPinia())
registerStore()

app.use(router)

app.mount('#app')
