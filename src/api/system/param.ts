import request from '@/utils/request'
import download from '@/utils/download'

/**
 * 保存系统参数
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/system/param', data)
  } else {
    return request.post('/system/param', data)
  }
}

/**
 * 删除系统参数
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: bigint[]) => {
  return request.delete('/system/param', { data: { ids } })
}

/**
 * 查询系统参数详情
 *
 * @param id ID
 */
export const getByIdApi = (id: bigint) => {
  return request.get(`/system/param/${id}`)
}

/**
 * 系统参数分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/system/param/page', data)
}

/**
 * 导出系统参数
 *
 * @param data 导出参数
 */
export const postExportExcelApi = (data: any) => {
  download.post('/system/param/export', data)
}

/**
 * 校验系统参数键名是否唯一
 *
 * @param paramKey 参数键名
 * @param id 系统参数ID
 */
export const getCheckParamKeyUniqueApi = (paramKey: string, id: number) => {
  return request.get('/system/param/checkParamKeyUnique', { params: { id, paramKey } })
}
