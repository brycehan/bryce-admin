import { nav } from '@/api/auth/auth'
import { constantMenu, generateRoutes } from '@/router'
import type { RouteRecordRaw } from 'vue-router'

export const getMenuRoutes = async () => {
  const { data } = await nav()
  const menuRoutes = [] as RouteRecordRaw[]
  menuRoutes.push(...generateRoutes(data))
  menuRoutes.push(...generateRoutes(constantMenu))

  return menuRoutes
}
