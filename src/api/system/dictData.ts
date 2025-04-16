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
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/system/dictData', { data: { ids } })
}

/**
 * 系统字典数据分页查询
 *
 * @param data 参数
 */
export const postPageApi = (data: any) => {
  return request.post('/system/dictData/page', data)
}

/**
 * 查询系统字典数据详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
  return request.get(`/system/dictData/${id}`)
}

/**
 * 全部字典数据
 */
export const getDictListApi = () => {
  return request.get('/system/dictData/dictMap')
}

/**
 * 查询系统字典数据简单列表
 */
export const getSimpleListApi = () => {
  return request.get('/system/dictData/simple-list')
}

export default {
  saveOrUpdateApi,
  deleteByIdsApi,
  postPageApi,
  getByIdApi,
  getDictListApi,
  getSimpleListApi,
}
