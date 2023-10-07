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
        if (authStore?.token) {
            config.headers.Authorization = authStore.token
        }

        config.headers['Accept-Language'] = 'zh-CN'

        // 追加时间戳，防止GET请求缓存
        if(config.method?.toUpperCase() === 'GET') {
            config.params = {...config.params, t: new Date().getTime() }
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

/** 响应拦截器 */
request.interceptors.response.use(
    (response) => {
        if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText) || 'Error')
        }

        // 处理自动刷新令牌
        if(response.headers.authorization) {
            stores.authStore.setToken(response.headers.authorization)
        }

        if (response.headers['content-type'].startsWith('application/json')) {
            const responseData = response.data
            // 响应成功
            if (responseData.code === 200) {
                return responseData
            }

            // 没有权限，如：未登录、登录过期等，需要跳转到登录页
            if (responseData.code === 401) {
                console.log('401:ok:')

                if(stores.authStore) {
                    stores.authStore.removeToken()
                }
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

export default request
