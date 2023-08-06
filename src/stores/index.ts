import { authStore } from '@/stores/modules/auth'
import { routerStore } from '@/stores/modules/router'
import { appStore } from '@/stores/modules/app'

const stores: any = {}

export const registerStore = () => {
  stores.authStore = authStore()
  stores.routerStore = routerStore()
  stores.appStore = appStore()
}

export default stores
