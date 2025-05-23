<template>
  <div class="dark:text-[#ddd]">
    <div class="flex items-center justify-between">
      <span>{{ t('settings.interface.uniqueOpened') }}</span>
      <el-switch v-model="theme.uniqueOpened" />
    </div>
    <div class="flex items-center justify-between">
      <span>{{ t('settings.interface.showLogo') }}</span>
      <el-switch v-model="theme.showLogo" />
    </div>
    <div class="flex items-center justify-between">
      <span>{{ t('settings.interface.showBreadcrumb') }}</span>
      <el-switch v-model="theme.showBreadcrumb" />
    </div>
    <div class="flex items-center justify-between">
      <span>{{ t('settings.interface.showTabsView') }}</span>
      <el-switch v-model="theme.showTabsView" @change="handleTabsViewChange" />
    </div>
    <div class="flex items-center justify-between">
      <span>{{ t('settings.interface.showTagsViewCache') }}</span>
      <el-switch v-model="theme.isTabsCache" />
    </div>
    <div class="flex items-center justify-between">
      <span>{{ t('settings.interface.footer') }}</span>
      <el-switch v-model="theme.showFooter" />
    </div>
    <div class="flex items-center justify-between">
      <span>{{ t('settings.interface.greyMode') }}</span>
      <el-switch v-model="theme.greyMode" />
    </div>
    <div class="flex items-center justify-between">
      <span>{{ t('settings.interface.watermark') }}</span>
      <el-input v-model="theme.watermark" placeholder="请输入水印内容" class="right-1 !w-2/3" @change="setWater()" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const appStore = useAppStore()
const theme = computed(() => appStore.theme)
const { setWatermark } = useWatermark()

/**
 * 切换Tabs视图
 *
 * @param show 显示或隐藏
 */
const handleTabsViewChange = (show: string | number | boolean) => {
  document.documentElement.style.setProperty('--app-main-tabs-height', show ? '40px' : '0px')
}

/**
 * 设置水印
 */
const setWater = () => {
  setWatermark(theme.value.watermark)
}

onMounted(() => {
  setWater()
})
</script>
