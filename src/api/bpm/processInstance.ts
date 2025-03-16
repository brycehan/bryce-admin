import request from '@/utils/request'

/**
 * 流程任务
 */
export type Task = {
    id: string
    name: string
}

/**
 * 流程实例信息
 */
export type ProcessInstanceVo = {
    id: number
    name: string
    processDefinitionId: string
    category: string
    result: number
    tasks: Task[]
    fields: string[]
    status: number
    remark: string
    businessKey: string
    createTime: string
    endTime: string
    processDefinition?: any
}

/**
 * 用户信息
 */
export type User = {
    id: number
    nickname: string
    avatar: string
}

/**
 * 审批任务信息
 */
export type ApprovalTaskInfo = {
    id: number
    ownerUser: User
    assigneeUser: User
    status: number
    reason: string
    signPicUrl: string
}

/**
 * 审批节点信息
 */
export type ApprovalNodeInfo = {
    id: number
    name: string
    nodeType: any
    candidateStrategy?: any
    status: number
    startTime?: Date
    endTime?: Date
    candidateUsers?: User[]
    tasks: ApprovalTaskInfo[]
}

export const getProcessInstanceMyPage = (params: any) => {
    return request.get('/bpm/process-instance/my-page', { params })
}

export const getProcessInstanceManagerPage = (params: any) => {
    return request.get('/bpm/process-instance/manager-page', { params })
}

/**
 * 创建流程实例
 *
 * @param data 参数
 */
export const createProcessInstance = (data: any) => {
    return request.post('/bpm/process-instance', data)
}

export const cancelProcessInstanceByStartUser = (id: number, reason: string) => {
    const data = {
        id: id,
        reason: reason
    }
    return request.delete('/bpm/process-instance/cancel-by-start-user', { data })
}

export const cancelProcessInstanceByAdmin = (id: number, reason: string) => {
    const data = {
        id: id,
        reason: reason
    }
    return request.delete( '/bpm/process-instance/cancel-by-admin', { data })
}

export const getProcessInstance = (id: string) => {
    return request.get('/bpm/process-instance/get?id=' + id)
}

export const getProcessInstanceCopyPage = (params: any) => {
    return request.get('/bpm/process-instance/copy/page', { params })
}

// 获取审批详情
export const getApprovalDetail = (params: any) => {
    return request.get('bpm/process-instance/get-approval-detail', { params })
}

// 获取表单字段权限
export const getFormFieldsPermission = (params: any) => {
    return request.get('/bpm/process-instance/get-form-fields-permission', { params })
}

// 获取流程实例的 BPMN 模型视图
export const getProcessInstanceBpmnModelView = (id: string) => {
    return request.get('/bpm/process-instance/get-bpmn-model-view?id=' + id)
}
