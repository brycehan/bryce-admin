<template>
  <div>
    <el-drawer
      v-model="visible"
      :title="t('settings.title')"
      :destroy-on-close="true"
      size="24rem"
      class="dark:!bg-[var(--el-bg-color-overlay)]"
    >
      <el-scrollbar class="text-gray-700">
        <div class="p-5">
          <!-- 布局切换 -->
          <el-divider content-position="left">{{ t('settings.layout.title') }}</el-divider>
          <layout-picker />

          <!-- 布局设置 -->
          <el-divider content-position="left">{{ t('settings.layout.setting') }}</el-divider>
          <layout-setting />

          <!-- 界面设置 -->
          <el-divider content-position="left">{{ t('settings.interface.title') }}</el-divider>
          <interface-setting />

          <!-- 信息tip -->
          <el-divider />
          <el-space direction="vertical" :fill="true">
            <el-alert :title="t('settings.tips')" type="warning" :closable="false" />
            <el-button type="primary" icon="CopyDocument" @click="handleCopyConfig">
              {{ t('settings.button.copyConfig') }}
            </el-button>
            <el-button type="info" icon="RefreshRight" class="w-full" @click="handleResetConfig">
              {{ t('settings.button.reset') }}
            </el-button>
          </el-space>
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
// 是否显示
import emitter from '@/utils/emitter'
import { ElMessage } from 'element-plus'

const visible = ref(false)
emitter.on('openThemeSetting', () => {
  visible.value = true
})

const appStore = useAppStore()
const { copy } = useClipboard()
const { t } = useI18n()

const theme = computed(() => appStore.theme)

/**
 * 复制主题配置
 */
const handleCopyConfig = () => {
  const config = JSON.stringify(theme.value, null, 2)
  copy(config)
  ElMessage.success(t('settings.copySuccess'))
}

/**
 * 重置主题配置
 */
const handleResetConfig = async () => {
  appStore.resetTheme()
  window.location.reload()
}
</script>

<style lang="scss" scoped>
::v-deep(.el-drawer) {
  --el-drawer-padding-primary: unset;
}

::v-deep(.el-alert__title) {
  font-size: 1rem;
  line-height: 1.71rem;
}
</style>
