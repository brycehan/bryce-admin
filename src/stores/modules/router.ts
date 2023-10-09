import { defineStore } from 'pinia'
import { nav } from '@/api/system/auth'
import { generateRoutes, constantMenu } from '@/router'
import type { RouteRecordRaw } from 'vue-router'

export const routerStore = defineStore('routerStore', {
  state: () => ({
    menuRoutes: [] as RouteRecordRaw[],
    routes: [] as RouteRecordRaw[]
  }),
  actions: {
    async getMenuRoutes() {
      const { data } = await nav()
      this.menuRoutes = []
      this.menuRoutes.push(...generateRoutes(data))
      this.menuRoutes.push(...generateRoutes(constantMenu))

      return this.menuRoutes
    },
    setRoutes(routes: RouteRecordRaw[]) {
      this.routes = routes
    }
  }
})
