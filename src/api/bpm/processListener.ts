import request from '@/utils/request'

// BPM 流程监听器 Vo
export interface BpmProcessListenerVo {
  id: number // 编号
  name: string // 监听器名称
  type: string // 监听器类型
  status: number // 监听器状态
  event: string // 监听事件
  valueType: string // 监听器值类型
  value: string // 监听器值
}

/**
 * 保存流程监听器
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/bpm/processListener', data)
  } else {
    return request.post('/bpm/processListener', data)
  }
}

/**
 * 删除流程监听器
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/bpm/processListener', { data: { ids } })
}

/**
 * 查询流程监听器详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
  return request.get(`/bpm/processListener/${id}`)
}

/**
 * 流程监听器分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/bpm/processListener/page', data)
}

export default {
  saveOrUpdateApi,
  deleteByIdsApi,
  getByIdApi,
  postPageApi
}
