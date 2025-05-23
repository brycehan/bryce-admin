<template>
  <el-container>
    <!-- 顶部区域 -->
    <el-header
      class="relative flex !h-[var(--app-header-height)] items-center justify-between border-b !border-[var(--app-border-color)] !px-0 dark:bg-[var(--el-bg-color-overlay)]"
    >
      <layout-logo v-if="appStore.theme.showLogo" />
      <layout-menu class="flex-1 overflow-hidden !border-b-0 px-5" :menu-routes="routerStore.menuRoutes" />
      <header-right />
    </el-header>
    <!-- 内容区域 -->
    <layout-main />
  </el-container>
</template>
<script setup lang="ts">
const appStore = useAppStore()
const routerStore = useRouterStore()
</script>
