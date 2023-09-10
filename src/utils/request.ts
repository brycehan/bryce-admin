import axios from 'axios'
import {ElMessage} from 'element-plus'
import stores from '@/stores'
import qs from 'qs'

/** axios实例 */
const request = axios.create({
    baseURL: import.meta.env.VITE_API_URL as any,
    timeout: 60000,
    headers: {'Content-Type': 'application/json;charset=UTF-8'}
})

/** 请求拦截器 */
request.interceptors.request.use(
    (config) => {
        const authStore = stores.authStore
        if (authStore && authStore.token) {
            config.headers.Authorization = authStore.token
        }

        config.headers['Accept-Language'] = 'zh-CN'
        if (Object.values(config.headers).includes('application/x-www-form-urlencoded')) {
            config.data = qs.stringify(config.data)
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

/** 响应拦截器 */
request.interceptors.response.use(
    (response) => {
        if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText) || 'Error')
        }

        if (response.headers['content-type'] === 'application/json') {
            const responseData = response.data
            // 响应成功
            if (responseData.code === 200) {
                return responseData
            }

            // 错误提示
            ElMessage.error(responseData.message || 'Error')

            // 没有权限，如：未登录、登录过期等，需要跳转到登录页
            if (responseData.code === 401) {
                console.log('401:ok:')

                stores.authStore.removeToken()
            }

            return Promise.reject(new Error(responseData.message || 'Error'))
        } else {
            return response
        }

    },
    (error) => {
        ElMessage.error(error.message || 'Error')
        return Promise.reject(error)
    }
)

export default request
