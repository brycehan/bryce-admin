import request from '@/utils/request'
import download from '@/utils/download'
// BPM 流程表达式 Vo
export interface ProcessExpressionVo {
  id: number // 编号
  name: string // 表达式名字
  status: number // 表达式状态
  expression: string // 表达式
}

// BPM 流程表达式 API
export const ProcessExpressionApi = {
  // 查询BPM 流程表达式分页
  getProcessExpressionPage: async (params: any) => {
    return await request.get(`/bpm/process-expression/page`, params)
  },

  // 查询BPM 流程表达式详情
  getProcessExpression: async (id: number) => {
    return await request.get(`/bpm/process-expression/get?id=` + id)
  },

  // 新增BPM 流程表达式
  createProcessExpression: async (data: any) => {
    return await request.post(`/bpm/process-expression/save`, data)
  },

  // 修改BPM 流程表达式
  updateProcessExpression: async (data: any) => {
    return await request.put(`/bpm/process-expression/update`, data)
  },

  // 删除BPM 流程表达式
  deleteProcessExpression: async (id: number) => {
    return await request.delete(`/bpm/process-expression/delete?id=` + id)
  },

  // 导出BPM 流程表达式 Excel
  exportProcessExpression: async (params: any) => {
    return await download.post(`/bpm/process-expression/export-excel`, params)
  }
}
