import request from '@/utils/request'
import type { ModelDto } from '@/types/modules/bpm'

/**
 * 保存流程模型信息
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: ModelDto) => {
  if (data.id) {
    return request.put('/bpm/model', data)
  } else {
    return request.post('/bpm/model', data)
  }
}

/**
 * 删除流程模型信息
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/bpm/model', { data: ids })
}

/**
 * 查询流程模型信息详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
  return request.get(`/bpm/model/${id}`)
}

/**
 * 流程模型信息分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/bpm/model/page', data)
}

/**
 * 部署流程模型
 *
 * @param id 流程id
 */
export const deployModelApi = (id: string) => {
  return request.post(`/bpm/model/deploy?id=${id}`)
}

/**
 * 更新流程状态
 *
 * @param id ID
 * @param state 状态（1：启用，0：停用）
 */
export const patchState = (id: string, state: number) => {
  return request.patch(`/bpm/model/${id}/${state}`)
}

/**
 * 清除流程模型
 *
 * @param id 模型ID
 */
export const cleanById = (id: string) => {
  return request.delete(`/bpm/model/clean/${id}`)
}

/**
 * 校验Key是否唯一
 *
 * @param key 流程标识
 * @param id 模型ID
 */
export const getCheckKeyUniqueApi = (key: string, id: string) => {
  return request.get('/bpm/model/checkKeyUnique', { params: { id, key } })
}

export default {
  saveOrUpdateApi,
  cleanById,
  getByIdApi,
  postPageApi,
  deployModelApi,
  patchState,
  deleteByIdsApi,
  getCheckKeyUniqueApi,
}
