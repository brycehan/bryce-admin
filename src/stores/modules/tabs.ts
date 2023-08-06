import { defineStore } from 'pinia'
import { type RouteLocationNormalizedLoaded } from 'vue-router'

export const tabsStore = defineStore('tabsStore', {
  state: () => ({
    visitedViews: [] as any[],
    cachedViews: [] as any[]
  }),
  actions: {
    addView(view: RouteLocationNormalizedLoaded){

    },
    addCachedView(view:RouteLocationNormalizedLoaded){

    },
    deleteView(view: RouteLocationNormalizedLoaded){

    },
    deleteCachedView(view: RouteLocationNormalizedLoaded){

    },
    deleteOthersViews(){

    },
    deleteAllViews(){
        
    }
  }
})
