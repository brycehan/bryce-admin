import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/system/tenant', data)
  } else {
    return request.post('/system/tenant', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/system/tenant', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/system/tenant/${id}`)
}

export const page = (data: any) => {
  return request.post('/system/tenant/page', data)
}
