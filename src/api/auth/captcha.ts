import request from '@/utils/request'

/**
 * 生成图片验证码
 */
export const getGenerateApi = () => {
  return request.get(`/auth/captcha/generate`)
}

/**
 * 获取图片验证码开关
 *
 * @param captchaType 验证码类型（login、register）
 */
export const getEnabledApi = (captchaType: string) => {
  return request.get(`/auth/captcha/${captchaType}/enabled`)
}
