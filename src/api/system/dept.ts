import request from '@/utils/request'

/**
 * 保存系统部门
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/system/dept', data)
  } else {
    return request.post('/system/dept', data)
  }
}

/**
 * 删除系统部门
 *
 * @param ids 参数
 */
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/system/dept', { data: { ids } })
}

/**
 * 查询系统部门详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
  return request.get(`/system/dept/${id}`)
}

/**
 * 查询系统部门列表
 *
 * @param data 参数
 */
export const postListApi = (data: any) => {
  return request.post('/system/dept/list', data)
}

/**
 * 查询系统部门列表，用于下拉框
 *
 * @param params 参数
 */
export const getSimpleList = (params: any) => {
  return request.get('/system/dept/simple-list', { params })
}

export default {
  saveOrUpdateApi,
  deleteByIdsApi,
  getByIdApi,
  postListApi,
}
