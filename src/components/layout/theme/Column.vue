<template>
  <el-container class="layout-container layout-column">
    <!-- 左侧菜单 -->
    <el-aside class="layout-sidebar aside-expend" :class="sidebarClass">
      <div class="sidebar-logo">
        <el-avatar src="/favicon.ico"></el-avatar>
      </div>
      <el-scrollbar>
        <div class="column-menu">
          <div
            v-for="menu in routerStore.menuRoutes"
            :key="menu.path"
            class="column-menu-item"
            :class="{ active: menuPath === menu.path }"
            @click="handleMenu(menu)"
          >
            <icon :icon="menu.meta?.icon" />
            <span class="title">{{ menu.meta?.title }}</span>
          </div>
        </div>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <!-- 顶部导航 -->
      <el-header class="layout-header" :style="layoutHeaderHeight">
        <Header />
      </el-header>
      <!-- 内容区域 -->
      <el-main class="layout-main">
        <div v-if="subMenus.length > 0 && appStore.sidebarOpened" class="column-sub-menu">
          <el-menu
            :default-active="defaultActive"
            :collapse="!appStore.sidebarOpened"
            :unique-opened="appStore.theme.uniqueOpened"
            :collapse-transition="false"
            mode="vertical">
            <menu-item
              v-for="menu in subMenus"
              :key="menu.path"
              :menu="menu"></menu-item>
          </el-menu>
        </div>
        <Main />
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import Header from '@/components/layout/header/index.vue'
import Main from '@/components/layout/main/index.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouterStore } from '@/stores/modules/router'
import { type RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import MenuItem from '@/components/layout/menu-item/index.vue'

const appStore = useAppStore()
const routerStore = useRouterStore()
const route = useRoute()
const router = useRouter()

const defaultActive = computed(() => route.path)
const subMenus = ref<any[]>([])
const menuPath = ref<string>('')

watch(route, ()=> {
  subMenus.value = []
  initSubMenu()
})

const initSubMenu = () => {
  menuPath.value = defaultActive.value
  for (const menu of routerStore.menuRoutes) {
    // 是否包含当前路由
    const exist = findRoute(menu.children as RouteRecordRaw[])
    if (exist) {
      subMenus.value = menu.children as RouteRecordRaw[]
      menuPath.value = menu.path
      break
    }
  }
}

onMounted(() => {
  initSubMenu()
})

const findRoute = (menus: RouteRecordRaw[]): boolean => {
  for (const menu of menus) {
    // 有子菜单的情况
    if (menu.children && menu.children.length > 0) {
      if (findRoute(menu.children)) {
        return true
      }
    }else if (menu.path === defaultActive.value) {
      return true
    }
  }
  return false
}

/**
 * 菜单点击事件
 *
 * @param menu 路由对象
 */
const handleMenu = (menu: any) => {
  if (menu.children && menu.children.length > 0) {
    const leafRoute = findLeafRoute(menu.children)
    router.push(leafRoute.path)
  } else {
    router.push(menu.path)
  }
}

/**
 * 递归查找叶子节点
 *
 * @param routes 路由表
 * @returns 路由对象
 */
const findLeafRoute: any = (routes: RouteRecordRaw[]): any => {
  if (!Array.isArray(routes) || routes.length === 0) return null
  for (const menu of routes) {
    if (Array.isArray(menu.children) && menu.children.length > 0) {
      return findLeafRoute(menu.children)
    } else {
      return menu
    }
  }
  return null
}

const sidebarClass = computed(() => {
  return appStore.theme.sidebarStyle === 'dark' ? 'sidebar-dark' : ''
})

const theme = computed(() => appStore.theme)
const layoutHeaderHeight = computed(() => {
  if (!theme.value.showTabsView) {
    return 'height: var(--theme-header-height) !important'
  } else {
    return ''
  }
})
</script>

<style scoped lang="scss">
// 侧边栏logo样式
.sidebar-logo {
  height: var(--theme-header-height);
  line-height: var(--theme-header-height);
  border-bottom: 1px solid var(--theme-border-color-light) !important;
  text-align: center;
  .el-avatar {
    width: 30px;
    height: 30px;
    vertical-align: middle;
  }
}

// 侧边栏菜单样式
.column-menu {
  flex: 1;
  // 主菜单样式
  .column-menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 70px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--el-menu-text-color);
    ::v-deep(.svg-icon) > svg {
      font-size: 21px;
    }
    .title {
      margin-top: 6px;
      font-size: 12px;
    }
    // 选中、hover主菜单样式
    &:hover, &.active {
      background: var(--el-color-primary);
      ::v-deep(.svg-icon) > svg, .title {
        color: white;
      }
    }
  }
}

// 中间栏菜单样式
.column-sub-menu {
  width: 120px;
  height: 100%;
  display: block;
  float: left;
  border-right: 1px solid var(--theme-border-color-light);
  background: white;
  overflow: hidden;
  ::v-deep(.el-menu) {
    border-right: none !important;
  }

  // 子菜单样式
  ::v-deep(.el-sub-menu) {
    font-size: 14px !important;
    color: var(--el-menu-text-color);
    background-color: transparent;
    .el-sub-menu__title {
      height: 40px !important;
      line-height: 40px !important;
      font-size: 14px !important;
      color: var(--el-menu-text-color);
      background-color: transparent;
      &:hover {
        color: var(--el-color-primary);
      }
    }
    &.is-active > .el-sub-menu__title {
      color: var(--el-menu-active-color);
    }
  }

  // 菜单项样式
  ::v-deep(.el-menu-item) {
    height: 40px !important;
    line-height: 40px !important;
    font-size: 14px !important;
    color: var(--el-menu-text-color);
    background-color: transparent;
    &:hover {
      color: var(--el-color-primary);
    }
    &.is-active {
      color: var(--el-menu-active-color);
      background-color: var(--theme-menu-active-bg-color);
    }
  }
}

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
    &.aside-expend {
      width: 75px !important;
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
  }
}
</style>
