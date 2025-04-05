import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { isExternalLink } from '@/utils/tool'
import { useAuthStore } from '@/stores/modules/auth'
import { useAppStore } from '@/stores/modules/app'
import { useRouterStore } from '@/stores/modules/router'

NProgress.configure({ showSpinner: false })

/**
 * 常量路由
 */
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/redirect',
    component: () => import('@/components/layout/index.vue'),
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/components/layout/router/Redirect.vue')
      }
    ]
  },
  {
    path: '/404',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/404.vue')
  },
]

/**
 * 异步路由
 */
const asyncRoute: RouteRecordRaw = {
  path: '/',
  component: () => import('@/components/layout/index.vue'),
  redirect: '/dashboard/index',
  children: [
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/profile/index.vue'),
      meta: {
        title: 'profile.title',
        i18n: true,
        cache: true,
        breadcrumb: ['profile.title'],
      }
    },
    {
      path: '/bpm/model/add',
      name: 'BpmModelAdd',
      component: () => import('@/views/bpm/model/form/index.vue'),
      meta: {
        title: '创建流程',
        i18n: false,
        cache: false,
        breadcrumb: ['流程管理', '流程模型', '创建流程'],
        activeMenu: '/bpm/model/index'
      }
    },
    {
      path: '/bpm/model/edit/:id',
      name: 'BpmModelEdit',
      component: () => import('@/views/bpm/model/form/index.vue'),
      meta: {
        title: '修改流程',
        i18n: false,
        cache: false,
        breadcrumb: ['流程管理', '流程模型', '修改流程'],
        activeMenu: '/bpm/model/index'
      }
    },
    {
      path: '/bpm/process-instance/manager/:id',
      name: 'BpmProcessInstanceManagerDetail',
      component: () => import('@/views/bpm/process-instance/detail/index.vue'),
      meta: {
        title: '流程详情',
        i18n: false,
        cache: false,
        breadcrumb: ['审批中心', '流程实例', '流程详情'],
        activeMenu: '/bpm/process-instance/manager'
      }
    },
    {
      path: '/bpm/process-instance/my/:id',
      name: 'BpmProcessInstanceMyDetail',
      component: () => import('@/views/bpm/process-instance/detail/index.vue'),
      meta: {
        title: '流程详情',
        i18n: false,
        cache: false,
        breadcrumb: ['审批中心', '我的流程', '流程详情'],
        activeMenu: '/bpm/process-instance/my'
      }
    },
    {
      path: '/bpm/task/manager/:id',
      name: 'BpmTaskManagerDetail',
      component: () => import('@/views/bpm/process-instance/detail/index.vue'),
      meta: {
        title: '流程详情',
        i18n: false,
        cache: false,
        breadcrumb: ['审批中心', '流程任务', '流程详情'],
        activeMenu: '/bpm/task/manager'
      }
    },
    {
      path: '/bpm/task/todo/:id',
      name: 'BpmTaskTodoDetail',
      component: () => import('@/views/bpm/process-instance/detail/index.vue'),
      meta: {
        title: '流程详情',
        i18n: false,
        cache: false,
        breadcrumb: ['审批中心', '待办任务', '流程详情'],
        activeMenu: '/bpm/task/todo'
      }
    },
    {
      path: '/bpm/task/done/:id',
      name: 'BpmTaskDoneDetail',
      component: () => import('@/views/bpm/process-instance/detail/index.vue'),
      meta: {
        title: '流程详情',
        i18n: false,
        cache: false,
        breadcrumb: ['审批中心', '已办任务', '流程详情'],
        activeMenu: '/bpm/task/done'
      }
    },
    {
      path: '/bpm/task/copy/:id',
      name: 'BpmTaskCopyDetail',
      component: () => import('@/views/bpm/process-instance/detail/index.vue'),
      meta: {
        title: '流程详情',
        i18n: false,
        cache: false,
        breadcrumb: ['审批中心', '抄送我的', '流程详情'],
        activeMenu: '/bpm/task/copy'
      }
    },
  ]
}

/**
 * 错误路由
 */
export const errorRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)',
  redirect: '/404'
}

/**
 * 配置Dashboard菜单
 */
export const dashboardMenu = [
  {
    id: -1,
    name: 'Dashboard',
    url: null,
    icon: 'ion:grid-outline',
    type: 'C',
    visible: 1,
    children: [
      {
        id: -11,
        name: '首页',
        url: 'dashboard/index',
        icon: 'ion:home-outline',
        type: 'M',
        visible: 1,
        affix: true,
      }
    ]
  },
]

/**
 * 配置示例菜单
 */
export const demoMenu = [
  {
    id: -2,
    name: 'Demo',
    url: null,
    icon: 'ion:apps-outline',
    type: 'C',
    visible: 1,
    children: [
      {
        id: -21,
        name: 'Icon 图标',
        url: 'demo/icons/index',
        icon: 'ion:list-outline',
        type: 'M',
        visible: 1,
      },
      {
        id: -22,
        name: '二维码生成',
        url: 'demo/qrcode/index',
        icon: 'ion:qr-code-outline',
        type: 'M',
        visible: 1,
      },
      {
        id: -23,
        name: '页面打印',
        url: 'demo/printJs/index',
        icon: 'ion:print-outline',
        type: 'M',
        visible: 1,
      },
      {
        id: -24,
        name: '图片裁剪',
        url: 'demo/cropper/index',
        icon: 'ion:cut-outline',
        type: 'M',
        visible: 1,
      },
      {
        id: -25,
        name: 'Markdown',
        url: 'demo/markdown/index',
        icon: 'ion:logo-markdown',
        type: 'M',
        visible: 1,
      },
      {
        id: -26,
        name: 'ECharts图表',
        url: 'demo/echarts/index',
        icon: 'ion:bar-chart-outline',
        type: 'M',
        visible: 1,
      }
    ]
  }
]

// 创建路由，hash模式， history模式 参数一样的写法
export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL), // hash模式
  routes: constantRoutes
})

// 白名单列表
const whiteList = ['/login']

// 路由跳转前
router.beforeEach(async (to, _from, next) => {
  NProgress.start()

  const authStore = useAuthStore()
  const appStore = useAppStore()
  const routerStore = useRouterStore()

  // token存在的情况
  if (authStore.accessToken) {
    if (to.path === '/login') {
      next('/dashboard/index')
    } else {
      // 用户信息不存在，则重新拉取
      if (!authStore.user.id) {
        try {
          await authStore.getCurrentUser()
          await authStore.getAuthoritySet()
          await appStore.getDictList()
          await appStore.initIcons()
        } catch (error) {
          console.error('router.beforeEach', error)

          // 请求异常，则跳转到登录页
          authStore?.removeToken()
          next('/login')
          return Promise.reject(error)
        }

        // 动态菜单
        const menuRoutes = await routerStore.getMenuRoutes()
        routerStore.setMenuRoutes(menuRoutes)

        // 获取扁平化路由，将多级路由转换成一组路由
        const flatRoutes = getFlatRoutes(menuRoutes, [])

        // 设置搜索菜单，搜索菜单功能缓存
        routerStore.setSearchMenu(flatRoutes)

        // 添加菜单路由
        asyncRoute.children.push(...flatRoutes)

        router.addRoute(asyncRoute)
        router.addRoute(errorRoute)

        const allRoutes = [...constantRoutes, asyncRoute, errorRoute]
        // 保存路由数据
        routerStore.setRoutes(allRoutes)

        next({ ...to, replace: true })
      } else {
        next()
      }
    }
  } else {
    // 没有token的情况下，可以进入白名单
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
})

// 路由加载后
router.afterEach(() => {
  NProgress.done()
})

/**
 * 获取扁平化路由，将多级路由转换成一级路由
 *
 * @param routes 路由列表
 * @param breadcrumb 面包屑
 * @returns 一级路由列表
 */
export const getFlatRoutes = (routes: RouteRecordRaw[], breadcrumb: string[]): RouteRecordRaw[] => {
  const flatRoutes: RouteRecordRaw[] = []
  routes.forEach((item: RouteRecordRaw) => {
    if (item.meta?.title) {
      breadcrumb.push(item.meta?.title as string)
    }

    if (item.children && item.children?.length > 0) {
      flatRoutes.push(...getFlatRoutes(item.children, breadcrumb))
    } else {
      ;(item.meta?.breadcrumb as string[]).push(...breadcrumb)
      flatRoutes.push(item)
    }
    breadcrumb.pop()
  })
  return flatRoutes
}
// 加载vue组件
const layoutModules = import.meta.glob('/src/views/**/*.vue')

// 根据路径，动态获取vue组件
const getDynamicComponent = (path: string): any => {
  return layoutModules[`/src/views/${path}.vue`]
}

/**
 * 根据菜单列表，生成路由数据
 *
 * @param menuList 菜单列表
 */
export const generateRoutes = (menuList: any): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = []
  menuList
    .filter((item: any) => item.visible === 1) // 隐藏不可见菜单
    .forEach((menu: any) => {
    let component, path
    if (menu.children?.length > 0) {
      component = () => import('@/components/layout/index.vue')
      path = '/p/' + menu.id
    } else {
      // 判断是否iframe
      if (isIframeUrl(menu)) {
        component = () => import('@/components/layout/router/Iframe.vue')
        path = '/iframe/' + menu.id
      } else {
        component = getDynamicComponent(menu.url)
        path = '/' + menu.url
      }
    }

    const route: RouteRecordRaw = {
      path: path,
      name: path,
      component: component,
      children: [],
      meta: {
        title: menu.name,
        icon: menu.icon,
        id: '' + menu.id,
        type: menu.type,
        visible: menu.visible || 1,
        url: menu.url,
        cache: true,
        affix: menu.affix || false,
        openStyle: menu.openStyle,
        breadcrumb: []
      }
    }

    // 有子菜单的情况
    if (menu.children?.length > 0) {
      route.children?.push(...generateRoutes(menu.children))
    }

    routes.push(route)
  })

  return routes
}

/**
 * 判断是否iframe
 * @param menu 菜单
 */
const isIframeUrl = (menu: any): boolean => {
  // 如果是新页面打开，则不用iframe
  if (menu.openStyle === 1) {
    return false
  }

  // 是否外部链接
  return isExternalLink(menu.url)
}
