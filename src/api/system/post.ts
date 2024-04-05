import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/system/post', data)
  } else {
    return request.post('/system/post', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/system/post', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/system/post/${id}`)
}

export const page = (data: any) => {
  return request.post('/system/post/page', data)
}

export const list = () => {
  return request.get('/system/post/list')
}
