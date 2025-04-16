// 左侧拖拽按钮
export interface MenuItem {
  label: string
  name: string
  icon: string
}

// 左侧拖拽按钮分类
export interface Menu {
  //菜单名
  title: string
  //菜单id
  name: string
  list: MenuItem[]
}

export interface MenuList extends Array<Menu> {}

// 拖拽组件的规则
export interface DragRule {
  icon: string
  name: string
  label: string
  children?: string
  inside?: true
  drag?: true | string
  dragBtn?: false
  mask?: false

  rule(): any

  props(v: any, v1: any): any[]
}

// 通用下拉组件 Props 类型
export interface ApiSelectProps {
  name: string // 组件名称
  labelField?: string // 选项标签
  valueField?: string // 选项的值
  url?: string // url 接口
  isDict?: boolean // 是否字典选择器
}

// 选择组件规则配置类型
export interface SelectRuleOption {
  label: string // label 名称
  name: string // 组件名称
  icon: string // 组件图标
  props?: any[] // 组件规则
}
