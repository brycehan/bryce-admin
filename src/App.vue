<template>
  <el-config-provider :locale="locale" :message="{ max: 5 }" :size="appStore.componentSize as any">
    <router-view :class="appStore.theme.greyMode ? 'grey-mode' : ''" />
  </el-config-provider>
</template>

<script setup lang="ts">
import { handleTabsViewChange, handleThemePrimary } from '@/utils/theme'
import { messages } from '@/i18n'
import { getDefaultLanguage, setCssVar } from '@/utils/tool'

const appStore = useAppStore()
const { locale: i18nLocale } = useI18n()
const locale = computed(() => messages[getLanguage()].el)
const { width } = useWindowSize()

/**
 * 获取语言
 */
const getLanguage = () => {
  let language = appStore.language
  if (!language) {
    language = getDefaultLanguage()
  }
  i18nLocale.value = language
  return language
}

const { setWatermark, clearWatermark } = useWatermark()

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemePrimary(appStore.theme)
    //  初始化Tabs视图高度的值
    handleTabsViewChange(appStore.theme)
    // 初始化水印
    setWatermark(appStore.theme.watermark)
  })
})

// 监听窗口变化
watch(
  () => width.value,
  (width: number) => {
    if (width < 768) {
      if (!appStore.mobile) appStore.mobile = true
      setCssVar('--app-aside-min-width', '0')
      if (appStore.sidebarOpened) appStore.toggleSidebarOpened()
      if (appStore.theme.layout !== 'vertical') appStore.setLayout('vertical')
    } else {
      if (appStore.mobile) appStore.mobile = false
      setCssVar('--app-aside-min-width', '64px')
    }
  },
  {
    immediate: true,
  },
)

onUnmounted(() => {
  clearWatermark()
})
</script>
