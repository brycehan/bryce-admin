import request from '@/utils/request'

/**
 * 保存微信公众号模版消息发送记录
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/mp/templateMessageLog', data)
  } else {
    return request.post('/mp/templateMessageLog', data)
  }
}

/**
 * 删除微信公众号模版消息发送记录
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: bigint[]) => {
  return request.delete('/mp/templateMessageLog', { data: { ids } })
}

/**
 * 查询微信公众号模版消息发送记录详情
 *
 * @param id ID
 */
export const getByIdApi = (id: bigint) => {
  return request.get(`/mp/templateMessageLog/${id}`)
}

/**
 * 微信公众号模版消息发送记录分页查询
 * @param data 查询条件
 */
export const postPageApi = (data: any) => {
  return request.post('/mp/templateMessageLog/page', data)
}
