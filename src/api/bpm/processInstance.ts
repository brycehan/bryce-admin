import request from '@/utils/request'

/**
 * 查询流程实例分页
 *
 * @param data 参数
 */
export const postProcessInstanceManagerPage = (data: any) => {
  return request.post('/bpm/process-instance/manager-page', data)
}

/**
 * 查询我的流程实例分页
 *
 * @param data 参数
 */
export const postProcessInstanceMyPage = (data: any) => {
  return request.post('/bpm/process-instance/my-page', data)
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
    reason: reason,
  }
  return request.delete('/bpm/process-instance/cancel-by-start-user', { data })
}

export const cancelProcessInstanceByAdmin = (id: number, reason: string) => {
  const data = {
    id: id,
    reason: reason,
  }
  return request.delete('/bpm/process-instance/cancel-by-admin', { data })
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

export default {
  postProcessInstanceManagerPage,
  postProcessInstanceMyPage,
  createProcessInstance,
  cancelProcessInstanceByStartUser,
  cancelProcessInstanceByAdmin,
  getProcessInstance,
  getProcessInstanceCopyPage,
  getApprovalDetail,
  getFormFieldsPermission,
  getProcessInstanceBpmnModelView,
}
