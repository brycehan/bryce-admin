import request from '@/utils/request'

/**
 * 生成登录验证码短信
 *
 * @param phone 手机号码
 */
export const getSendLoginCodeApi = (phone: string) => {
  return request.get('/auth/sms/login/code', { params: { phone } })
}

/**
 * 生成注册验证码短信
 *
 * @param phone 手机号码
 */
export const getSendRegisterCodeApi = (phone: string) => {
  return request.get('/auth/sms/register/code', { params: { phone } })
}
