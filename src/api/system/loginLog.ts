import request from '@/utils/request'
import download from '@/utils/download'

export const saveOrUpdate = (data: any) => {
  if (data.id) {
    return request.put('/system/loginLog', data)
  } else {
    return request.post('/system/loginLog', data)
  }
}

export const deleteByIds = (ids: bigint[]) => {
  return request.delete('/system/loginLog', { data: { ids } })
}

export const getById = (id: bigint) => {
  return request.get(`/system/loginLog/${id}`)
}

export const page = (data: any) => {
  return request.post('/system/loginLog/page', data)
}

/**
 * 导出
 */
export const downloadExcel = (data: any) => {
  download.post('/system/loginLog/export', data)
}
