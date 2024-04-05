import request from '@/utils/request'

/**
 * 获取素材总数
 */
export const materialCount = () => {
    return request.get('/mp/material/materialCount')
}

/**
 * 获取素材总数列表
 *
 * @param mediaId 素材ID
 */
export const materialNewsInfo = (mediaId: string) => {
    return request.get(`/mp/material/materialNewsInfo/${mediaId}`)
}

/**
 * 根据类别获取非图文素材分页列表
 *
 * @param params 例如：{type: '', page: 1}
 */
export const materialFileBatchGet = (params: any) => {
    return request.get('/mp/material/materialFileBatchGet', {params})
}

/**
 * 获取图文素材分页列表
 * @param page 页码
 */
export const materialNewsBatchGet = (page: number) => {
    return request.get('/mp/material/materialNewsBatchGet', {params: {page}})
}

/**
 * 添加图文永久素材
 *
 * @param data 图文列表
 */
export const materialNewsUpload = (data: any) => {
    return request.post('/mp/material/materialNewsUpload', data)
}

/**
 * 修改图文素材文章
 *
 * @param data 图文素材文章
 */
export const materialArticleUpdate = (data: any) => {
    return request.post('/mp/material/materialArticleUpdate', data)
}

/**
 * 添加多媒体永久素材
 *
 * @param data 素材
 */
export const materialFileUpload = (data: any) => {
    return request.post('/mp/material/materialFileUpload', data)
}

/**
 * 删除临时素材
 *
 * @param mediaId 素材
 */
export const materialDelete = (mediaId: string) => {
    return request.delete(`/mp/material/${mediaId}`)
}
