export interface ThemeConfig {
  /**
   * 布局风格 [vertical、column、horizontalOne、horizontalTwo]
   */
  layout: string
  /**
   * 侧边栏风格 [light、dark]
   */
  sidebarStyle: string
  /**
   * 顶栏风格 [light、primary]
   */
  headerStyle: string
  /**
   * 侧边栏颜色
   */
  sidebarColor: string
  /**
   * 主题色
   */
  primaryColor: string
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
  /**
   * 是否显示页脚
   */
  showFooter: boolean
  /**
   * 是否开启灰色模式
   */
  greyMode: boolean
  /**
   * 是否开启水印
   */
  watermark: string
}
