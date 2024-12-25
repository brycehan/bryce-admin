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
          popper-class="sidebar-menu-popper"
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

const route = useRoute()
const appStore = useAppStore()
const routerStore = useRouterStore()

const sidebarClass = computed(() => {
  const sidebarOpened = appStore.sidebarOpened ? 'aside-expend' : 'aside-compress'
  const isDark = appStore.theme.sidebarStyle === 'dark' ? 'sidebar-dark' : ''
  return `${sidebarOpened} ${isDark}`
})
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100%;

  .layout-sidebar {
    background: var(--theme-menu-bg-color);
    border-right: 1px solid var(--theme-border-color-light);
    height: inherit;
    position: relative;
    display: flex;
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

    --el-menu-hover-bg-color: transparent;
    ::v-deep(.el-menu) {
      border-right: none !important;
      .el-sub-menu {
        .el-sub-menu__title {
          //height: 50px !important;
          overflow: hidden;
          &:hover {
            color: var(--theme-menu-hover-text-color);
          }
        }

        &.is-active > .el-sub-menu__title {
          color: var(--theme-menu-hover-text-color);
        }
      }

      .el-menu-item {
        overflow: hidden;
        height: 45px !important;
        line-height: 45px !important;
        &.is-active {
          background-color: var(--theme-menu-hover-bg-color);
          border-right: 2px solid var(--theme-menu-border-color);
          position: relative;
          //right: 0;
          overflow: hidden;
        }

        &:hover {
          color: var(--theme-menu-hover-text-color) !important;
        }
      }
    }
  }

  .layout-header {
    --el-header-padding: 0;
    display: flex;
    flex-direction: column;
    height: var(--theme-header-height);
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
