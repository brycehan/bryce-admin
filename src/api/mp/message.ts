import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/mp/message', data)
  } else {
    return request.post('/mp/message', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/mp/message', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/mp/message/${id}`)
}

export const page = (data: any) => {
  return request.post('/mp/message/page', data)
}
