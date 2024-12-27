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
    const componentSize = ref<string>('default')

    // 国际化语言
    const language = ref<string>('')
    // 主题
    const theme = storage.getTheme()
    // 字典列表
    const dictList = ref<any>([])

    /**
     * 切换侧边栏展开状态
     */
    const toggleSidebarOpened = () => {
      sidebarOpened.value = !sidebarOpened.value
    }

    /**
     * 设置组件大小
     *
     * @param size 组件大小
     */
    const setComponentSize = (size: string) => {
      componentSize.value = size
      storage.setComponentSize(size)
    }



    /**
     * 设置国际化语言
     *
     * @param locale 当前语言
     */
    const setLanguage = (locale: string) => {
      language.value = locale
      storage.setLanguage(locale)
    }
    /**
     * 获取字典列表
     */
    const getDictList = async () => {
      const { data } = await getDictListApi()
      return dictList.value = data || []
    }

    /**
     * 设置字典列表
     *
     * @param dictSet 字典列表
     */
    const setDictList = (dictSet: any[]) => {
      dictList.value = dictSet
    }

    return {
      sidebarOpened,
      componentSize,
      language,
      theme,
      dictList,
      toggleSidebarOpened,
      setComponentSize,
      setLanguage,
      getDictList,
      setDictList,
    }
  },
  {
    persist: true
  }
)
