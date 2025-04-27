import request from '@/utils/request'
import type { CategoryVo } from '@/types/modules/bpm'

/**
 * 保存流程分类
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: CategoryVo) => {
  if (data.id) {
    return request.put('/bpm/category', data)
  } else {
    return request.post('/bpm/category', data)
  }
}

/**
 * 删除流程分类
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/bpm/category', { data: { ids } })
}

/**
 * 查询流程分类详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
  return request.get(`/bpm/category/${id}`)
}

/**
 * 流程分类分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/bpm/category/page', data)
}

/**
 * 流程分类列表查询
 *
 * @param data 列表参数
 */
export const postListApi = async (data: any) => {
  return await request.post('/bpm/category/list', data)
}
