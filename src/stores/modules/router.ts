import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { getNavApi } from '@/api/system/menu'
import { constantMenu, dashboardMenu, generateRoutes } from '@/router'

export const useRouterStore = defineStore(
  'routerStore',
  () => {
    const menuRoutes: Ref<RouteRecordRaw[]> = ref<RouteRecordRaw[]>([])
    const routes = ref<RouteRecordRaw[]>([])

    /**
     * 获取菜单路由
     */
    const  getMenuRoutes =  async () => {
      const { data } = await getNavApi()
      const menuRoutes = [] as RouteRecordRaw[]
      // Dashboard菜单
      menuRoutes.push(...generateRoutes(dashboardMenu))
      // 后端菜单
      menuRoutes.push(...generateRoutes(data))
      // 常量菜单
      menuRoutes.push(...generateRoutes(constantMenu))
      console.log('menuRoutes', menuRoutes)
      return menuRoutes
    }

    /**
     * 设置菜单路由
     * @param routesParam 路由
     */
    const setMenuRoutes = (routesParam: RouteRecordRaw[]) => {
      menuRoutes.value = routesParam
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
      getMenuRoutes,
      setMenuRoutes,
      getRoutes,
      setRoutes
    }
  },
  {
    persist: true
  }
)
