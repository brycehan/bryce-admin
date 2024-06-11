import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/system/param', data)
  } else {
    return request.post('/system/param', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/system/param', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/system/param/${id}`)
}

export const page = (data: any) => {
  return request.post('/system/param/page', data)
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
