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
 * 角色绑定的用户分页列表
 *
 * @param data 数据
 */
export const postUserPageApi = (data: any) => {
  return request.post('/system/role/user/page', data)
}

/**
 * 角色绑定多个用户
 *
 * @param roleId 角色ID
 * @param data 用户列表
 */
export const postUsersApi = (roleId: string, data: any) => {
  return request.post(`/system/role/user/${roleId}`, data)
}

/**
 * 角色取消绑定多个用户
 *
 * @param roleId 角色ID
 * @param data 用户列表
 */
export const deleteUsersApi = (roleId: string, data: any) => {
  return request.delete(`/system/role/user/${roleId}`, { data: data })
}

/**
 * 用户未分配/分配的角色分页列表
 *
 * @param data 数据
 */
export const postAssignRolePageApi = (data: any) => {
  return request.post('/system/role/assignRole/page', data)
}

/**
 * 分配给用户多个角色
 *
 * @param userId 用户ID
 * @param data 角色ID列表
 */
export const postAssignRoleSaveApi = (userId: string, data: any) => {
  return request.post(`/system/role/assignRole/${userId}`, data)
}

/**
 * 删除用户的多个角色
 *
 * @param userId 用户ID
 * @param data 角色ID列表
 */
export const deleteAssignRoleApi = (userId: string, data: any) => {
  return request.delete(`/system/role/assignRole/${userId}`, { data: data })
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
