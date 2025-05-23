import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { isExternalLink } from '@/utils/tool'

NProgress.configure({ showSpinner: false })

/**
 * 常量路由
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/redirect',
    component: () => import('@/components/layout/index.vue'),
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/components/layout/router/Redirect.vue'),
      },
    ],
  },
  {
    path: '/404',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/404.vue'),
  },
]

/**
 * 异步路由
 */
export const asyncRoute: RouteRecordRaw = {
  path: '/',
  component: () => import('@/components/layout/index.vue'),
  redirect: '/dashboard',
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
      },
    },
    {
      path: '/bpm/model/add',
      component: () => import('@/views/bpm/model/form/index.vue'),
      name: 'BpmModelAdd',
      meta: {
        title: '创建流程',
        i18n: false,
        cache: false,
        breadcrumb: ['流程管理', '流程模型', '创建流程'],
        activeMenu: '/bpm/model',
      },
    },
    {
      path: '/bpm/model/edit/:id',
      component: () => import('@/views/bpm/model/form/index.vue'),
      name: 'BpmModelEdit',
      meta: {
        title: '修改流程',
        i18n: false,
        cache: false,
        breadcrumb: ['流程管理', '流程模型', '修改流程'],
        activeMenu: '/bpm/model',
      },
    },
    {
      path: '/bpm/process-instance/manager/:id',
      component: () => import('@/views/bpm/process-instance/detail/index.vue'),
      name: 'BpmProcessInstanceManagerDetail',
      meta: {
        title: '流程详情',
        i18n: false,
        cache: false,
        breadcrumb: ['审批中心', '流程实例', '流程详情'],
        activeMenu: '/bpm/process-instance/manager',
      },
    },
    {
      path: '/bpm/process-instance/my/:id',
      component: () => import('@/views/bpm/process-instance/detail/index.vue'),
      name: 'BpmProcessInstanceMyDetail',
      meta: {
        title: '流程详情',
        i18n: false,
        cache: false,
        breadcrumb: ['审批中心', '我的流程', '流程详情'],
        activeMenu: '/bpm/process-instance/my',
      },
    },
    {
      path: '/bpm/task/manager/:id',
      component: () => import('@/views/bpm/process-instance/detail/index.vue'),
      name: 'BpmTaskManagerDetail',
      meta: {
        title: '流程详情',
        i18n: false,
        cache: false,
        breadcrumb: ['审批中心', '流程任务', '流程详情'],
        activeMenu: '/bpm/task/manager',
      },
    },
    {
      path: '/bpm/task/todo/:id',
      component: () => import('@/views/bpm/process-instance/detail/index.vue'),
      name: 'BpmTaskTodoDetail',
      meta: {
        title: '流程详情',
        i18n: false,
        cache: false,
        breadcrumb: ['审批中心', '待办任务', '流程详情'],
        activeMenu: '/bpm/task/todo',
      },
    },
    {
      path: '/bpm/task/done/:id',
      component: () => import('@/views/bpm/process-instance/detail/index.vue'),
      name: 'BpmTaskDoneDetail',
      meta: {
        title: '流程详情',
        i18n: false,
        cache: false,
        breadcrumb: ['审批中心', '已办任务', '流程详情'],
        activeMenu: '/bpm/task/done',
      },
    },
    {
      path: '/bpm/task/copy/:id',
      component: () => import('@/views/bpm/process-instance/detail/index.vue'),
      name: 'BpmTaskCopyDetail',
      meta: {
        title: '流程详情',
        i18n: false,
        cache: false,
        breadcrumb: ['审批中心', '抄送我的', '流程详情'],
        activeMenu: '/bpm/task/copy',
      },
    },
    {
      path: '/bpm/form/edit',
      component: () => import('@/views/bpm/form/form-editor.vue'),
      name: 'BpmFormEditor',
      meta: {
        title: '设计流程表单',
        i18n: false,
        cache: false,
        breadcrumb: ['流程管理', '流程表单', '设计流程表单'],
        activeMenu: '/bpm/form',
      },
    },
    {
      path: '/bpm/start-process/:id',
      component: () => import('@/views/bpm/start-process/apply.vue'),
      name: 'BpmStartProcessApply',
      meta: {
        title: '流程申请',
        i18n: false,
        cache: false,
        breadcrumb: ['审批中心', '发起流程', '流程申请'],
        activeMenu: '/bpm/start-process',
      },
    },
  ],
}

/**
 * 错误路由
 */
export const errorRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)',
  redirect: '/404',
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
      },
    ],
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
      },
    ],
  },
]

// 创建路由，hash模式， history模式 参数一样的写法
export const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH), // history模式
  routes: constantRoutes,
})

// 白名单列表
const whiteList = ['/login']

// 路由跳转前
router.beforeEach(async (to, _from, next) => {
  NProgress.start()

  const authStore = useAuthStore()
  const appStore = useAppStore()
  const dictStore = useDictStore()
  const routerStore = useRouterStore()

  // token存在的情况
  if (authStore.isAuthenticated()) {
    if (to.path === '/login') {
      next('/dashboard')
    } else {
      // 用户信息不存在，则重新拉取
      if (!authStore.user.id) {
        try {
          await authStore.getCurrentUser()
          await authStore.getPermission()
          await dictStore.getDictMap()
          await appStore.initIcons()
        } catch (error) {
          console.error('router.beforeEach', error)

          // 请求异常，则跳转到登录页
          authStore?.removePermission()
          next('/login')
          return Promise.reject(error)
        }

        // 动态菜单，获取扁平化路由，将多级路由转换成一组路由
        await routerStore.initMenuRoutes()

        router.addRoute(asyncRoute)
        router.addRoute(errorRoute)

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
      next({
        path: '/login',
        query: { redirect: to.fullPath }, // 保存完整路径
      })
    }
  }
})

// 路由加载后
router.afterEach(() => {
  NProgress.done()
})

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
          path = '/' + (menu.url.endsWith('/index') ? menu.url.substring(0, menu.url.lastIndexOf('/')) : menu.url)
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
          breadcrumb: [],
        },
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
