import type { App } from 'vue'
import auth from '@/utils/directives/auth'
import authAnd from '@/utils/directives/authAnd'

export default {
  install(Vue: App) {
    Vue.directive('auth', auth)
    Vue.directive('auth-and', authAnd)
  }
}
