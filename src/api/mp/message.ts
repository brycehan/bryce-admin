import request from '@/utils/request'

/**
 * 添加或修改微信公众号消息
 *
 * @param data 消息参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/mp/message', data)
  } else {
    return request.post('/mp/message', data)
  }
}

/**
 * 删除微信公众号消息
 *
 * @param ids ID数组
 */
export const deleteMessageApi = (ids: bigint[]) => {
  return request.delete('/mp/message', { data: { ids } })
}

/**
 * 查询微信公众号消息详情
 *
 * @param id 消息ID
 */
export const getByIdApi = (id: bigint) => {
  return request.get(`/mp/message/${id}`)
}

/**
 * 分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/mp/message/page', data)
}
