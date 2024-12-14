import request from '@/utils/request'

/**
 * 保存系统机构
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/system/org', data)
  } else {
    return request.post('/system/org', data)
  }
}

/**
 * 删除系统机构
 *
 * @param ids 参数
 */
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/system/org', { data: { ids } })
}

/**
 * 查询系统机构详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
  return request.get(`/system/org/${id}`)
}

/**
 * 查询系统机构列表
 *
 * @param data 参数
 */
export const postListApi = (data: any) => {
  return request.post('/system/org/list', data)
}
