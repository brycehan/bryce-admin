import request from '@/utils/request'
import download from '@/utils/download'

/**
 * 删除系统登录日志
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: bigint[]) => {
  return request.delete('/system/loginLog', { data: { ids } })
}

/**
 * 查询系统登录日志详情
 *
 * @param id ID
 */
export const getByIdApi = (id: bigint) => {
  return request.get(`/system/loginLog/${id}`)
}

/**
 * 系统登录日志分页查询
 *
 * @param data 参数
 */
export const postPageApi = (data: any) => {
  return request.post('/system/loginLog/page', data)
}

/**
 * 系统登录日志导出
 */
export const postExportExcelApi = (data: any) => {
  download.post('/system/loginLog/export', data)
}
