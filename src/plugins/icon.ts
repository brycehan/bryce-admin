import type { App } from 'vue'
import { Icon, addCollection } from '@iconify/vue/offline'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import IonIconsJSON from '@iconify-json/ion/icons.json'
import ElementPlusIconsJSON from '@iconify-json/ep/icons.json'
import BrcIconsJSON from '@/assets/js/brc-icons.json'

export default {
  install(Vue: App) {
    // 添加离线图标库
    addCollection(IonIconsJSON)
    addCollection(ElementPlusIconsJSON)
    addCollection(BrcIconsJSON)

    Vue.component('Icon', Icon)
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      Vue.component(key, component)
    }
  }
}
