import type { App } from 'vue'
import auth from '@/plugins/directives/auth.ts'

export default {
  install(Vue: App) {
    Vue.directive('auth', auth)
  },
}
