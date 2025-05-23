/**
 * 关闭标签页
 *
 * @param router 路由
 * @param tab 标签页
 */
export const closeTab = (router: any, tab: any) => {
  const tabsStore = useTabsStore()

  if (tab.meta && tab.meta.affix) {
    return
  }

  tabsStore.deleteView(tab)
  toLastView(router, tabsStore.visitedViews, tab)
}

/**
 * 关闭其它标签页
 *
 * @param router 路由
 * @param tab 标签页
 */
export const closeOthersTabs = (router: any, tab: any) => {
  const tabsStore = useTabsStore()

  router.push(tab)
  tabsStore.deleteOthersViews(tab)
}

/**
 * 关闭全部标签页
 *
 * @param router 路由
 * @param tab 标签页
 */
export const closeAllTabs = (router: any, tab: any) => {
  const tabsStore = useTabsStore()

  tabsStore.deleteAllViews()
  toLastView(router, tabsStore.visitedViews, tab)
}

/**
 * 跳转到最后一个访问的标签页
 *
 * 此函数的目的是根据用户之前访问的视图记录，导航回到最后一个访问的视图
 * 如果没有之前的视图记录，并且当前视图为首页时，会重定向到特定的路径
 * 如果既没有之前的视图记录，当前视图也不是首页，则导航到当前视图的路径
 *
 * @param router 路由器实例，用于导航
 * @param visitedViews 用户访问过的视图数组
 * @param view 当前视图
 */
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
