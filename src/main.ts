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

import directives from "@/utils/directives";
import SvgIcon from "@/components/svg-icon";
import DictSelect from "@/components/dict-select";
import DictRadioGroup from "@/components/dict-radio-group";
import DictTableColumn from "@/components/dict-table-column";
import SelectUser from "@/components/select-user";
import WangEditor from "@/components/wang-editor";

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn
})
app.use(createPinia())
// 注册 Pinia
registerStore()

// 自定义指令
app.use(directives)

app.use(router)

app.use(SvgIcon)
app.use(DictSelect)
app.use(DictRadioGroup)
app.use(DictTableColumn)
app.use(SelectUser)
app.use(WangEditor)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
