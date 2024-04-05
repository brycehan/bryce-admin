import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/system/dictData', data)
  } else {
    return request.post('/system/dictData', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/system/dictData', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/system/dictData/${id}`)
}

export const page = (data: any) => {
  return request.post('/system/dictData/page', data)
}
