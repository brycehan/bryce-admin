import request from '@/utils/request'
import download from '@/utils/download'

/**
 * 删除系统操作日志
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/system/operateLog', { data: { ids } })
}

/**
 * 查询系统操作日志详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
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

/**
 * 清空操作日志
 */
export const deleteCleanApi = () => {
  return request.delete('/system/operateLog/clean')
}

/**
 * 导出操作日志
 *
 * @param data 导出参数
 */
export const postExportExcelApi = (data: any) => {
  download.post('/system/operateLog/export', data)
}
