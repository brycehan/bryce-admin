import { defineStore } from 'pinia'
import storage from '@/utils/storage'
import {dictList} from "@/api/system/dictType";
export const useAppStore = defineStore('appStore', {
  state: () => ({
    // sidebar 是否展开
    sidebarOpened: storage.getSidebarOpened(),
    // 组件大小
    componentSize: storage.getComponentSize(),
    // 字典列表
    dictList: []
  }),
  actions: {
    toggleSidebarOpened() {
      this.sidebarOpened = !this.sidebarOpened
      storage.setSidebarOpened(this.sidebarOpened)
    },
    setComponentSize(size: string) {
      this.componentSize = size
      storage.setComponentSize(size)
    },
    async getDictList() {
      const { data } = await dictList()
      this.dictList = data || []
    }
  }
})
