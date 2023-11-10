import request from '@/utils/request'

export const saveOrUpdate = (data: any) => {
    if (data.id) {
        return request.put('/wechat/app', data)
    } else {
        return request.post('/wechat/app', data)
    }
}

export const deleteByIds = (ids: bigint[]) => {
    return request.delete('/wechat/app', { data: { ids } })
}

export const getById = (id: bigint) => {
    return request.get(`/wechat/app/${id}`)
}

export const page = (data: any) => {
    return request.post('/wechat/app/page', data)
}

export const list = (data: any) => {
    return request.post('/wechat/app/list', data)
}
