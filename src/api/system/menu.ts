import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/system/menu', data)
  } else {
    return request.post('/system/menu', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/system/menu', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/system/menu/${id}`)
}

export const page = (data: any) => {
  return request.post('/system/menu/page', data)
}

export const list = (data: any) => {
  return request.post('/system/menu/list', data)
}
