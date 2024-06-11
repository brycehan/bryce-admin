import request from '@/utils/request'

/**
 * 保存微信公众号消息回复规则
 *
 * @param data 消息回复规则参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/mp/messageReplyRule', data)
  } else {
    return request.post('/mp/messageReplyRule', data)
  }
}

/**
 * 删除微信公众号消息回复规则
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: bigint[]) => {
  return request.delete('/mp/messageReplyRule', { data: { ids } })
}

/**
 * 查询微信公众号消息回复规则详情
 *
 * @param id 消息回复规则ID
 */
export const getByIdApi = (id: bigint) => {
  return request.get(`/mp/messageReplyRule/${id}`)
}

/**
 * 微信公众号消息回复规则分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/mp/messageReplyRule/page', data)
}
