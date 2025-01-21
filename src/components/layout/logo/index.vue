<template>
  <div v-if="appStore.sidebarOpened" class="sidebar-logo">
    <el-avatar src="/favicon.ico"></el-avatar>
    <span class="logo-title">布莱斯管理系统</span>
  </div>
  <div v-else class="sidebar-logo sidebar-logo-expend">
    <el-avatar src="/favicon.ico"></el-avatar>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()
</script>
<style scoped lang="scss">
.sidebar-logo {
  width: var(--theme-menu-width) !important;
  height: var(--theme-header-height);
  line-height: var(--theme-header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-logo-text-color);

  .el-avatar {
    width: 25px;
    height: 25px;
  }

  .logo-title {
    margin-left: 10px;
  }
}

.sidebar-logo-expend {
  width: 100% !important;
}
</style>
