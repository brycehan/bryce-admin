<template>
  <div class="w-full border border-gray-200 h-min-[500px]">
    <!-- 流程设计器，负责绘制流程等 -->
    <MyProcessDesigner
      key="designer"
      v-model="modelData.bpmnXml"
      v-bind="controlForm"
      ref="processDesigner"
      @init-finished="initModeler"
      :additionalModel="controlForm.additionalModel"
      @save="save"
      :process-id="modelKey"
      :process-name="modelName"
    />
    <!-- 流程属性器，负责编辑每个流程节点的属性 -->
    <MyProcessPenal
      v-if="modeler"
      key="penal"
      :bpmnModeler="modeler"
      :prefix="controlForm.prefix"
      class="process-panel"
      :model="modelData"
    />
  </div>
</template>

<script lang="ts" setup>
import { MyProcessDesigner, MyProcessPenal } from '@/components/bpmn-process-designer/package'
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
import CustomContentPadProvider from '@/components/bpmn-process-designer/package/designer/plugins/content-pad'
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from '@/components/bpmn-process-designer/package/designer/plugins/palette'
import { inject, onBeforeUnmount, provide, type Ref, ref, shallowRef } from 'vue'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'BpmModelEditor' })

defineProps<{
  modelId?: string
  modelKey: string
  modelName: string
  value?: string
}>()

const emit = defineEmits(['success', 'init-finished'])

// 表单信息
const formFields = ref<string[]>([])
const formType = ref(20)

provide('formFields', formFields)
provide('formType', formType)

// 注入流程数据
const xmlString = inject('processData') as Ref
// 注入模型数据
const modelData = inject('modelData') as Ref

const modeler = shallowRef() // BPMN Modeler
const processDesigner = ref()
const controlForm = ref({
  simulation: true,
  labelEditing: false,
  labelVisible: false,
  prefix: 'flowable',
  headerButtonSize: 'mini',
  additionalModel: [CustomContentPadProvider, CustomPaletteProvider]
})
const model = ref<any>() // 流程模型的信息

/**
 * 初始化 modeler
 */
const initModeler = async (item: any) => {
  //先初始化模型数据
  model.value = modelData.value
  modeler.value = item
}

/**
 * 添加/修改模型
 *
 * @param bpmnXml bpmnXml 字符串
 */
const save = async (bpmnXml: string) => {
  try {
    xmlString.value = bpmnXml
    emit('success', bpmnXml)
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}

// 在组件卸载时清理
onBeforeUnmount(() => {
  modeler.value = null
  // 清理全局实例
  const w = window as any
  if (w.bpmnInstances) {
    w.bpmnInstances = null
  }
})
</script>

<style lang="scss">
.process-panel__container {
  position: absolute;
  top: 172px;
  right: 70px;
}
</style>
