// BPM 模块

export enum BpmTypeEnum {
  // ========== BPM 模块 ==========
  BPM_MODEL_TYPE = 'bpm_model_type',
  BPM_MODEL_FORM_TYPE = 'bpm_model_form_type',
  BPM_PROCESS_INSTANCE_STATUS = 'bpm_process_instance_status',
  BPM_PROCESS_LISTENER_TYPE = 'bpm_process_listener_type',
  BPM_PROCESS_LISTENER_VALUE_TYPE = 'bpm_process_listener_value_type',
  BPM_TASK_STATUS = 'bpm_task_status',
  BPM_TASK_CANDIDATE_STRATEGY = 'bpm_task_candidate_strategy',
  BPM_OA_LEAVE_TYPE = 'bpm_oa_leave_type',
}

export enum BpmProcessVariableEnum {
  /**
   * 发起用户ID
   */
  START_USER_ID = 'PROCESS_START_USER_ID',
  /**
   * 发起时间
   */
  START_TIME = 'PROCESS_START_TIME',
  /**
   * 流程定义名称
   */
  PROCESS_DEFINITION_NAME = 'PROCESS_DEFINITION_NAME',
}

/**
 * BPM 模块类型
 */
export const BpmModelType = {
  BPMN: 0, // BPMN 设计器
  SIMPLE: 1, // 简易设计器
}

/**
 * BPM 表单类型
 */
export const BpmFormType = {
  NORMAL: 0, // 流程表单
  CUSTOM: 1, // 业务表单
}

export const BpmProcessDefinitionStatus = {
  NOT_PUBLISH: 0, // 未发布
  RUNNING: 1, // 运行中
  SUSPEND: 2, // 已挂起
}

/**
 * BPM 流程实例状态
 */
export const BpmProcessInstanceStatus = {
  NOT_START: -1, // 未开始
  RUNNING: 1, // 审批中
  APPROVE: 2, // 审批通过
  REJECT: 3, // 审批不通过
  CANCEL: 4, // 已取消
}

/**
 * BPM 自动审批类型
 */
export const BpmAutoApproveType = {
  NONE: 0, // 不自动通过
  APPROVE_ALL: 1, // 仅审批一次，后续重复的审批节点均自动通过
  APPROVE_SEQUENCE: 2, // 仅针对连续审批的节点自动通过
}

/**
 * BPM 流程实例状态
 */
export const BpmProcessInstanceStatusOptions: {
  label: string
  value: number
  type: 'info' | 'primary' | 'success' | 'danger' | 'warning'
}[] = [
  {
    label: '审批中',
    value: 1,
    type: 'primary',
  },
  {
    label: '审批通过',
    value: 2,
    type: 'success',
  },
  {
    label: '审批不通过',
    value: 3,
    type: 'danger',
  },
  {
    label: '已取消',
    value: 4,
    type: 'warning',
  },
]
