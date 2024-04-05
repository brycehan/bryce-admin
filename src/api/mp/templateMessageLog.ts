import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/mp/templateMessageLog', data)
  } else {
    return request.post('/mp/templateMessageLog', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/mp/templateMessageLog', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/mp/templateMessageLog/${id}`)
}

export const page = (data: any) => {
  return request.post('/mp/templateMessageLog/page', data)
}
