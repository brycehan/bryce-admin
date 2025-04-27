import MyProcessDesigner from './ProcessDesigner.vue'
import MyProcessViewer from './ProcessViewer.vue'

MyProcessDesigner.install = function (Vue: any) {
  Vue.component(MyProcessDesigner.name, MyProcessDesigner)
  Vue.component(MyProcessViewer.name, MyProcessViewer)
}

export {
  // 流程图的设计器，可编辑
  MyProcessDesigner,
  // 流程图的查看器，不可编辑
  MyProcessViewer,
}
