import { defineStore } from 'pinia'
import {
  postLoginByAccountApi,
  postLoginByPhoneApi,
  getCurrentUserApi,
  getLogoutApi
} from '@/api/auth/auth'
import { getAuthorityApi } from '@/api/system/menu'
import storage from '@/utils/storage'
import type { Auth } from '@/api/auth/auth'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    // 用户信息
    user: {
      id: '',
      username: '',
      avatar: ''
    } as any,
    // 权限集合
    authoritySet: [] as string[],
    // 访问token
    accessToken: storage.getToken()
  }),
  actions: {
    setUser(user: any) {
      this.user = user
    },
    setToken(accessToken: any) {
      this.accessToken = accessToken
      storage.setToken(accessToken)
    },
    removeToken() {
      this.accessToken = null
      storage.removeToken()
    },
    /**
     * 账号登录
     *
     * @param loginDto 登录参数
     */
    async loginByAccount(loginDto: Auth.LoginDto) {
      const { code, data, message } = await postLoginByAccountApi(loginDto)
      if (code == 200) {
        this.accessToken = (data as Auth.LoginVo).accessToken as string
        storage.setToken(this.accessToken)
      } else {
        return Promise.reject(message)
      }
    },
    async loginByPhone(loginDto: any) {
      const { code, data, message } = await postLoginByPhoneApi(loginDto)
      if (code == 200) {
        this.accessToken = (data as Auth.LoginVo).accessToken as string
        storage.setToken(this.accessToken)
      } else {
        return Promise.reject(message)
      }
    },
    /**
     * 获取登录用户信息
     */
    async getCurrentUser() {
      const { data } = await getCurrentUserApi()
      Object.assign(this.user, data)
    },
    /**
     * 获取权限
     */
    async getAuthoritySet() {
      const { data } = await getAuthorityApi()
      this.authoritySet = data || []
    },
    /**
     * 用户退出
     */
    async logout() {
      await getLogoutApi()
      storage.removeToken()
    }
  }
})
