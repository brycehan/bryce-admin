import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
    if (data.id) {
        return request.put('/system/param', data)
    } else {
        return request.post('/system/param', data)
    }
}

export const deleteByIds = (ids: bigint[]) => {
    return request.delete('/system/param', { data: { ids } })
}

export const getById = (id: bigint) => {
    return request.get(`/system/param/${id}`)
}

export const page = (data: any) => {
    return request.post('/system/param/page', data)
}
