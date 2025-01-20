import request from '@/utils/request'
import download from '@/utils/download'

/**
 * 保存系统附件
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/system/attachment', data)
  } else {
    return request.post('/system/attachment', data)
  }
}

/**
 * 删除系统附件
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/system/attachment', { data: { ids } })
}

/**
 * 系统附件分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/system/attachment/page', data)
}

/**
 * 下载系统附件
 *
 * @param id ID
 */
export const downloadByIdApi = (id: string) => {
  return download.get(`/system/attachment/secure/download/${id}`)
}
