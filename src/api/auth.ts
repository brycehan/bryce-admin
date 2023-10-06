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
    token?: string
    /** 登录类型 */
    type?: string
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

/** 登录 */
export async function loginByAccount(data: Auth.LoginDto) {
  return request.post<any, Auth.ResponseResultLoginVo>('/auth/loginByAccount', data)
}

/** 登录用户的权限集合 */
export async function authority() {
  return request.get('/auth/authority')
}

/** 系统登录用户详情 */
export async function currentUser() {
  return request.get('/auth/currentUser')
}

/** 获取菜单列表 */
export async function nav() {
  return request.get('/auth/nav')
}

/** 退出登录 */
export async function logout() {
  return request.get(`/auth/logout`)
}
