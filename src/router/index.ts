import {
  createRouter, createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw
} from 'vue-router'
import stores from '@/stores'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {isExternalLink} from "@/utils/tool";

NProgress.configure({ showSpinner: false })

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
  }
]

const asyncRoute: RouteRecordRaw = {
  path: '/',
  component: () => import('@/components/layout/index.vue'),
  redirect: '/home',
  children: [
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/home.vue'),
      meta: {
        title: '首页',
        affix: true
      }
    },
    {
      path: '/profile/password',
      name: 'ProfilePassword',
      component: () => import('@/views/profile/password.vue'),
      meta: {
        title: '修改密码',
        cache: true
      }
    },
  ]
}

/** 配置常量菜单 */
export const constantMenu = [
  {
    id: -1,
    name: 'Demo',
    url: null,
    icon: 'icon-windows',
    children: [
      {
        id: -11,
        name: 'Icon 图标',
        url: 'demo/icons/index',
        icon: 'icon-unorderedlist'
      }
    ]
  }
]
/** 错误路由 */
export const errorRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)',
  redirect: '/404'
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

// 白名单列表
const whiteList = ['/login']

// 路由跳转前
router.beforeEach(async (to, from, next) => {
  NProgress.start()

  // token存在的情况
  if (stores.authStore.token) {
    if (to.path === '/login') {
      next('/home')
    } else {
      // 用户信息不存在，则重新拉取
      if (!stores.authStore.user.id) {
        try {
          await stores.authStore.getCurrentUser()
          await stores.authStore.getAuthoritySet()
          await stores.appStore.getDictList()
        } catch (error) {
          console.warn('出错：', error)

          // 请求异常，则跳转到登录页
          stores.authStore?.removeToken()
          next('/login')
          // return
          return Promise.reject(error)
        }
        // 动态菜单
        const menuRoutes = await stores.routerStore.getMenuRoutes()

        // 获取扁平化路由，将多级路由转换成一组路由
        const flatRoutes = getFlatRoutes(menuRoutes, [])

        // 添加菜单路由
        asyncRoute.children.push(...flatRoutes)

        router.addRoute(asyncRoute)
        router.addRoute(errorRoute)

        // 保存路由数据
        stores.routerStore.setRoutes(constantRoutes.concat(asyncRoute))

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

//根据路径，动态获取vue组件
const getDynamicComponent = (path: string): any => {
  return layoutModules[`/src/views/${path}.vue`]
}

/**
 * 根据菜单列表，生成路由数据
 * @param menuList 菜单列表
 */
export const generateRoutes = (menuList: any): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = []
  menuList.forEach((menu: any) => {
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
        url: menu.url,
        cache: true,
        openStyle: menu.openStyle,
        breadcrumb: [],
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
  if(menu.openStyle === 1) {
    return false
  }

  // 是否外部链接
  return  isExternalLink(menu.url)
}
