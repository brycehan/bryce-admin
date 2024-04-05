import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import type { Ref } from 'vue'
import { ref } from 'vue'

export const useRouterStore = defineStore(
  'routerStore',
  () => {
    const menuRoutes: Ref<RouteRecordRaw[]> = ref<RouteRecordRaw[]>([])
    const routes = ref<RouteRecordRaw[]>([])

    const getMenuRoutes = () => {
      return menuRoutes.value
    }
    const getRoutes = () => {
      return routes.value
    }

    const setMenuRoutes = (routesParam: RouteRecordRaw[]) => {
      menuRoutes.value = routesParam
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
