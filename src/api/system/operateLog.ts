import request from '@/utils/request'

/**
 * 删除系统操作日志
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: bigint[]) => {
  return request.delete('/system/operateLog', { data: { ids } })
}

/**
 * 查询系统操作日志详情
 *
 * @param id ID
 */
export const getByIdApi = (id: bigint) => {
  return request.get(`/system/operateLog/${id}`)
}

/**
 * 系统操作日志分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/system/operateLog/page', data)
}
