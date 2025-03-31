<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside class="layout-sidebar" :class="sidebarClass">
      <Logo v-if="appStore.theme.showLogo"/>
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
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
import { useRouter } from 'vue-router'
import { computed, unref } from 'vue'
import { useRouterStore } from '@/stores/modules/router'

const appStore = useAppStore()
const routerStore = useRouterStore()
const { currentRoute } = useRouter()

const sidebarClass = computed(() => {
  const sidebarOpened = appStore.sidebarOpened ? 'aside-expend' : 'aside-compress'
  const isDark = appStore.theme.sidebarStyle === 'dark' ? 'sidebar-dark' : ''
  return `${sidebarOpened} ${isDark}`
})

/**
 * 激活菜单
 */
const activeMenu = computed(() => {
  const { meta, path } = unref(currentRoute)
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

</script>

<style lang="scss" scoped>
// 布局容器
.layout-container {
  width: 100%;
  height: 100%;

  // 侧边栏
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

    // 侧边栏展开
    &.aside-expend {
      width: var(--theme-menu-width);
      transition: width 0.3s ease;
    }

    // 侧边栏收起
    &.aside-compress {
      width: var(--theme-menu-min-width);
      transition: width 0.3s ease;
    }

    // 菜单样式
    ::v-deep(.el-menu) {
      border-right: none !important;
      // 子菜单样式
      .el-sub-menu {
        .el-sub-menu__title:hover {
          color: var(--el-menu-hover-text-color);
        }
        &.is-active > .el-sub-menu__title {
          color: var(--el-menu-active-color);
        }
      }

      // 菜单项样式
      .el-menu-item {
        height: 44px;
        line-height: 44px;
        &:hover {
          color: var(--el-menu-hover-text-color) !important;
        }
        &.is-active {
          background-color: var(--theme-menu-active-bg-color);
          border-right: 2px solid var(--theme-menu-border-color);
        }
      }
    }
  }

  // 顶部区域
  .layout-header {
    --el-header-padding: 0;
    display: flex;
    flex-direction: column;
    height: var(--theme-header-height);
  }

  // 内容区域
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
