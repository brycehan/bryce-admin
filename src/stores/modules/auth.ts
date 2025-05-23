import { defineStore } from 'pinia'
import { getCurrentUserApi, getLogoutApi, postLoginByAccountApi, postLoginByPhoneApi } from '@/api/auth/auth'
import { getPermissionApi } from '@/api/system/menu'
import storage from '@/utils/storage'
import type { LoginDto, LoginVo } from '@/types/modules/auth'
import _ from 'lodash'
import { handleAuthorized } from '@/utils/request.ts'
import { jwtDecode } from 'jwt-decode'

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
    // 过期时间
    const exp = ref<number>()
    const rememberMeExp = ref<number>()

    /**
     * 设置访问token
     *
     * @param token 访问token
     */
    const setToken = (token: string) => {
      // 解析出过期时间
      const decoded = jwtDecode(token)

      if (_.isNumber(decoded.iat) && _.isNumber(decoded.exp)) {
        // 设置过期时间
        const now = Math.floor(Date.now() / 1000)
        const duration = decoded.exp - decoded.iat

        // 设置访问token
        if (rememberMe.value) {
          rememberMeAccessToken.value = token
          rememberMeExp.value = now + duration - 10
        } else {
          accessToken.value = token
          exp.value = now + duration - 10
        }
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
        return (
          !_.isEmpty(rememberMeAccessToken.value) &&
          _.isNumber(rememberMeExp.value) &&
          rememberMeExp.value > Math.floor(Date.now() / 1000)
        )
      } else {
        return !_.isEmpty(accessToken.value) && _.isNumber(exp.value) && exp.value > Math.floor(Date.now() / 1000)
      }
    }

    /**
     * 判断允许访问
     */
    const permitAccess = () => {
      const result = isAuthenticated()
      if (!result) {
        handleAuthorized()
      }

      return result
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
      exp.value = undefined
      rememberMeExp.value = undefined
    }

    /**
     * 移除访问token
     */
    const removeToken = () => {
      accessToken.value = undefined
      rememberMeAccessToken.value = undefined
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
      exp,
      rememberMeExp,
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
      removeToken,
      isAuthenticated,
      permitAccess,
      logout,
    }
  },
  {
    persist: [
      {
        pick: ['accessToken', 'roleSet', 'authoritySet', 'exp'],
        storage: sessionStorage,
      },
      {
        pick: ['rememberMe', 'rememberMeAccessToken', 'rememberMeExp'],
        storage: localStorage,
      },
    ],
  },
)
