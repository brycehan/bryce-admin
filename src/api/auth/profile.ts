import request from '@/utils/request'

export const updatePassword = (data: any) => {
  return request.put('/auth/profile/password', data)
}
