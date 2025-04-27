import request from '@/utils/request'

/**
 * 保存流程抄送
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/bpm/processInstanceCopy', data)
  } else {
    return request.post('/bpm/processInstanceCopy', data)
  }
}

/**
 * 删除流程抄送
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/bpm/processInstanceCopy', { data: { ids } })
}

/**
 * 查询流程抄送详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
  return request.get(`/bpm/processInstanceCopy/${id}`)
}

/**
 * 流程抄送分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.get('/bpm/process-instance/copy/page', { params: data })
}

export default {
  saveOrUpdateApi,
  deleteByIdsApi,
  getByIdApi,
  postPageApi,
}
