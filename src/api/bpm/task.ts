import request from '@/utils/request'

/**
 * 任务状态枚举
 */
export enum TaskStatusEnum {
  /**
   * 未开始
   */
  NOT_START = -1,

  /**
   * 待审批
   */
  WAIT = 0,
  /**
   * 审批中
   */
  RUNNING = 1,
  /**
   * 审批通过
   */
  APPROVE = 2,

  /**
   * 审批不通过
   */
  REJECT = 3,

  /**
   * 已取消
   */
  CANCEL = 4,
  /**
   * 已退回
   */
  RETURN = 5,

  /**
   * 委派中
   */
  ASSIGNMENT = 6,
  /**
   * 审批通过中
   */
  APPROVING = 7,
}

export const BpmTaskStatusOptions = [
  {
    label: '待审批',
    value: TaskStatusEnum.WAIT,
    type: 'info',
  },
  {
    label: '审批中',
    value: TaskStatusEnum.RUNNING,
    type: 'primary',
  },
  {
    label: '审批通过',
    value: TaskStatusEnum.APPROVE,
    type: 'success',
  },
  {
    label: '审批不通过',
    value: TaskStatusEnum.REJECT,
    type: 'danger',
  },
  {
    label: '已取消',
    value: TaskStatusEnum.CANCEL,
    type: 'info',
  },
  {
    label: '已退回',
    value: TaskStatusEnum.RETURN,
    type: 'warning',
  },
  {
    label: '委派中',
    value: TaskStatusEnum.ASSIGNMENT,
    type: 'primary',
  },
  {
    label: '审批通过中',
    value: TaskStatusEnum.APPROVING,
    type: 'success',
  },
]

export const postTaskTodoPage = (params: any) => {
  return request.get('/bpm/task/todo-page', { params: params })
}

export const postTaskDonePage = async (data: any) => {
  return await request.get('/bpm/task/done-page', { params: data })
}

export const postTaskManagerPage = async (data: any) => {
  return await request.post('/bpm/task/manager-page', data)
}

export const approveTask = async (data: any) => {
  return await request.put('/bpm/task/approve', data)
}

export const rejectTask = async (data: any) => {
  return await request.put('/bpm/task/reject', data)
}

export const getTaskListByProcessInstanceId = async (processInstanceId: string) => {
  return await request.get('/bpm/task/list-by-process-instance-id?processInstanceId=' + processInstanceId)
}

// 获取所有可退回的节点
export const getTaskListByReturn = async (id: string) => {
  return await request.get('/bpm/task/list-by-return', { params: id })
}

// 退回
export const returnTask = async (data: any) => {
  return await request.put('/bpm/task/return', data)
}

// 委派
export const delegateTask = async (data: any) => {
  return await request.put('/bpm/task/delegate', data)
}

// 转派
export const transferTask = async (data: any) => {
  return await request.put('/bpm/task/transfer', data)
}

// 加签
export const signCreateTask = async (data: any) => {
  return await request.put('/bpm/task/create-sign', data)
}

// 减签
export const signDeleteTask = async (data: any) => {
  return await request.delete('/bpm/task/delete-sign', data)
}

// 抄送
export const copyTask = async (data: any) => {
  return await request.put('/bpm/task/copy', data)
}

// 获取我的待办任务
export const myTodoTask = async (processInstanceId: string) => {
  return await request.get('/bpm/task/my-todo?processInstanceId=' + processInstanceId)
}

// 获取减签任务列表
export const getChildrenTaskList = async (id: string) => {
  return await request.get('/bpm/task/list-by-parent-task-id?parentTaskId=' + id)
}

export default {
  BpmTaskStatusOptions,
  postTaskTodoPage,
  postTaskDonePage,
  postTaskManagerPage,
  approveTask,
  rejectTask,
  getTaskListByProcessInstanceId,
  getTaskListByReturn,
  returnTask,
  delegateTask,
  transferTask,
  signCreateTask,
  signDeleteTask,
  copyTask,
  myTodoTask,
  getChildrenTaskList,
}
