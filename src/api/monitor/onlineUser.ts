import request from '@/utils/request'

/**
 * 在线用户分页查询
 *
 * @param data 参数
 */
export const postPageApi = (data: any) => {
  return request.post('/monitor/onlineUser/page', data)
}

/**
 * 强制退出
 *
 * @param userKey 用户缓存键值
 */
export const deleteOnlineUserApi = (userKey: string) => {
  return request.delete(`/monitor/onlineUser/${userKey}`)
}
