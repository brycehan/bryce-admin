import request from '@/utils/request'
import download from '@/utils/download'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/system/user', data)
  } else {
    return request.post('/system/user', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/system/user', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/system/user/${id}`)
}

export const page = (data: any) => {
  return request.post('/system/user/page', data)
}

/**
 * 校验用户账号是否唯一
 *
 * @param username 用户账号
 */
export const getCheckUsernameUniqueApi = (username: string) => {
  return request.get(`/system/user/checkUsernameUnique/${username}`)
}

/**
 * 校验用户账号是否唯一
 *
 * @param phone 手机号码
 * @param id 用户ID
 */
export const getCheckPhoneUniqueApi = (phone: string, id: number) => {
  return request.get('/system/user/checkPhoneUnique', { params: { id, phone } })
}

/**
 * 校验邮箱是否唯一
 *
 * @param email 邮箱
 * @param id 用户ID
 */
export const getCheckEmailUniqueApi = (email: string, id: number) => {
  return request.get('/system/user/checkEmailUnique', { params: { id, email } })
}

export const downloadExcel = (data: any) => {
  download.post('/system/user/export', data)
}

/**
 * 导入地址
 */
export const importUrl = import.meta.env.VITE_API_URL + '/system/user/import'

/**
 * 校验用户账号是否唯一
 *
 * @param rule 校验规则
 * @param value 校验值
 * @param callback 回调
 */
export const checkUsernameUnique = (rule: any, value: any, callback: any) => {
  getCheckUsernameUniqueApi(value).then((res) => {
    if (res.data) {
      callback()
    } else {
      callback(new Error('此用户名太受欢迎，请更换一个'))
    }
  }).catch((error) => {
    console.log(error)
  })
}
