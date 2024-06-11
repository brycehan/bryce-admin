import request from '@/utils/request'

/**
 * 获取服务器相关信息
 */
export const getServerInfoApi = () => {
  return request.get('/monitor/server/info')
}
