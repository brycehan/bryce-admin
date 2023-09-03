import { defineStore } from 'pinia'
import { login, currentUser, logout } from '@/api/auth'
import storage from '@/utils/storage'
import type { Auth } from '@/api/auth'
export const authStore = defineStore('authStore', {
  state: () => ({
    user: {
      id: '',
      username: '',
      avatar: ''
    },
    token: storage.getToken()
  }),
  actions: {
    removeToken() {
      this.token = null
      storage.removeToken()
    },
    /** 登录 */
    async login(loginDto: Auth.LoginDto) {
      const { code, data, message } = await login(loginDto)
      if (code == 200) {
        this.token = (data as Auth.LoginVo).token as string
        storage.setToken(this.token)
      } else {
        return Promise.reject(message)
      }
    },
    /** 当前登录用户信息 */
    async currentUser() {
      const { data } = await currentUser()
      this.user = data
    },
    /** 用户退出 */
    async logout() {
      await logout()
      storage.removeToken()
    }
  }
})
