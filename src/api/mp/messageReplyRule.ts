import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/mp/messageReplyRule', data)
  } else {
    return request.post('/mp/messageReplyRule', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/mp/messageReplyRule', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/mp/messageReplyRule/${id}`)
}

export const page = (data: any) => {
  return request.post('/mp/messageReplyRule/page', data)
}
