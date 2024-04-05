import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/quartz/jobLog', data)
  } else {
    return request.post('/quartz/jobLog', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/quartz/jobLog', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/quartz/jobLog/${id}`)
}

export const page = (data: any) => {
  return request.post('/quartz/jobLog/page', data)
}
