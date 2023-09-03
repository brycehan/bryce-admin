import { defineStore } from 'pinia'
import storage from '@/utils/storage'
export const appStore = defineStore('appStore', {
  state: () => ({
    // sidebar 是否展开
    sidebarOpened: storage.getSidebarOpened(),
    // 组件大小
    componentSize: storage.getComponentSize()
  }),
  actions: {
    toggleSidebarOpened() {
      this.sidebarOpened = !this.sidebarOpened
      storage.setSidebarOpened(this.sidebarOpened)
    },
    setComponentSize(size: string) {
      this.componentSize = size
      storage.setComponentSize(size)
    }
  }
})
