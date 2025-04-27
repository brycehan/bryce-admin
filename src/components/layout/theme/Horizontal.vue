<template>
  <el-container class="layout-container layout-horizontal">
    <!-- 顶部导航 -->
    <el-header class="layout-header" :class="headerClass">
      <div class="flex">
        <Logo v-if="appStore.theme.showLogo" />
        <el-menu
          class="md:min-w-[200px] lg:w-[300px] xl:w-[400px] 2xl:w-[600px]"
          :default-active="route.path"
          :collapse-transition="false"
          mode="horizontal"
        >
          <menu-item v-for="menu in routerStore.menuRoutes" :key="menu.path" :menu="menu" />
        </el-menu>
      </div>
      <HeaderRight />
    </el-header>
    <!-- 内容区域 -->
    <el-main class="layout-main">
      <Main />
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import Logo from '@/components/layout/logo/index.vue'
import MenuItem from '@/components/layout/menu-item/index.vue'
import Main from '@/components/layout/main/index.vue'
import { useRouterStore } from '@/stores/modules/router'
import HeaderRight from '@/components/layout/header/header-right/index.vue'

const route = useRoute()
const appStore = useAppStore()
const routerStore = useRouterStore()
const headerClass = computed(() => (appStore.theme.headerStyle === 'primary' ? 'header-primary' : ''))
</script>

<style scoped lang="scss">
// 布局容器
.layout-container {
  width: 100%;
  height: 100%;

  // 顶部导航
  .layout-header {
    --el-header-padding: 0;

    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--theme-header-height);
    color: var(--theme-header-text-color);
    background: var(--theme-header-bg-color);
    border-bottom: 1px solid var(--theme-border-color-light);

    // 菜单
    .el-menu {
      display: flex;
      align-items: center;
      height: var(--theme-header-height);
      line-height: var(--theme-header-height);
      border-bottom: none;

      // 子菜单
      ::v-deep(.el-sub-menu) {
        height: var(--theme-header-height);
        line-height: var(--theme-header-height);
      }
    }
  }

  // 内容区域
  .layout-main {
    width: 100%;
    padding: 0 !important;
    overflow: hidden;
    background-color: var(--theme-main-bg-color);
    transition: all 0.3s;
  }
}
</style>
