import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
    if (data.id) {
        return request.put('/mp/qrCode', data)
    } else {
        return request.post('/mp/qrCode', data)
    }
}

export const deleteByIds = (ids: bigint[]) => {
    return request.delete('/mp/qrCode', { data: { ids } })
}

export const getById = (id: bigint) => {
    return request.get(`/mp/qrCode/${id}`)
}

export const page = (data: any) => {
    return request.post('/mp/qrCode/page', data)
}
