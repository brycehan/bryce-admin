import type { App } from 'vue'
import { Icon } from '@iconify/vue/offline'

export default {
  install(Vue: App) {
    Vue.component('Icon', Icon)
  }
}
