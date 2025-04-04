declare module '*.svg'
declare module '*.scss'
declare module '*.ts'
declare module '*.js'
declare module '*.mjs'
declare module '*'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@kangc/v-md-editor'

// 修复 modelValue does not exist in type 问题
declare module '@form-create/element-ui' {
  interface FormRule<O, C, R, A> {
    modelValue?: any; // 根据实际类型替换any
  }
}
