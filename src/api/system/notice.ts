import request from '@/utils/request'

/**
 * 保存系统通知公告
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/system/notice', data)
  } else {
    return request.post('/system/notice', data)
  }
}

/**
 * 删除系统通知公告
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: bigint[]) => {
  return request.delete('/system/notice', { data: { ids } })
}

/**
 * 查询系统通知公告详情
 *
 * @param id ID
 */
export const getByIdApi = (id: bigint) => {
  return request.get(`/system/notice/${id}`)
}

/**
 * 系统通知公告分页查询
 *
 * @param data 参数
 */
export const postPageApi = (data: any) => {
  return request.post('/system/notice/page', data)
}
