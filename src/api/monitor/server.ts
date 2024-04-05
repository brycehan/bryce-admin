import request from '@/utils/request'

export const info = () => {
  return request.get('/monitor/server/info')
}
