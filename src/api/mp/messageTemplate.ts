import request from '@/utils/request'

/**
 * 保存微信公众号消息模板
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/mp/messageTemplate', data)
  } else {
    return request.post('/mp/messageTemplate', data)
  }
}

/**
 * 删除微信公众号消息模板
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: bigint[]) => {
  return request.delete('/mp/messageTemplate', { data: { ids } })
}

/**
 * 查询微信公众号消息模板详情
 *
 * @param id 消息模板ID
 */
export const getByIdApi = (id: bigint) => {
  return request.get(`/mp/messageTemplate/${id}`)
}

/**
 * 微信公众号消息模板分页查询
 *
 * @param data 分页查询参数
 */
export const postPageApi = (data: any) => {
  return request.post('/mp/messageTemplate/page', data)
}
