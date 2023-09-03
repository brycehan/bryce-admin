<template>
  <el-config-provider :locale="zhCn" :size="stores.appStore.componentSize">
    <RouterView />
  </el-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import stores from './stores'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>
