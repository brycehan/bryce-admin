import request from '@/utils/request'

export const saveOrUpdate = (appId: string, data: any) => {
    return request.put(`/wechat/menu/${appId}`, data)
}

export const deleteByAppId = (appId: string) => {
    return request.delete(`/wechat/menu/${appId}`, { data: { appId } })
}

export const getById = (appId: string) => {
    return request.get(`/wechat/menu/${appId}`)
}

