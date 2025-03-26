import type { App } from 'vue'
import DictTag from './dict-tag.vue'

export default {
  install(Vue: App) {
    Vue.component('DictTag', DictTag)
  }
}
