import request from '@/utils/request'

/**
 * 获取缓存相关信息
 */
export const getInfoApi = () => {
  return request.get('/monitor/cache/info')
}
