import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/system/attachment', data)
  } else {
    return request.post('/system/attachment', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/system/attachment', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/system/attachment/${id}`)
}

export const page = (data: any) => {
  return request.post('/system/attachment/page', data)
}
