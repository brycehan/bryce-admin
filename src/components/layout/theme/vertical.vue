<template>
  <el-container class="h-full">
    <!-- 左侧菜单 -->
    <el-aside
      class="!overflow-hidden transition-[width] duration-300 ease-in-out dark:border-r dark:border-[var(--app-border-color)]"
      :class="sidebarClass"
    >
      <layout-logo />
      <layout-menu :menu-routes="routerStore.menuRoutes" />
    </el-aside>
    <!-- 右侧区域 -->
    <el-container class="!flex-col overflow-hidden">
      <!-- 顶部导航 -->
      <layout-header class="border-b !border-[var(--app-border-color)]" />
      <!-- 内容区域 -->
      <layout-main />
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
const appStore = useAppStore()
const routerStore = useRouterStore()

const sidebarClass = computed(() => {
  const sidebarOpened = appStore.sidebarOpened ? '!w-[var(--app-aside-width)]' : '!w-[var(--app-aside-min-width)]'
  const isDark = appStore.theme.sidebarStyle === 'dark' ? 'sidebar-dark' : 'sidebar-light'
  return `${sidebarOpened} ${isDark}`
})
</script>

<style lang="scss" scoped>
/*
 * 侧边栏暗色
 */
.sidebar-dark {
  --app-aside-active-bg-color: var(--el-color-primary);
  --el-menu-active-color: #eee;
  --el-menu-text-color: rgb(255 255 255 / 66%);
  --el-menu-hover-text-color: #eee;

  background: var(--app-aside-bg-dark);
}

.sidebar-light {
  background: var(--app-aside-bg-light);
  border-right: 1px solid var(--app-border-color);
}
</style>
