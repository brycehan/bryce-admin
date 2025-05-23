import { createApp } from 'vue'
import '@/assets/styles/index.scss'
import 'element-plus/dist/index.css'

import App from './App.vue'
import pinia from '@/stores'
import { router } from '@/router'
import 'default-passive-events'
import { i18n } from '@/i18n'
import icon from '@/plugins/icon'
import directives from '@/plugins/directives'
import { setupFormCreate } from '@/plugins/form-create'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)
// 注册图标
app.use(icon)
// 自定义指令
app.use(directives)
// 表单生成器
setupFormCreate(app)

app.mount('#app')
