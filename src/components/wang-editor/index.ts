import type { App } from 'vue'
import WangEditor from './index.vue'

export default {
  install(Vue: App) {
    Vue.component('WangEditor', WangEditor)
  }
}
