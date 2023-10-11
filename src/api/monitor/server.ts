import request from '@/utils/request'

export const server = () => {
    return request.get('/monitor/server/info')
}