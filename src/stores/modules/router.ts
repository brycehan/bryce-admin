import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import type { Ref } from 'vue'
import { getNavApi } from '@/api/system/menu'
import { asyncRoute, constantRoutes, dashboardMenu, demoMenu, errorRoute, generateRoutes } from '@/router'

export const useRouterStore = defineStore(
  'routerStore',
  () => {
    // 菜单路由
    const menuRoutes: Ref<RouteRecordRaw[]> = ref<RouteRecordRaw[]>([])
    // 扁平化路由，用于搜索菜单，搜索菜单功能缓存
    const flatRoutes: Ref<RouteRecordRaw[]> = ref<RouteRecordRaw[]>([])
    // 所有路由
    const routes = ref<RouteRecordRaw[]>([])

    /**
     * 获取菜单路由
     */
    const initMenuRoutes = async () => {
      // 获取菜单路由
      const { data } = await getNavApi()
      const menuRouteList = [] as RouteRecordRaw[]
      menuRouteList.push(...generateRoutes(dashboardMenu))
      menuRouteList.push(...generateRoutes(data))
      // menuRouteList.push(...generateRoutes(demoMenu))

      menuRoutes.value = menuRouteList

      // 获取扁平化路由，将多级路由转换成一组路由
      flatRoutes.value = getFlatRoutes(menuRouteList, [])

      // 添加扁平化菜单路由
      asyncRoute.children!.push(...flatRoutes.value)

      // 保存路由数据
      routes.value = [...constantRoutes, asyncRoute, errorRoute]
    }

    /**
     * 获取扁平化路由，将多级路由转换成一级路由
     *
     * @param routes 路由列表
     * @param breadcrumb 面包屑
     * @returns 一级路由列表
     */
    const getFlatRoutes = (routes: RouteRecordRaw[], breadcrumb: string[]): RouteRecordRaw[] => {
      const flatRoutes: RouteRecordRaw[] = []
      routes.forEach((item: RouteRecordRaw) => {
        if (item.meta?.title) {
          breadcrumb.push(item.meta?.title as string)
        }

        if (item.children && item.children?.length > 0) {
          flatRoutes.push(...getFlatRoutes(item.children, breadcrumb))
        } else {
          ;(item.meta?.breadcrumb as string[]).push(...breadcrumb)
          flatRoutes.push(item)
        }
        breadcrumb.pop()
      })

      return flatRoutes
    }

    return {
      menuRoutes,
      flatRoutes,
      routes,
      initMenuRoutes,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)
