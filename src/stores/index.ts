import { authStore } from '@/stores/modules/auth'

const stores: any = {}

export const registerStore = () => {
  stores.authStore = authStore()
}

export default stores
