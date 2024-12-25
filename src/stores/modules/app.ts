import { defineStore } from 'pinia'
import { ref } from 'vue'
import storage from '@/utils/storage'
import { getDictListApi } from '@/api/system/dictType'

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

    /**
     * 获取字典列表
     */
    const getDictList = async () => {
      const { data } = await getDictListApi()
      return dictList.value = data || []
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
