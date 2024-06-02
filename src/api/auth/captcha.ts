import request from '@/utils/request'

/** 生成验证码 */
export const generate = () => {
  return request.get(`/auth/captcha/generate`)
}

/**
 * 验证码开关
 *
 * @param captchaType 验证码类型（login、register）
 */
export const enabled = (captchaType: string) => {
  return request.get(`/auth/captcha/${captchaType}/enabled`)
}
