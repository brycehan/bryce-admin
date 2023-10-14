import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
    if (data.id) {
        return request.put('/system/notice', data)
    } else {
        return request.post('/system/notice', data)
    }
}

export const deleteByIds = (ids: bigint[]) => {
    return request.delete('/system/notice', { data: { ids } })
}

export const getById = (id: bigint) => {
    return request.get(`/system/notice/${id}`)
}

export const page = (data: any) => {
    return request.post('/system/notice/page', data)
}
