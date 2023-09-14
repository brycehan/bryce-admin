import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
    if (data.id) {
        return request.put('/system/role', data)
    } else {
        return request.post('/system/role', data)
    }
}

export const deleteByIds = (ids: bigint[]) => {
    return request.delete('/system/role', { data: { ids } })
}

export const getById = (id: bigint) => {
    return request.get(`/system/role/${id}`)
}

export const page = (data: any) => {
    return request.post('/system/role/page', data)
}

export const list = () => {
    return request.get('/system/role/list')
}
