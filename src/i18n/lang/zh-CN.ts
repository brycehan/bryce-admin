export default {
  home: '首页',
  app: {
    title: 'Bryce Admin',
    logoText: 'Bryce Admin',
    miniLogoText: 'Bryce',
  },
  settings: {
    title: '布局设置',
    sidebar: {
      dark: '暗色侧边栏',
      light: '亮色侧边栏',
    },
    header: {
      light: '亮色顶栏',
      primary: '主题色顶栏'
    },
    layout: {
      title: '布局切换',
      vertical: '纵向',
      column: '分栏',
      horizontal: '横向',
    },
    interface: {
      title: '界面设置',
      uniqueOpened: '侧栏排他展开',
      showLogo: '开启LOGO',
      showBreadcrumb: '开启面包屑',
      showTagsView: '开启标签页',
      showTagsViewCache: '开启标签页缓存',
    },
    tips: '设置之后仅是临时生效，要想永久生效，需点击下方的 "复制配置" 按钮，将配置替换到 /src/store/theme/config.ts 中。',
    button: {
      copyConfig: '复制配置',
      reset: '恢复默认',
    },
    copySuccess: '复制成功'
  },
  header: {
    size: {
      large: '大型',
      medium: '中型',
      small: '小型',
    },
  },
  main: {
    tabs: {
      close: '关闭当前',
      closeOthers: '关闭其他',
      closeAll: '关闭所有',
    },
    button: {
      add: '新增',
      edit: '修改',
      delete: '删除',
      export: '导出',
      import: '导入',
      search: '搜索',
      reset: '重置',
      searchHide: '隐藏搜索',
      searchShow: '显示搜索',
      cancel: '取消',
      confirm: '确定',
      back: '返回',
      close: '关闭',
      backToTop: '返回顶部',
      refresh: '刷新',
    }
  }
}
