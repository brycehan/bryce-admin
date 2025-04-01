import { defineStore } from 'pinia'
import { ref } from 'vue'
import storage from '@/utils/storage'
import { getDictListApi } from '@/api/system/dictType'
import { useI18n } from 'vue-i18n'

export const useAppStore = defineStore(
  'appStore',
  () => {
    // sidebar 是否展开
    const sidebarOpened = ref<boolean>(true)
    // 组件大小
    const componentSize = ref<string>('default')

    // 国际化语言
    const language = ref<string>('')
    // 国际化
    const { locale } = useI18n()
    // 主题
    const theme = storage.getTheme()
    // 字典列表
    const dictList = ref<any>([])
    // 图标json
    const iconJsons = ref<any>([])

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
    }

    /**
     * 设置国际化语言
     *
     * @param lang 当前语言
     */
    const setLanguage = (lang: string) => {
      language.value = lang
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
      locale,
      theme,
      dictList,
      iconJsons,
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
