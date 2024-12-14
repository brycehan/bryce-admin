import request from '@/utils/request'
import download from '@/utils/download'

/**
 * 保存quartz定时任务调度
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/quartz/job', data)
  } else {
    return request.post('/quartz/job', data)
  }
}

/**
 * 删除quartz定时任务调度
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/quartz/job', { data: { ids } })
}

/**
 * 查询quartz定时任务调度详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
  return request.get(`/quartz/job/${id}`)
}

/**
 * quartz定时任务调度分页查询
 *
 * @param data 参数
 */
export const postPageApi = (data: any) => {
  return request.post('/quartz/job/page', data)
}

/**
 * 导出定时任务
 *
 * @param data 导出参数
 */
export const postExportExcelApi = (data: any) => {
  download.post('/quartz/job/export', data)
}

/**
 * 立即执行quartz定时任务
 *
 * @param data 参数
 */
export const putRunApi = (data: any) => {
  return request.put('/quartz/job/run', data)
}

/**
 * 修改quartz定时任务状态
 *
 * @param data 参数
 */
export const putStatusApi = (data: any) => {
  return request.put('/quartz/job/status', data)
}
