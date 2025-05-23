import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { themeConfig } from '@/stores/theme/config'

export const useAppStore = defineStore(
  'appStore',
  () => {
    // sidebar 是否展开
    const sidebarOpened = ref<boolean>(true)
    // 组件大小
    const componentSize = ref<'small' | 'default' | 'large' | 'xl' | '2xl'>('default')
    const mobile = ref(false) // 是否是移动端
    // 国际化语言
    const language = ref<string>('')
    // 国际化
    const { locale } = useI18n()
    // 主题
    const theme = ref<ThemeConfig>({ ...themeConfig })
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
    const setComponentSize = (size: 'default' | 'small' | 'large' | 'xl' | '2xl') => {
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
      // 如果已经初始化过，则不执行操作
      if (Array.isArray(icons.value) && icons.value.length > 0) return

      // 初始化图标
      try {
        // 使用 Promise 加载图标数据
        const ionIcons = await Promise.resolve(import('@iconify-json/ion/icons.json'))
        // 将加载的图标数据添加到 icons
        icons.value.push(...Object.keys(ionIcons.default.icons).map((icon) => ionIcons.default.prefix + ':' + icon))
      } catch (error) {
        icons.value = []
        console.error('加载图标数据失败:', error)
      }
    }

    /**
     * 切换布局
     *
     * @param layout 布局
     */
    const setLayout = (layout: string) => {
      if (mobile.value && layout !== 'vertical') {
        ElMessage.warning('移动端模式下不支持切换其他布局')
        return
      }
      theme.value!.layout = layout
    }

    const setTheme = (themeConf: ThemeConfig) => {
      theme.value = themeConf
    }

    /**
     * 重置主题
     */
    const resetTheme = () => {
      theme.value = themeConfig
    }

    return {
      title: import.meta.env.VITE_APP_TITLE,
      mobile,
      sidebarOpened,
      componentSize,
      language,
      locale,
      theme,
      icons,
      toggleSidebarOpened,
      setComponentSize,
      setLanguage,
      setLayout,
      setTheme,
      resetTheme,
      initIcons,
    }
  },
  {
    persist: true,
  },
)
