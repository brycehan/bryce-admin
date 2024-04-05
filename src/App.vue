<template>
  <el-config-provider :locale="zhCn" :size="appStore.componentSize">
    <RouterView />
  </el-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const appStore = useAppStore()
</script>
