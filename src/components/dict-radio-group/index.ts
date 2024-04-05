import type { App } from 'vue'
import DictRadioGroup from './dict-radio-group.vue'

export default {
  install(Vue: App) {
    Vue.component('DictRadioGroup', DictRadioGroup)
  }
}
