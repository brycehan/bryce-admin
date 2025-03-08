import request from '@/utils/request'

/**
 * 保存用户组
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
    if (data.id) {
        return request.put('/bpm/userGroup', data)
    } else {
        return request.post('/bpm/userGroup', data)
    }
}

/**
 * 删除用户组
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: string[]) => {
    return request.delete('/bpm/userGroup', { data: { ids } })
}

/**
 * 查询用户组详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
    return request.get(`/bpm/userGroup/${id}`)
}

/**
 * 用户组分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
    return request.post('/bpm/userGroup/page', data)
}

/**
 * 用户组列表查询
 *
 * @param data 查询参数
 */
export const getSimpleList = (data: any) => {
    return request.get('/bpm/userGroup/simple-list', { params: data})
}

export default {
    saveOrUpdateApi,
    deleteByIdsApi,
    getByIdApi,
    postPageApi,
    getSimpleList
}
