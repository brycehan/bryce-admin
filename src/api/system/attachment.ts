import request from '@/utils/request'

/**
 * 保存系统附件
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/system/attachment', data)
  } else {
    return request.post('/system/attachment', data)
  }
}

/**
 * 删除系统附件
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: bigint[]) => {
  return request.delete('/system/attachment', { data: { ids } })
}

/**
 * 查询系统附件详情
 *
 * @param id ID
 */
export const getByIdApi = (id: bigint) => {
  return request.get(`/system/attachment/${id}`)
}

/**
 * 系统附件分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/system/attachment/page', data)
}
