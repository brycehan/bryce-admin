import request from '@/utils/request'

/**
 * 保存微信公众号粉丝
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/mp/user', data)
  } else {
    return request.post('/mp/user', data)
  }
}

/**
 * 删除微信公众号粉丝
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: bigint[]) => {
  return request.delete('/mp/user', { data: { ids } })
}

/**
 * 查询微信公众号粉丝详情
 *
 * @param id ID
 */
export const getByIdApi = (id: bigint) => {
  return request.get(`/mp/user/${id}`)
}

/**
 * 微信公众号粉丝分页查询
 *
 * @param data 参数
 */
export const postPageApi = (data: any) => {
  return request.post('/mp/user/page', data)
}
