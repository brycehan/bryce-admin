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

  type JwtTokenDto = {
    /** jwt令牌 */
    token: string
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

/** 登录 POST /auth/login */
export async function login(data: Auth.LoginDto) {
  return request.post<any, Auth.ResponseResultLoginVo>('/auth/login', data)
}

/** 查询系统登录用户详情 GET /auth/currentUser */
export async function currentUser() {
  return request.get('/auth/currentUser')
}

/** 获取菜单列表 GET /auth/navigation */
export async function navigation() {
  return request.get('/auth/navigation')
}

/** 退出登录 GET /auth/logout */
export async function logout() {
  return request.get(`/auth/logout`)
}
