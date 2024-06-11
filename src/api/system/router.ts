import { getNavApi } from '@/api/system/menu'
import { constantMenu, generateRoutes } from '@/router'
import type { RouteRecordRaw } from 'vue-router'

export const getMenuRoutes = async () => {
  const { data } = await getNavApi()
  const menuRoutes = [] as RouteRecordRaw[]
  menuRoutes.push(...generateRoutes(data))
  menuRoutes.push(...generateRoutes(constantMenu))

  return menuRoutes
}
