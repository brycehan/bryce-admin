<template>
  <el-container class="layout-container layout-horizontal">
    <!-- 顶部导航 -->
    <el-header class="layout-header" :class="headerClass">
        <div style="display: flex; align-items: center">
          <Logo v-if="appStore.theme.showLogo" />
          <el-menu
            :default-active="route.path"
            :collapse-transition="false"
            mode="horizontal">
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
import { useRoute } from 'vue-router'
import { useRouterStore } from '@/stores/modules/router'
import HeaderRight from '@/components/layout/header/header-right/index.vue'
import { computed } from 'vue'

const route = useRoute()
const appStore = useAppStore()
const routerStore = useRouterStore()
const headerClass = computed(() => appStore.theme.headerStyle === 'primary' ? 'header-primary' : '')
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100%;

  .layout-header {
    --el-header-padding: 0;
    height: var(--theme-header-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--theme-header-bg-color);
    color: var(--theme-header-text-color);
    border-bottom: 1px solid var(--theme-border-color-light);

    .el-menu {
      display: flex;
      align-items: center;
      border-bottom: none;
      min-width: 800px;
      height: var(--theme-header-height);
      line-height: var(--theme-header-height);

      ::v-deep(.el-sub-menu) {
        height: var(--theme-header-height);
        line-height: var(--theme-header-height);
      }
    }
  }

  .layout-main {
    width: 100%;
    overflow: hidden;
    background-color: var(--theme-main-bg-color);
    padding: 0 !important;
    transition: all 0.3s;
  }
}
</style>
