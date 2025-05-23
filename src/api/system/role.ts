import request from '@/utils/request'
import download from '@/utils/download'

/**
 * 保存系统角色
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/system/role', data)
  } else {
    return request.post('/system/role', data)
  }
}

/**
 * 删除系统角色
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/system/role', { data: { ids } })
}

/**
 * 查询系统角色详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
  return request.get(`/system/role/${id}`)
}

/**
 * 系统角色分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/system/role/page', data)
}

/**
 * 更新系统角色状态
 *
 * @param id ID
 * @param status 状态（0：禁用，1：启用）
 */
export const patchStatusApi = (id: string, status: number) => {
  return request.patch(`/system/role/${id}/${status}`)
}

/**
 * 导出系统角色
 *
 * @param data 导出参数
 */
export const postExportExcelApi = (data: any) => {
  download.post('/system/role/export', data)
}

/**
 * 系统角色列表查询
 */
export const getSimpleList = (data: any) => {
  return request.get('/system/role/simple-list', { params: data })
}

/**
 * 角色菜单
 */
export const getMenuApi = () => {
  return request.get('/system/role/menu')
}

/**
 * 分配数据权限
 *
 * @param data 数据
 */
export const putDataScopeApi = (data: any) => {
  return request.put('/system/role/assignDataScope', data)
}

/**
 * 角色 未分配/分配 的用户分页列表
 *
 * @param data 数据
 */
export const postAssignUserPageApi = (data: any) => {
  return request.post('/system/role/assignUser/page', data)
}

/**
 * 给多个用户分配角色授权
 *
 * @param roleId 角色ID
 * @param data 用户ID列表
 */
export const postAssignUserSaveApi = (roleId: string, data: any) => {
  return request.post(`/system/role/assignUser/${roleId}`, data)
}

/**
 * 取消多个用户的角色授权
 *
 * @param roleId 角色ID
 * @param data 用户ID列表
 */
export const deleteAssignUserApi = (roleId: string, data: any) => {
  return request.delete(`/system/role/assignUser/${roleId}`, { data: data })
}

/**
 * 校验角色编码是否唯一
 *
 * @param code 角色编码
 * @param idRef 角色ID
 */
export const getCheckCodeUniqueApi = (code: string, idRef: Ref) => {
  return request.get('/system/role/checkCodeUnique', { params: { id: idRef.value, code } })
}

export default {
  saveOrUpdateApi,
  deleteByIdsApi,
  getByIdApi,
  postPageApi,
  patchStatusApi,
  postExportExcelApi,
  getSimpleList,
  getMenuApi,
  putDataScopeApi,
  postAssignUserPageApi,
  postAssignUserSaveApi,
  deleteAssignUserApi,
  getCheckCodeUniqueApi,
}
