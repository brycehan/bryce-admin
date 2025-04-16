import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import '@/assets/styles/index.scss'

import App from './App.vue'
import pinia from '@/stores'
import { router } from '@/router'
import directives from '@/utils/directives'
import 'default-passive-events'
import { i18n } from '@/i18n'
import { setupFormCreate } from '@/plugins/form-create.ts'
import icon from '@/plugins/icon.ts'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)
// 自定义指令
app.use(directives)
// 表单生成器
setupFormCreate(app)
// 注册图标
app.use(icon)

app.mount('#app')
