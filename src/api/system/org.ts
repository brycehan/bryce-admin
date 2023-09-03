import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
    if (data.id) {
        return request.put('/system/org', data)
    } else {
        return request.post('/system/org', data)
    }
}

export const deleteByIds = (ids: bigint[]) => {
    return request.delete('/system/org', { data: { ids } })
}

export const getById = (id: bigint) => {
    return request.get(`/system/org/${id}`)
}

export const list = (data: any) => {
    return request.post('/system/org/list', data)
}
