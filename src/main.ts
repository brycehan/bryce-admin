import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/styles/index.scss'
import '@/assets/js/iconfont.js'

import App from './App.vue'
import pinia from '@/stores'
import { router } from '@/router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import directives from '@/utils/directives'
import SvgIcon from '@/components/svg-icon'
import DictSelect from '@/components/dict-select'
import DictRadioGroup from '@/components/dict-radio-group'
import DictTableColumn from '@/components/dict-table-column'
import DictTag from '@/components/dict-tag'
import RightToolbar from '@/components/right-toolbar'
import SelectUser from '@/components/select-user'
import WangEditor from '@/components/wang-editor'
import 'default-passive-events'
import { i18n } from '@/i18n'
import { Icon, addCollection } from '@iconify/vue/offline';
import ElementPlusIconsJSON from '@iconify-json/ep/icons.json'

const app = createApp(App)

app.use(ElementPlus)

app.use(pinia)
app.use(router)
app.use(i18n)

// 自定义指令
app.use(directives)

app.use(SvgIcon)
app.use(DictSelect)
app.use(DictRadioGroup)
app.use(DictTableColumn)
app.use(DictTag)
app.use(RightToolbar)
app.use(SelectUser)
app.use(WangEditor)

// 添加离线图标库
addCollection(ElementPlusIconsJSON)

app.component('Icon', Icon)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
