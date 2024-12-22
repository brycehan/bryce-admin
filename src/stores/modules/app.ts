import { defineStore } from 'pinia'
import { ref } from 'vue'
import storage from '@/utils/storage'

export const useAppStore = defineStore(
  'appStore',
  () => {
    // sidebar 是否展开
    const sidebarOpened = ref<boolean>(true)
    // 组件大小
    const componentSize = ref<string>()
    // 字典列表
    const dictList = ref<any>([])
    const theme = storage.getTheme()

    const toggleSidebarOpened = () => {
      sidebarOpened.value = !sidebarOpened.value
    }
    const setComponentSize = (size: string) => {
      componentSize.value = size
    }

    const setDictList = (dictSet: any[]) => {
      dictList.value = dictSet
    }
    const getDictList = () => {
      return dictList.value
    }

    return {
      sidebarOpened,
      componentSize,
      dictList,
      toggleSidebarOpened,
      setComponentSize,
      setDictList,
      getDictList,
      theme
    }
  },
  {
    persist: true
  }
)
