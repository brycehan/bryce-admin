import { defineStore } from 'pinia'
import { postLoginByAccountApi, postLoginByPhoneApi, getCurrentUserApi, getLogoutApi } from '@/api/auth/auth'
import { getPermissionApi } from '@/api/system/menu'
import storage from '@/utils/storage'
import { ref } from 'vue'
import type { LoginDto, LoginVo } from '@/types/modules/auth'
import _ from 'lodash'

export const useAuthStore = defineStore(
  'authStore',
  () => {
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
    // 角色集合
    const roleSet = ref<string[]>([])
    // 访问token
    const accessToken = ref<string>()
    // 记住我
    const rememberMe = ref<boolean>(false)
    const rememberMeAccessToken = ref<string>()
    /**
     * 设置访问token
     *
     * @param token 访问token
     */
    const setToken = (token: string) => {
      debugger
      if (rememberMe.value) {
        rememberMeAccessToken.value = token
      } else {
        accessToken.value = token
      }
    }

    /**
     * 获取访问token
     */
    const getToken = () => {
      if (rememberMe.value) {
        return rememberMeAccessToken.value
      } else {
        return accessToken.value
      }
    }

    /**
     * 账号登录
     *
     * @param loginDto 登录参数
     */
    const loginByAccount = async (loginDto: LoginDto) => {
      const { code, data, message } = await postLoginByAccountApi(loginDto)
      if (code == 200) {
        const token = ((data as LoginVo).accessToken as string) || ''
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
        const token = (data as LoginVo).accessToken as string
        setToken(token)
      } else {
        return Promise.reject(message)
      }
    }

    /**
     * 判断是否登录
     */
    const isAuthenticated = (): boolean => {
      if (rememberMe.value) {
        return !_.isEmpty(rememberMeAccessToken.value)
      } else {
        return !_.isEmpty(accessToken.value)
      }
    }

    /**
     * 获取登录用户信息
     */
    const getCurrentUser = async () => {
      const { data } = await getCurrentUserApi()
      Object.assign(
        user,
        data ||
          ({
            id: '',
            username: '',
            nickname: '',
            gender: '',
            avatar: '',
          } as any),
      )
      storage.setUser(user)
    }

    /**
     * 获取权限
     */
    const getPermission = async () => {
      // 角色集合和权限集合已存在，则不请求
      if (!_.isEmpty(roleSet.value) || !_.isEmpty(authoritySet.value)) return

      // 请求权限集合
      const { data } = await getPermissionApi()
      roleSet.value = data.roleSet || []
      authoritySet.value = data.authoritySet || []
    }

    /**
     * 移除访问token
     */
    const removePermission = () => {
      accessToken.value = undefined
      rememberMeAccessToken.value = undefined
      roleSet.value = []
      authoritySet.value = []
    }

    /**
     * 用户退出
     */
    const logout = async () => {
      // 访问token不存在，则不请求
      if (!isAuthenticated()) return
      // 请求退出
      await getLogoutApi()
      removePermission()
    }

    return {
      accessToken,
      rememberMe,
      rememberMeAccessToken,
      user,
      roleSet,
      authoritySet,
      loginByAccount,
      loginByPhone,
      setToken,
      getToken,
      getCurrentUser,
      getPermission,
      removePermission,
      isAuthenticated,
      logout,
    }
  },
  {
    persist: [
      {
        pick: ['accessToken', 'roleSet', 'authoritySet'],
        storage: sessionStorage,
      },
      {
        pick: ['rememberMe', 'rememberMeAccessToken'],
        storage: localStorage,
      },
    ],
  },
)
