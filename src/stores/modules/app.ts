import { defineStore } from 'pinia'
import { ref } from 'vue'
import storage from '@/utils/storage'
import { useI18n } from 'vue-i18n'

export const useAppStore = defineStore(
  'appStore',
  () => {
    // sidebar 是否展开
    const sidebarOpened = ref<boolean>(true)
    // 组件大小
    const componentSize = ref<'default' | 'small' | 'large'>('default')

    // 国际化语言
    const language = ref<string>('')
    // 国际化
    const { locale } = useI18n()
    // 主题
    const theme = storage.getTheme()
    // 图标json
    const icons = ref<string[]>([])

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
    const setComponentSize = (size: 'default' | 'small' | 'large') => {
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
     * 初始化图标json
     */
    const initIcons = async () => {
      icons.value = []
      try {
        // 使用 Promise 加载图标数据
        const ionIcons = await Promise.resolve(import('@iconify-json/ion/icons.json'))
        // 将加载的图标数据添加到 icons
        icons.value.push(...Object.keys(ionIcons.default.icons).map(icon => ionIcons.default.prefix + ':' + icon))
      } catch (error) {
        console.error('加载图标数据失败:', error);
      }
    }

    return {
      sidebarOpened,
      componentSize,
      language,
      locale,
      theme,
      icons,
      toggleSidebarOpened,
      setComponentSize,
      setLanguage,
      initIcons,
    }
  },
  {
    persist: true
  }
)
