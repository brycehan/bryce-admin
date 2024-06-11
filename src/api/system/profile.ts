import request from '@/utils/request'

/**
 * 查询个人信息
 */
export const getUserInfoApi = () => {
  return request.get('/system/profile')
}

/**
 * 修改用户个人信息
 *
 * @param data 参数
 */
export const putUserInfoApi = (data: any) => {
  return request.put('/system/profile', data)
}

/**
 * 修改用户头像
 *
 * @param data 用户头像参数
 */
export const putAvatarApi = (data: any) => {
  return request.put('/system/profile/avatar', data)
}

/**
 * 修改密码
 *
 * @param data 参数
 */
export const putPasswordApi = (data: any) => {
  return request.put('/system/profile/password', data)
}
