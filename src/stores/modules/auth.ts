import { defineStore } from 'pinia'
import { loginByAccount, loginByPhone, currentUser, logout } from '@/api/auth/auth'
import { authority } from '@/api/system/menu'
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
    authoritySet: [],
    // 访问token
    token: storage.getToken()
  }),
  actions: {
    setUser(user: any) {
      this.user = user
    },
    setToken(token: any) {
      this.token = token
      storage.setToken(token)
    },
    removeToken() {
      this.token = null
      storage.removeToken()
    },
    /** 账号登录 */
    async loginByAccount(loginDto: Auth.LoginDto) {
      const { code, data, message } = await loginByAccount(loginDto)
      if (code == 200) {
        this.token = (data as Auth.LoginVo).token as string
        storage.setToken(this.token)
      } else {
        return Promise.reject(message)
      }
    },
    async loginByPhone(loginDto: any) {
      const { code, data, message } = await loginByPhone(loginDto)
      if (code == 200) {
        this.token = (data as Auth.LoginVo).token as string
        storage.setToken(this.token)
      } else {
        return Promise.reject(message)
      }
    },
    /** 获取登录用户信息 */
    async getCurrentUser() {
      const { data } = await currentUser()
      // this.user = data
      Object.assign(this.user, data)
    },
    /** 获取权限 */
    async getAuthoritySet() {
      const { data } = await authority()
      this.authoritySet = data || []
    },
    /** 用户退出 */
    async logout() {
      await logout()
      storage.removeToken()
    }
  }
})
