import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import type { Ref } from 'vue'
import { ref } from 'vue'

export const useRouterStore = defineStore(
  'routerStore',
  () => {
    const menuRoutes: Ref<RouteRecordRaw[]> = ref<RouteRecordRaw[]>([])
    const searchMenu: Ref<RouteRecordRaw[]> = ref<RouteRecordRaw[]>([])
    const routes = ref<RouteRecordRaw[]>([])

    /**
     * 获取菜单路由
     */
    const getMenuRoutes = () => {
      return menuRoutes.value
    }

    /**
     * 设置菜单路由
     * @param routesParam 路由
     */
    const setMenuRoutes = (routesParam: RouteRecordRaw[]) => {
      menuRoutes.value = routesParam
    }

    /**
     * 设置查询菜单列表
     * @param routeList 路由列表
     */
    const setSearchMenu = (routeList: RouteRecordRaw[]) => {
      searchMenu.value = routeList
    }

    const getRoutes = () => {
      return routes.value
    }

    const setRoutes = (routesParam: RouteRecordRaw[]) => {
      routes.value = routesParam
    }

    return {
      menuRoutes,
      routes,
      searchMenu,
      getMenuRoutes,
      setMenuRoutes,
      setSearchMenu,
      getRoutes,
      setRoutes
    }
  },
  {
    persist: true
  }
)
