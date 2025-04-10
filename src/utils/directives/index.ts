import type { App } from 'vue'
import auth from '@/utils/directives/auth'

export default {
  install(Vue: App) {
    Vue.directive('auth', auth)
  }
}
