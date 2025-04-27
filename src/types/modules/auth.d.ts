export interface LoginDto {
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

export interface LoginVo {
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
