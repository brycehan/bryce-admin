import { authStore } from '@/stores/modules/auth'
import { routerStore } from '@/stores/modules/router'
import { appStore } from '@/stores/modules/app'
import { tabsStore } from '@/stores/modules/tabs'

const stores: any = {}

export const registerStore = () => {
  stores.authStore = authStore()
  stores.routerStore = routerStore()
  stores.appStore = appStore()
  stores.tabsStore = tabsStore()
}

export default stores
