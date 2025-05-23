<template>
  <el-container>
    <!-- 左侧区域 -->
    <el-aside :class="sidebarClass" class="!w-[75px] !overflow-hidden">
      <layout-logo />
      <el-scrollbar>
        <div
          class="h-[calc(100vh-var(--app-header-height))] flex-col dark:border-r dark:border-[var(--app-border-color)]"
          :class="{
            'border-r border-[var(--app-border-color)]': appStore.theme.sidebarStyle === 'light',
          }"
        >
          <div
            v-for="menu in routerStore.menuRoutes"
            :key="menu.path"
            :class="{ active: menuPath === menu.path }"
            class="column-menu-item"
            @click="handleMenu(menu)"
          >
            <icon :icon="menu.meta?.icon" />
            <span class="mt-2 text-sm">{{ menu.meta?.title }}</span>
          </div>
        </div>
      </el-scrollbar>
    </el-aside>
    <!-- 右侧区域 -->
    <el-container class="!flex-col">
      <!-- 顶部导航 -->
      <layout-header class="border-b !border-[var(--app-border-color)]" />
      <!-- 内容区域 -->
      <el-main class="!flex w-full overflow-hidden bg-[var(--app-main-bg-color)] !p-0">
        <layout-menu v-if="subMenus.length > 0 && appStore.sidebarOpened" :menu-routes="subMenus" />
        <layout-main />
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import { type RouteRecordRaw } from 'vue-router'

const appStore = useAppStore()
const routerStore = useRouterStore()
const route = useRoute()
const router = useRouter()

const defaultActive = computed(() => route.path)
const subMenus = ref<any[]>([])
const menuPath = ref<string>('')

watch(route, () => {
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

const findRoute = (menus: RouteRecordRaw[]): boolean => {
  for (const menu of menus) {
    // 有子菜单的情况
    if (menu.children && menu.children.length > 0) {
      if (findRoute(menu.children)) {
        return true
      }
    } else if (menu.path === defaultActive.value) {
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
const handleMenu = (menu: RouteRecordRaw) => {
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
    if (menu.children?.length) {
      return findLeafRoute(menu.children)
    } else {
      return menu
    }
  }
  return null
}

const sidebarClass = computed(() => {
  return appStore.theme.sidebarStyle === 'dark' ? 'sidebar-dark' : 'sidebar-light'
})

onMounted(() => {
  initSubMenu()
})
</script>

<style scoped lang="scss">
// 主菜单样式
.column-menu-item {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 5rem;
  color: var(--el-menu-text-color);
  cursor: pointer;
  transition: all 0.3s ease;

  // hover主菜单样式
  &:hover {
    color: var(--el-menu-hover-text-color);
  }

  // 激活主菜单样式
  &.active {
    color: white;
    background: var(--el-color-primary);
  }
}

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
}
</style>
