<template>
  <el-config-provider :locale="locale" :size="appStore.componentSize">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import { handleThemePrimary } from '@/utils/theme'
import { messages } from '@/i18n'
import { getDefaultLanguage } from '@/utils/tool'

const appStore = useAppStore()
const { locale: i18nLocale } = useI18n()
const locale = computed(() => {
  return messages[getLanguage()].el
})

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

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemePrimary(appStore.theme)
  })
})
</script>
