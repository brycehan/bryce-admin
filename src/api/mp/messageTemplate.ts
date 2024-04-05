import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/mp/messageTemplate', data)
  } else {
    return request.post('/mp/messageTemplate', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/mp/messageTemplate', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/mp/messageTemplate/${id}`)
}

export const page = (data: any) => {
  return request.post('/mp/messageTemplate/page', data)
}
