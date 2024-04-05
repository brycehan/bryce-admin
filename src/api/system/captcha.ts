import request from '@/utils/request'

/** 生成验证码 */
export const generate = () => {
  return request.get(`/captcha/generate`)
}

/** 验证码开关 */
export const enabled = () => {
  return request.get('/captcha/enabled')
}
