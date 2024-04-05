import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
    if (data.id) {
        return request.put('/mp/user', data)
    } else {
        return request.post('/mp/user', data)
    }
}

export const deleteByIds = (ids: bigint[]) => {
    return request.delete('/mp/user', { data: { ids } })
}

export const getById = (id: bigint) => {
    return request.get(`/mp/user/${id}`)
}

export const page = (data: any) => {
    return request.post('/mp/user/page', data)
}
