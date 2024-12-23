<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside class="layout-sidebar" :class="sidebarClass">
      <Logo v-if="appStore.theme.showLogo"/>
      <el-scrollbar>
        <el-menu
          :default-active="route.path"
          :collapse="!appStore.sidebarOpened"
          :unique-opened="appStore.theme.uniqueOpened"
          :collapse-transition="false"
          mode="vertical"
        >
          <MenuItem v-for="menu in routerStore.menuRoutes" :key="menu.path" :menu="menu" />
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <!-- 顶部导航 -->
      <el-header class="layout-header" >
        <Header />
      </el-header>
      <!-- 内容区域 -->
      <el-main class="layout-main">
        <Main />
      </el-main>
    </el-container>
  </el-container>
  <settings />
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import Logo from '@/components/layout/logo/index.vue'
import MenuItem from '@/components/layout/menu-item/index.vue'
import Header from '@/components/layout/header/index.vue'

import Main from '@/components/layout/main/index.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useRouterStore } from '@/stores/modules/router'
import Settings from '@/components/layout/settings/index.vue'

const route = useRoute()
const appStore = useAppStore()
const routerStore = useRouterStore()

const sidebarClass = computed(() => {
  const sidebarOpened = appStore.sidebarOpened ? 'aside-expend' : 'aside-compress'
  const isDark = appStore.theme.sidebarStyle === 'dark' ? 'sidebar-dark' : ''
  return `${sidebarOpened} ${isDark}`
})
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100%;

  .layout-sidebar {
    height: inherit;
    background: var(--theme-menu-bg-color);
    border-right: 1px solid var(--theme-border-color-light);
    display: flex;
    position: relative;
    flex-direction: column;
    overflow-x: hidden !important;

    .el-scrollbar__view {
      overflow: hidden;
    }

    &.aside-expend {
      width: var(--theme-menu-width) !important;
      transition: width 0.3s ease;
    }

    &.aside-compress {
      width: var(--theme-menu-min-width) !important;
      transition: width 0.3s ease;
    }
  }

  .layout-header {
    display: flex;
    flex-direction: column;
    height: var(--theme-header-height);
    --el-header-padding: 0;
  }

  .layout-main {
    width: 100%;
    overflow: hidden;
    background-color: var(--theme-main-bg-color);
    padding: 0 !important;
    transition: all 0.3s;
    border-top: 1px solid var(--theme-border-color-light);
  }
}
</style>
