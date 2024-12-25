<template>
  <el-config-provider :locale="zhCn" :size="appStore.componentSize">
    <RouterView />
  </el-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { nextTick, onMounted } from 'vue'
import { handleThemePrimary } from '@/utils/theme'

const appStore = useAppStore()

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemePrimary(appStore.theme)
  })
})
</script>
