import request from '@/utils/request'

export const sendLoginCode = (phone: string) => {
  return request.get('/system/sms/login/code', { params: { phone } })
}

export const sendRegisterCode = (phone: string) => {
  return request.get('/system/sms/register/code', { params: { phone } })
}
