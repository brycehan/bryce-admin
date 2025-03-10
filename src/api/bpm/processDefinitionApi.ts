import request from '@/utils/request'

/**
 * 流程定义详情查询
 *
 * @param id 流程定义编号
 */
export const getById = (id: string) => {
    return request.get(`/bpm/process-definition/${id}`)
}

/**
 * 流程定义分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
    return request.post('/bpm/process-definition/page', data)
}

export default {
    getById,
    postPageApi
}
