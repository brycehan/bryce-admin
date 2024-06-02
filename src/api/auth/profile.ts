import request from '@/utils/request'

export const getUserInfo = () => {
  return request.get('/system/profile')
}

export const updateUserInfo = (data: any) => {
  return request.put('/system/profile', data)
}

export const updateAvatar = (data: any) => {
  return request.put('/system/profile/avatar', data)
}

export const updatePassword = (data: any) => {
  return request.put('/system/profile/password', data)
}
