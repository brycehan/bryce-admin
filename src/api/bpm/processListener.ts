import request from '@/utils/request'
import type { BpmProcessListenerDto } from '@/types/modules/bpm'

/**
 * 保存流程监听器
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: BpmProcessListenerDto) => {
  if (data.id) {
    return request.put('/bpm/process-listener', data)
  } else {
    return request.post('/bpm/process-listener', data)
  }
}

/**
 * 删除流程监听器
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/bpm/process-listener', { data: { ids } })
}

/**
 * 查询流程监听器详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
  return request.get(`/bpm/process-listener/${id}`)
}

/**
 * 流程监听器分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/bpm/process-listener/page', data)
}

export default {
  saveOrUpdateApi,
  deleteByIdsApi,
  getByIdApi,
  postPageApi,
}
