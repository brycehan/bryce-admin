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
export const deleteByIdsApi = (ids: bigint[]) => {
  return request.delete('/system/role', { data: { ids } })
}

/**
 * 查询系统角色详情
 *
 * @param id ID
 */
export const getByIdApi = (id: bigint) => {
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
export const getRoleListApi = () => {
  return request.get('/system/role/list')
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
  return request.put('/system/role/dataScope', data)
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
 * @param id 角色ID
 */
export const getCheckCodeUniqueApi = (code: string, id: number) => {
  return request.get('/system/role/checkCodeUnique', { params: { id, code } })
}
