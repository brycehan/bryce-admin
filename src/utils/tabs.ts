import {useTabsStore} from "@/stores/modules/tabs";

/** 关闭标签页 */
export const closeTab = (router: any, tab: any) => {
  const tabsStore = useTabsStore()

  if (tab.meta && tab.meta.affix) {
    return
  }

  tabsStore.deleteView(tab)
  toLastView(router, tabsStore.visitedViews, tab)
}

/** 关闭其它标签页 */
export const closeOthersTabs = (router: any, tab: any) => {
  const  tabsStore = useTabsStore()

  router.push(tab)
  tabsStore.deleteOthersViews(tab)
}

/** 关闭全部标签页 */
export const closeAllTabs = (router: any, tab: any) => {
  const tabsStore = useTabsStore()

  tabsStore.deleteAllViews()
  toLastView(router, tabsStore.visitedViews, tab)
}

/** 跳转到最后一个标签页 */
export const toLastView = (router: any, visitedViews: any[], view: any) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    if (view.name === 'Home') {
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      console.log('toLastView:', view)

      router.push({ path: view.path })
    }
  }
}
