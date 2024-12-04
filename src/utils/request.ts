import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/modules/auth'
import qs from 'qs'
import { Warning } from '@element-plus/icons-vue'

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
    if (authStore?.accessToken) {
      config.headers.Authorization = authStore.accessToken
    }

    config.headers['Accept-Language'] = 'zh-CN'
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
    const authStore = useAuthStore()

    if (response.status !== 200) {
      return Promise.reject(new Error(response.statusText) || 'Error')
    }

    // 处理自动刷新令牌
    if (response.headers.authorization) {
      authStore.setToken(response.headers.authorization)
    }

    if (response.headers['content-type'].startsWith('application/json')) {
      const responseData = response.data
      // 响应成功
      if (responseData.code === 200) {
        return responseData
      }

      // 没有权限，如：未登录、登录过期等，需要跳转到登录页
      if (responseData.code === 401) {
        authStore?.removeToken()
        handleAuthorized()
        return Promise.reject(new Error(responseData.message || 'Error'))
      }

      // 警告提示
      if (responseData.code === 599) {
        ElMessage.warning(responseData.message || 'Warn')
        return Promise.reject(new Warning(responseData.message || 'Warn'))
      }

      // 错误提示
      ElMessage.error(responseData.message || 'Error')

      return Promise.reject(new Error(responseData.message || 'Error'))
    } else {
      return response
    }
  },
  (error) => {
    // 错误提示
    ElMessage.error(error.message || 'Error')
    return Promise.reject(error)
  }
)

/**
 * 处理登录超时
 */
const handleAuthorized = () => {
  ElMessageBox.confirm('登录超时，请重新登录', '提示', {
    type: 'warning',
    confirmButtonText: '重新登录'
  }).then(() => {
    const authStore = useAuthStore()

    authStore?.removeToken()
    location.reload()

    return Promise.reject('登录超时，请重新登录')
  })
}

export default request
