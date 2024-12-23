export interface Theme {
  /**
   * 侧边栏风格 [light、dark]
   */
  sidebarStyle: string
  /**
   * 顶栏风格 [light、primary]
   */
  headerStyle: string
  /**
   * 主题色
   */
  primaryColor: string
  /**
   * 布局风格 [vertical、column、transverse]
   */
  layout: string
  /**
   * 侧边栏是否只保持一个子菜单的展开
   */
  uniqueOpened: boolean
  /**
   * 是否显示Logo
   */
  showLogo: boolean
  /**
   * 是否显示面包屑
   */
  showBreadcrumb: boolean
  /**
   * 是否显示多标签页
   */
  showTabsView: boolean
  /**
   * 是否开启多标签页缓存
   */
  isTabsCache: boolean
}
