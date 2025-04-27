import request from '@/utils/request'

/**
 * 流程定义详情查询
 *
 * @param id 流程定义编号
 */
export const getById = (id: string) => {
  return request.get(`/bpm/process-definition/${id}`)
}

/**
 * 流程定义分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/bpm/process-definition/page', data)
}

/**
 * 流程定义列表查询（发起流程功能）
 *
 * @param data 列表参数
 */
export const postListApi = (data: any) => {
  return request.post('/bpm/process-definition/list', data)
}

export default {
  getById,
  postPageApi,
  postListApi,
}
