import { defineStore } from 'pinia'
import { login, currentUser, logout } from '@/api/auth'
import { getToken, setToken } from '@/utils/storage'
import type { Auth } from '@/api/auth'
export const authStore = defineStore('authStore', {
  state: () => ({
    user: {
      id: '',
      username: '',
      avatar: ''
    },
    token: getToken()
  }),
  actions: {
    /**
     * 登录
     * @param loginDto 登录Dto
     */
    async login(loginDto: Auth.LoginDto) {
      const { code, data, message } = await login(loginDto)
      if (code == 200) {
        this.token = (data as Auth.LoginVo).token as string
        setToken(this.token)
      } else {
        return Promise.reject(message)
      }
    },

    /**
     * 退出
     */
    async logout() {
      await logout()
      setToken(null)
    }
  }
})
