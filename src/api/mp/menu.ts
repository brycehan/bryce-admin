import request from '@/utils/request'

/**
 * 保存/更新微信菜单
 * @param data 微信菜单
 */
export const saveOrUpdate = (data: any) => {
    return request.post('/mp/menu', data)
}

/**
 * 获取微信公众号菜单
 */
export const getMenu = () => {
    return request.get('/mp/menu')
}

/**
 * 从本地缓存发布微信公众号菜单
 */
export const publishByCache = () => {
    return request.get('/mp/menu/publishByCache')
}
