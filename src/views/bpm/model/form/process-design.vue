<template>
  <template v-if="model.type === BpmModelType.BPMN">
    <bpm-model-editor
        v-if="showDesigner"
        :model-id="model.id"
        :model-key="model.key"
        :model-name="model.name"
        @success="handleDesignSuccess"
      />
  </template>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, type Ref } from 'vue'
import BpmModelEditor from '@/components/bpmn-process-designer/index.vue'
import { BpmModelType } from '@/api/bpm/constant'

// 创建本地数据副本
const model = defineModel<any>()

const processData = inject('processData') as Ref

/**
 * 表单校验
 */
const validate = () => {
  if (processData.value) {
    return true
  }
  throw new Error('请设计流程')
}

/**
 * 重置表单
 */
const resetFields = () => {
  processData.value = null
}

/**
 * 处理设计器保存成功
 *
 * @param data BPMN 数据
 */
const handleDesignSuccess = async (data?: any) => {
  if (data) {
    // 创建新的对象以触发响应式更新
    const newModelData = {
      ...model.value,
      bpmnXml: model.value.type === BpmModelType.BPMN ? data : null,
      simpleModel: model.value.type === BpmModelType.BPMN ? null : data
    }
    // 使用emit更新父组件的数据
    await nextTick()
    //更新表单的模型数据部分
    model.value = newModelData
  }
}

/**
 * 是否显示设计器
 */
const showDesigner = computed(() => {
  return Boolean(model.value?.key && model.value?.name)
})

defineExpose({
  validate,
  resetFields
})
</script>
