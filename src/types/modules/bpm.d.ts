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
 * BPM 流程表单 Vo
 */
export type FormVo = {
  id: string
  name: string
  conf: string
  fields: string[]
  status: number
  remark: string
  createTime: string
}
