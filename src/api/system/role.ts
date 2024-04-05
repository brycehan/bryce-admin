import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/system/role', data)
  } else {
    return request.post('/system/role', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/system/role', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/system/role/${id}`)
}

export const page = (data: any) => {
  return request.post('/system/role/page', data)
}

export const list = () => {
  return request.get('/system/role/list')
}

/** 角色菜单 */
export const menu = () => {
  return request.get('/system/role/menu')
}

/** 角色绑定的用户分页列表 */
export const userPage = (data: any) => {
  return request.post('/system/role/user/page', data)
}

/** 角色绑定多个用户 */
export const saveUsers = (roleId: string, data: any) => {
  return request.post(`/system/role/user/${roleId}`, data)
}

/** 角色取消绑定多个用户 */
export const deleteUsers = (roleId: string, data: any) => {
  return request.delete(`/system/role/user/${roleId}`, { data: data })
}
