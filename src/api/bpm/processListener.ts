import request from '@/utils/request'

// BPM 流程监听器 Vo
export interface BpmProcessListenerVo {
  id: number // 编号
  name: string // 监听器名字
  type: string // 监听器类型
  status: number // 监听器状态
  event: string // 监听事件
  valueType: string // 监听器值类型
  value: string // 监听器值
}

// BPM 流程监听器 API
export const ProcessListenerApi = {

  // 查询流程监听器分页
  getProcessListenerPage: async (params: any) => {
    return await request.get('/bpm/processListener/page', { params })
  },

  // 查询流程监听器详情
  getProcessListener: async (id: number) => {
    return await request.get(`/bpm/processListener/get?id=` + id)
  },

  // 新增流程监听器
  createProcessListener: async (data: any) => {
    return await request.post('/bpm/processListener', data)
  },

  // 修改流程监听器
  updateProcessListener: async (data: any) => {
    return await request.put('/bpm/processListener', data)
  },

  // 删除流程监听器
  deleteProcessListener: async (id: number) => {
    return await request.delete(`/bpm/processListener/delete?id=` + id)
  }
}
