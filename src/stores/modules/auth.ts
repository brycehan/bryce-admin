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
import { ref } from 'vue'

export const useAuthStore = defineStore('authStore', () => {
    // 用户信息
    const user = {
      id: '',
      username: '',
      nickname: '',
      gender: '',
      avatar: '',
    } as any
    // 权限集合
    const authoritySet = ref<string[]>([])
    // 访问token
    const accessToken = ref<string>('')

    /**
     * 设置访问token
     *
     * @param token 访问token
     */
    const setToken = (token: string) => {
      accessToken.value = token
      storage.setToken(token)
    }

    /**
     * 移除访问token
     */
    const removeToken = () => {
      accessToken.value = ''
      storage.removeToken()
    }

    /**
     * 账号登录
     *
     * @param loginDto 登录参数
     */
    const loginByAccount = async (loginDto: Auth.LoginDto) => {
      const { code, data, message } = await postLoginByAccountApi(loginDto)
      console.log('loginByAccount', data)
      if (code == 200) {
        const token = (data as Auth.LoginVo).accessToken as string || ''
        setToken(token)
      } else {
        return Promise.reject(message)
      }
    }

    /**
     * 手机登录
     *
     * @param loginDto 登录参数
     */
    const loginByPhone = async (loginDto: any) => {
      const { code, data, message } = await postLoginByPhoneApi(loginDto)
      if (code == 200) {
        const token = (data as Auth.LoginVo).accessToken as string
        setToken(token)
      } else {
        return Promise.reject(message)
      }
    }

    /**
     * 获取登录用户信息
     */
    const getCurrentUser = async () => {
      const { data } = await getCurrentUserApi()
      Object.assign(user, data || {
        id: '',
        username: '',
        nickname: '',
        gender: '',
        avatar: ''
      } as any)
    }

    /**
     * 获取权限
     */
    const getAuthoritySet = async () => {
      const { data } = await getAuthorityApi()
      authoritySet.value = data || []
    }

    /**
     * 用户退出
     */
    const logout = async () => {
      await getLogoutApi()
      removeToken()
    }

    return {
      user,
      authoritySet,
      accessToken,
      loginByAccount,
      loginByPhone,
      getCurrentUser,
      getAuthoritySet,
      removeToken,
      logout
    }
  },
  {
    persist: true
  })
