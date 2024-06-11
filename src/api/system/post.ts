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

/**
 * 校验岗位编码是否唯一
 *
 * @param code 岗位编码
 * @param id 岗位ID
 */
export const getCheckCodeUniqueApi = (code: string, id: number) => {
  return request.get('/system/post/checkCodeUnique', { params: { id, code } })
}
