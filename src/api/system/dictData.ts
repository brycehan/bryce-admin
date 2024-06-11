import request from '@/utils/request'

/**
 * 保存系统字典数据
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/system/dictData', data)
  } else {
    return request.post('/system/dictData', data)
  }
}

/**
 * 删除系统字典数据
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: bigint[]) => {
  return request.delete('/system/dictData', { data: { ids } })
}

/**
 * 查询系统字典数据详情
 *
 * @param id ID
 */
export const getByIdApi = (id: bigint) => {
  return request.get(`/system/dictData/${id}`)
}

/**
 * 系统字典数据分页查询
 *
 * @param data 参数
 */
export const postPageApi = (data: any) => {
  return request.post('/system/dictData/page', data)
}
