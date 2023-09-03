import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/styles/index.scss'
import '@/assets/js/iconfont.js'

import App from './App.vue'
import { createPinia } from 'pinia'
import { registerStore } from '@/stores'
import { router } from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import SvgIcon from '@/components/svg-icon/index'

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn
})
app.use(createPinia())
// 注册 Pinia
registerStore()
app.use(SvgIcon)

app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
