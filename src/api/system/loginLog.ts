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
 * 系统登录日志分页查询
 *
 * @param data 参数
 */
export const postPageApi = (data: any) => {
  return request.post('/system/loginLog/page', data)
}

/**
 * 清空登录日志
 */
export const deleteCleanApi = () => {
  return request.delete('/system/loginLog/clean')
}

/**
 * 系统登录日志导出
 */
export const postExportExcelApi = (data: any) => {
  download.post('/system/loginLog/export', data)
}
