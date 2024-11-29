import auth from '@/utils/directives/auth'
import authAnd from '@/utils/directives/authAnd'
import type { App } from 'vue'

export default {
  install(Vue: App) {
    Vue.directive('auth', auth)
    Vue.directive('auth-and', authAnd)
  }
}
