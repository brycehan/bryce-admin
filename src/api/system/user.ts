import request from '@/utils/request'
import download from '@/utils/download'

/**
 * 保存系统用户
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/system/user', data)
  } else {
    return request.post('/system/user', data)
  }
}

/**
 * 删除系统用户
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: bigint[]) => {
  return request.delete('/system/user', { data: { ids } })
}

/**
 * 查询系统用户详情
 *
 * @param id ID
 */
export const getByIdApi = (id: bigint) => {
  return request.get(`/system/user/${id}`)
}

/**
 * 系统用户分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/system/user/page', data)
}

/**
 * 更新系统用户状态
 *
 * @param id ID
 * @param status 状态
 */
export const patchStatusApi = (id: bigint, status: number) => {
    return request.patch(`/system/user/${id}/${status}`)
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

/**
 * 下载导入用户模板
 */
export const getImportTemplateApi = () => {
  download.get('/system/user/importTemplate')
}

/**
 * 导出系统用户
 *
 * @param data 导出参数
 */
export const postDownloadExcelApi = (data: any) => {
  download.post('/system/user/export', data)
}

/**
 * 导入地址
 */
export const importUrl = import.meta.env.VITE_API_URL + '/system/user/import'

/**
 * 系统用户分页查询
 *
 * @param data 分页参数
 */
export const resetPasswordApi = (data: any) => {
  return request.patch('/system/user/resetPassword', data)
}

/**
 * 校验用户账号是否唯一
 *
 * @param rule 校验规则
 * @param value 校验值
 * @param callback 回调
 */
export const checkUsernameUnique = (rule: any, value: any, callback: any) => {
  getCheckUsernameUniqueApi(value)
    .then((res) => {
      if (res.data) {
        callback()
      } else {
        callback(new Error('此用户名太受欢迎，请更换一个'))
      }
    })
    .catch((error) => {
      console.log(error)
    })
}
