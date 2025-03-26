import request from '@/utils/request'

/**
 * 保存流程表达式
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/bpm/processExpression', data)
  } else {
    return request.post('/bpm/processExpression', data)
  }
}

/**
 * 删除流程表达式
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/bpm/processExpression', { data: { ids } })
}

/**
 * 查询流程表达式详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
  return request.get(`/bpm/processExpression/${id}`)
}

/**
 * 流程表达式分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/bpm/processExpression/page', data)
}

export default {
  saveOrUpdateApi,
  deleteByIdsApi,
  getByIdApi,
  postPageApi
}
