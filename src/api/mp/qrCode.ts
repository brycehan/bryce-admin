import request from '@/utils/request'

/**
 * 保存微信公众号带参二维码
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/mp/qrCode', data)
  } else {
    return request.post('/mp/qrCode', data)
  }
}

/**
 * 删除微信公众号带参二维码
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: bigint[]) => {
  return request.delete('/mp/qrCode', { data: { ids } })
}

/**
 * 查询微信公众号带参二维码详情
 * @param id ID
 */
export const getByIdApi = (id: bigint) => {
  return request.get(`/mp/qrCode/${id}`)
}

/**
 * 微信公众号带参二维码分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/mp/qrCode/page', data)
}
