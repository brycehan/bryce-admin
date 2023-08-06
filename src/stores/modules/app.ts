import { defineStore } from 'pinia'
import { getSidebarOpened, setSidebarOpened } from '@/utils/storage'
export const appStore = defineStore('appStore', {
  state: () => ({
    sidebarOpened: getSidebarOpened()
  }),
  actions: {
    toggleSidebarOpened() {
      this.sidebarOpened = !this.sidebarOpened
      setSidebarOpened(this.sidebarOpened)
    }
  }
})
