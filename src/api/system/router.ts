import { getNavApi } from '@/api/system/menu'
import { constantMenu, dashboardMenu, generateRoutes } from '@/router'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 获取菜单路由
 */
export const getMenuRoutes = async () => {
  const { data } = await getNavApi()
  const menuRoutes = [] as RouteRecordRaw[]
  menuRoutes.push(...generateRoutes(dashboardMenu))
  menuRoutes.push(...generateRoutes(data))
  menuRoutes.push(...generateRoutes(constantMenu))

  return menuRoutes
}
