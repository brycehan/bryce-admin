/**
 * BPM 流程定义 Dto
 */
export type ProcessDefinitionDto = {
  id: string
  version: number
  deploymentTIme: string
  suspensionState: number
  formType?: number
}

/**
 * BPM 流程模型 Dto
 */
export type ModelDto = {
  id: number
  formName: string
  key: string
  name: string
  description: string
  category: string
  formType: number
  formId: number
  formCustomCreatePath: string
  formCustomViewPath: string
  processDefinition: ProcessDefinitionDto
  status: number
  remark: string
  createTime: string
  bpmnXml: string
}

/**
 * BPM 流程分类 Vo
 */
export interface CategoryVo {
  id: string // 分类编号
  name: string // 分类名
  code: string // 分类标志
  description: string // 分类描述
  sort: number // 分类排序
  status: number // 分类状态
}

/**
 * BPM 流程表单 Dto
 */
export type FormDto = {
  id: string
  name: string
  conf: string
  fields: string[]
  status: number
  remark: string
  createTime: string
}

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

/**
 * BPM 流程监听器 Dto
 */
export interface BpmProcessListenerDto {
  id: number // 编号
  name: string // 监听器名称
  type: string // 监听器类型
  status: number // 监听器状态
  event: string // 监听事件
  valueType: string // 监听器值类型
  value: string // 监听器值
}

/**
 * BPM 用户组 Dto
 */
export type UserGroupDto = {
  id: number
  name: string
  description: string
  userIds: number[]
  status: number
  remark: string
  createTime: string
}
