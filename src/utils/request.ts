import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/modules/auth'
import qs from 'qs'
import { Warning } from '@element-plus/icons-vue'
import errorMessage from '@/utils/errorMessage'
import { useAppStore } from '@/stores/modules/app'

/**
 * axios实例
 */
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL as any,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

/**
 * 请求拦截器
 */
request.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const appStore = useAppStore()
    if (authStore?.accessToken) {
      config.headers.Authorization = authStore.accessToken
    }

    console.log('locale', appStore.locale)
    config.headers['Accept-Language'] = appStore.locale
    config.headers['X-Source-Client'] = 'pc'

    // 追加时间戳，防止GET请求缓存
    if (config.method?.toUpperCase() === 'GET') {
      config.params = { ...config.params, t: new Date().getTime() }
    }

    if (Object.values(config.headers).includes('application/x-www-form-urlencoded')) {
      config.data = qs.stringify(config.data)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  async (response) => {
    // 未设置状态码，则默认成功状态
    const code = response.data.code || 200;
    // 获取错误信息
    const message = errorMessage[code] || response.data.message || errorMessage['default']

    const authStore = useAuthStore()
    // 处理自动刷新令牌
    if (response.headers.authorization) {
      authStore.setToken(response.headers.authorization)
    }

    // 响应数据类型非json，则直接返回
    if (!response.headers['content-type'].startsWith('application/json')) {
      return response
    }

    // 响应成功
    if (code === 200) {
      return response.data
    }

    // 没有权限，如：未登录、登录过期等，需要跳转到登录页
    if (code === 401) {
      authStore?.removeToken()
      handleAuthorized()
      return Promise.reject(new Error(message))
    }

    // 警告提示
    if (code >= 600 && code <= 999) {
      ElMessage.warning(message)
      return Promise.reject(new Warning(message))
    }

    // 错误提示
    ElMessage.error(message)
    return Promise.reject(new Error(message))
  },
  (error) => {
    console.error('响应', error)
    // 错误提示
    let { message } = error
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substring(message.length - 3) + '异常'
    }
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

/**
 * 处理登录超时
 */
const handleAuthorized = () => {
  ElMessageBox.confirm('登录状态已过期，您可以继续留在页面，或者重新登录', '系统提示', {
    type: 'warning',
    confirmButtonText: '重新登录'
  }).then(() => {
    const authStore = useAuthStore()

    authStore?.removeToken()
    location.reload()

    return Promise.reject('登录状态已过期，请重新登录')
  })
}

export default request
