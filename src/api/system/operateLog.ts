import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/system/operateLog', data)
  } else {
    return request.post('/system/operateLog', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/system/operateLog', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/system/operateLog/${id}`)
}

export const page = (data: any) => {
  return request.post('/system/operateLog/page', data)
}
