import request from '@/utils/request'

export const page = (data: any) => {
    return request.post('/monitor/onlineUser/page', data)
}

export const deleteByTokenKey = (tokenKey: string) => {
    return request.delete(`/monitor/onlineUser/${tokenKey}`)
}