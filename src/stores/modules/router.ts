import { defineStore } from 'pinia'
import { navigation } from '@/api/auth'
import { generateRoutes, constantMenu } from '@/router'
import type { RouteRecordRaw } from 'vue-router'

export const routerStore = defineStore('routerStore', {
  state: () => ({
    menuRoutes: [] as RouteRecordRaw[],
    routes: [] as RouteRecordRaw[]
  }),
  actions: {
    async getMenuRoutes() {
      const { data } = await navigation()
      this.menuRoutes.push(...generateRoutes(data))
      const constMenu = generateRoutes(constantMenu)
      debugger
      this.menuRoutes.push(...generateRoutes(constantMenu))

      return this.menuRoutes
    },
    setRoutes(routes: RouteRecordRaw[]) {
      this.routes = routes
    }
  }
})
