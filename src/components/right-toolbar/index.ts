import type { App } from 'vue'
import RightToolbar from './right-toolbar.vue'

export default {
  install(Vue: App) {
    Vue.component('RightToolbar', RightToolbar)
  }
}
