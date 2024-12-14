import request from '@/utils/request'
import download from '@/utils/download'

/**
 * 保存系统字典类型
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
  if (data.id) {
    return request.put('/system/dictType', data)
  } else {
    return request.post('/system/dictType', data)
  }
}

/**
 * 删除系统字典类型
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: string[]) => {
  return request.delete('/system/dictType', { data: { ids } })
}

/**
 * 查询系统字典类型详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
  return request.get(`/system/dictType/${id}`)
}

/**
 * 系统字典类型分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
  return request.post('/system/dictType/page', data)
}

/**
 * 导出字典类型
 *
 * @param data 导出参数
 */
export const postExportExcelApi = (data: any) => {
  download.post('/system/dictType/export', data)
}

/**
 * 全部字典数据
 */
export const getDictListApi = () => {
  return request.get('/system/dictType/dictList')
}

/**
 * 校验字典类型编码是否唯一
 *
 * @param dictType 字典类型编码
 * @param id 字典类型ID
 */
export const getCheckDictTypeCodeUniqueApi = (dictType: string, id: number) => {
  return request.get('/system/dictType/checkDictTypeCodeUnique', { params: { id, dictType } })
}
