import request from '@/utils/request'

/**
 * 表单Vo
 */
export type FormVo = {
    /**
     * 主键
     */
    id: number
    /**
     * 名称
     */
    name: string
    /**
     * 配置
     */
    conf: string
    /**
     * 字段数组
     */
    fields: string[]
    /**
     * 状态
     */
    status: number
    /**
     * 备注
     */
    remark: string
    /**
     * 创建时间
     */
    createTime: string
}
/**
 * 保存表单定义
 *
 * @param data 参数
 */
export const saveOrUpdateApi = (data: any) => {
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
