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
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/system/user', { data: { ids } })
}

/**
 * 查询系统用户详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
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
 * 查询系统用户列表
 *
 * @param data 参数
 */
export const postListApi = (data: any) => {
  return request.post('/system/user/list', data)
}

/**
 * 查询系统用户简单列表
 *
 * @param data 参数
 */
export const getSimpleList = (data: any) => {
  return request.get('/system/user/simple-list', { params: data })
}

/**
 * 更新系统用户状态
 *
 * @param id ID
 * @param status 状态（0：禁用，1：启用）
 */
export const patchStatusApi = (id: string, status: number) => {
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
export const postExportExcelApi = (data: any) => {
  download.post('/system/user/export', data)
}

/**
 * 导入地址
 */
export const importUrl = import.meta.env.VITE_API_URL + '/system/user/import'

/**
 * 系统用户重置密码
 *
 * @param data 分页参数
 */
export const resetPasswordApi = (data: any) => {
  return request.patch('/system/user/resetPassword', data)
}

/**
 * 用户 未分配/分配 的角色分页列表
 *
 * @param data 数据
 */
export const postAssignRolePageApi = (data: any) => {
  return request.post('/system/user/assignRole/page', data)
}

/**
 * 分配给用户多个角色
 *
 * @param userId 用户ID
 * @param data 角色ID列表
 */
export const postAssignRoleSaveApi = (userId: string, data: any) => {
  return request.post(`/system/user/assignRole/${userId}`, data)
}

/**
 * 删除用户的多个角色
 *
 * @param userId 用户ID
 * @param data 角色ID列表
 */
export const deleteAssignRoleApi = (userId: string, data: any) => {
  return request.delete(`/system/user/assignRole/${userId}`, { data: data })
}

/**
 * 校验用户账号是否唯一
 *
 * @param _rule 校验规则
 * @param value 校验值
 * @param callback 回调
 */
export const checkUsernameUnique = (_rule: any, value: any, callback: any) => {
  getCheckUsernameUniqueApi(value)
    .then((res) => {
      if (res.data) {
        callback()
      } else {
        callback(new Error('此用户名太受欢迎，请更换一个'))
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

export default {
  saveOrUpdateApi,
  deleteByIdsApi,
  getByIdApi,
  postPageApi,
  postListApi,
  getSimpleList,
  patchStatusApi,
  getCheckUsernameUniqueApi,
  getCheckPhoneUniqueApi,
  getCheckEmailUniqueApi,
  getImportTemplateApi,
  postExportExcelApi,
  importUrl,
  resetPasswordApi,
  postAssignRolePageApi,
  postAssignRoleSaveApi,
  deleteAssignRoleApi,
  checkUsernameUnique
}
