import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/system/dictType', data)
  } else {
    return request.post('/system/dictType', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/system/dictType', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/system/dictType/${id}`)
}

export const page = (data: any) => {
  return request.post('/system/dictType/page', data)
}

/**
 * 全部字典数据
 */
export const dictList = () => {
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
