import request from '@/utils/request'
import download from '@/utils/download'

/**
 * 保存系统字典类型
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/system/dict-type', data)
  } else {
    return request.post('/system/dict-type', data)
  }
}

/**
 * 删除系统字典类型
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/system/dict-type', { data: { ids } })
}

/**
 * 查询系统字典类型详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
  return request.get(`/system/dict-type/${id}`)
}

/**
 * 系统字典类型分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/system/dict-type/page', data)
}

/**
 * 导出字典类型
 *
 * @param data 导出参数
 */
export const postExportExcelApi = (data: any) => {
  download.post('/system/dict-type/export', data)
}

/**
 * 获取字典类型下拉列表
 */
export const getSimpleListApi = () => {
  return request.get('/system/dict-type/simple-list')
}

/**
 * 校验字典类型编码是否唯一
 *
 * @param dictType 字典类型编码
 * @param idRef 字典类型ID
 */
export const getCheckDictTypeCodeUniqueApi = (dictType: string, idRef: Ref) => {
  return request.get('/system/dict-type/checkDictTypeCodeUnique', { params: { id: idRef.value, dictType } })
}
