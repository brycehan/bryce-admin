import request from '@/utils/request'

/**
 * 保存流程定义信息
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
    if (data.id) {
        return request.put('/bpm/processDefinitionInfo', data)
    } else {
        return request.post('/bpm/processDefinitionInfo', data)
    }
}

/**
 * 删除流程定义信息
 *
 * @param ids ID数组
 */
export const deleteByIdsApi = (ids: string[]) => {
    return request.delete('/bpm/processDefinitionInfo', { data: { ids } })
}

/**
 * 查询流程定义信息详情
 *
 * @param id ID
 */
export const getByIdApi = (id: string) => {
    return request.get(`/bpm/processDefinitionInfo/${id}`)
}

/**
 * 流程定义信息分页查询
 *
 * @param data 分页参数
 */
export const postPageApi = (data: any) => {
    return request.post('/bpm/processDefinitionInfo/page', data)
}
