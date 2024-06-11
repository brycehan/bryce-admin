import request from '@/utils/request'

export declare namespace Auth {
  type LoginDto = {
    /** 账号 */
    username: string
    /** 密码 */
    password: string
    /** uuid */
    uuid?: string
    /** 验证码 */
    code?: string
    /** 登录类型 */
    type?: string
  }

  type LoginVo = {
    /** jwt令牌 */
    accessToken?: string
    /** 过期时间间隔 */
    expiredIn?: number
  }

  type ResponseResultLoginVo = {
    /** 响应编码 */
    code: number
    /** 响应消息 */
    message?: string
    data?: LoginVo
    /** 响应时间 */
    time?: string
  }
}

/**
 * 账号登录
 *
 * @param data 登录参数
 */
export async function postLoginByAccountApi(data: Auth.LoginDto) {
  return request.post<any, Auth.ResponseResultLoginVo>('/auth/loginByAccount', data)
}

/**
 * 手机号登录
 *
 * @param data 登录参数
 */
export async function postLoginByPhoneApi(data: Auth.LoginDto) {
  return request.post<any, Auth.ResponseResultLoginVo>('/auth/loginByPhone', data)
}

/**
 * 系统登录用户详情
 */
export async function getCurrentUserApi() {
  return request.get('/auth/currentUser')
}

/**
 * 退出登录
 */
export async function getLogoutApi() {
  return request.get('/auth/logout')
}
