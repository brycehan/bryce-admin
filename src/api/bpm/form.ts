import request from '@/utils/request'
import type { FormVo } from '@/types/modules/bpm'

/**
 * 保存表单定义
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: FormVo) => {
    if (data.id) {
        return request.put('/bpm/form', data)
    } else {
        return request.post('/bpm/form', data)
    }
}

/**
 * 删除表单定义
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: string[]) => {
    return request.delete('/bpm/form', { data: { ids } })
}

/**
 * 查询表单定义详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
    return request.get(`/bpm/form/${id}`)
}

/**
 * 表单定义分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
    return request.post('/bpm/form/page', data)
}

/**
 * 流程表单列表查询
 *
 * @param data 列表参数
 */
export const postListApi = async (data: any) => {
    return await request.post('/bpm/form/list', data)
}

export default {
    saveOrUpdateApi,
    deleteByIdsApi,
    getByIdApi,
    postPageApi,
    postListApi
}
