import request from '@/utils/request'
import download from '@/utils/download'

/**
 * 保存quartz定时任务调度日志
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/quartz/jobLog', data)
  } else {
    return request.post('/quartz/jobLog', data)
  }
}

/**
 * 删除quartz定时任务调度日志
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: bigint[]) => {
  return request.delete('/quartz/jobLog', { data: { ids } })
}

/**
 * 查询quartz定时任务调度日志详情
 *
 * @param id ID
 */
export const getByIdApi = (id: bigint) => {
  return request.get(`/quartz/jobLog/${id}`)
}

/**
 * quartz定时任务调度日志分页查询
 *
 * @param data 参数
 */
export const postPageApi = (data: any) => {
  return request.post('/quartz/jobLog/page', data)
}

/**
 * 导出定时任务日志
 *
 * @param data 导出参数
 */
export const postExportExcelApi = (data: any) => {
  download.post('/quartz/jobLog/export', data)
}

/**
 * 清空quartz定时任务调度日志
 */
export const deleteCleanApi = () => {
  return request.delete('/quartz/jobLog/clean')
}
