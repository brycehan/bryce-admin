import request from '@/utils/request'
import download from '@/utils/download'

/**
 * 保存系统岗位
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/system/post', data)
  } else {
    return request.post('/system/post', data)
  }
}

/**
 * 删除系统岗位
 *
 * @param ids ID
 */
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/system/post', { data: { ids } })
}

/**
 * 查询系统岗位详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
  return request.get(`/system/post/${id}`)
}

/**
 * 系统岗位分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/system/post/page', data)
}

/**
 * 导出系统岗位
 *
 * @param data 导出参数
 */
export const postExportExcelApi = (data: any) => {
  download.post('/system/post/export', data)
}

/**
 * 查询系统岗位列表
 */
export const getSimpleList = () => {
  return request.get('/system/post/simple-list')
}

/**
 * 校验岗位编码是否唯一
 *
 * @param code 岗位编码
 * @param idRef 岗位ID
 */
export const getCheckCodeUniqueApi = (code: string, idRef: Ref) => {
  return request.get('/system/post/checkCodeUnique', { params: { id: idRef.value, code } })
}

export default {
  saveOrUpdateApi,
  deleteByIdsApi,
  getByIdApi,
  postPageApi,
  postExportExcelApi,
  getSimpleList,
  getCheckCodeUniqueApi,
}
