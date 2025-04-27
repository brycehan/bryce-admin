import { defineStore } from 'pinia'
import { type RouteLocationNormalizedLoaded } from 'vue-router'
import { ref } from 'vue'

export const useTabsStore = defineStore(
  'tabsStore',
  () => {
    // 已访问的视图
    const visitedViews = ref<any[]>([])
    // 缓存视图
    const cachedViews = ref<any[]>([])

    /**
     * 添加新的视图到已访问视图列表中。
     *
     * @param view - 要添加的视图的路由信息
     */
    const addView = (view: RouteLocationNormalizedLoaded) => {
      if (visitedViews.value.some((value) => value.path === view.path)) {
        return
      }
      visitedViews.value.push(
        Object.assign({}, view, {
          title: view.meta?.title || 'unknown',
        }),
      )
    }

    /**
     * 添加视图到缓存视图列表中。
     *
     * @param view - 要添加的视图的路由信息
     */
    const addCachedView = (view: RouteLocationNormalizedLoaded) => {
      if (cachedViews.value.includes(view.name)) {
        return
      }
      if (view.meta.cache) {
        cachedViews.value.push(view.name)
      }
    }

    /**
     * 删除视图。
     *
     * @param view - 要删除的视图的路由信息
     */
    const deleteView = (view: RouteLocationNormalizedLoaded) => {
      for (const [i, v] of visitedViews.value.entries()) {
        if (v.path === view.path) {
          visitedViews.value.splice(i, 1)
          break
        }
      }
      deleteCachedView(view).then()
    }

    /**
     * 删除缓存视图。
     *
     * @param view - 要删除的视图的路由信息
     */
    const deleteCachedView = (view: RouteLocationNormalizedLoaded) => {
      return new Promise((resolve) => {
        const index = cachedViews.value.indexOf(view.name)
        if (index > -1) {
          cachedViews.value.splice(index, 1)
        }
        resolve([...cachedViews.value])
      })
    }

    /**
     * 删除其他视图。
     *
     * @param view - 要删除的视图的路由信息
     */
    const deleteOthersViews = (view: RouteLocationNormalizedLoaded) => {
      visitedViews.value = visitedViews.value.filter((v) => {
        return v.meta.affix || v.path === view.path
      })
      const index = cachedViews.value.indexOf(view.name)
      if (index > -1) {
        cachedViews.value = cachedViews.value.slice(index, index + 1)
      } else {
        cachedViews.value = []
      }
    }

    /**
     * 删除所有视图。
     */
    const deleteAllViews = () => {
      visitedViews.value = visitedViews.value.filter((tab) => tab.meta.affix)
      cachedViews.value = []
    }

    return {
      visitedViews,
      cachedViews,
      addView,
      addCachedView,
      deleteView,
      deleteCachedView,
      deleteOthersViews,
      deleteAllViews,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)
