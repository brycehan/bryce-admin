<template>
    <bpm-model-editor
      v-if="modelData.type === BpmModelType.BPMN"
      :model-id="modelData.id"
      :model-key="modelData.key"
      :model-name="modelData.name"
      @success="handleDesignSuccess"
    />
</template>

<script setup lang="ts">
import { inject, nextTick, type Ref } from 'vue'
import BpmModelEditor from '@/components/bpmn-process-designer/index.vue'
import { BpmModelType } from '@/api/bpm/constant'

// 创建本地数据副本
const modelData = defineModel<any>()

const processData = inject('processData') as Ref

/**
 * 处理设计器保存成功
 *
 * @param data BPMN 数据
 */
const handleDesignSuccess = async (data?: any) => {
  if (data) {
    // 创建新的对象以触发响应式更新
    const newModelData = {
      ...modelData.value,
      bpmnXml: modelData.value.type === BpmModelType.BPMN ? data : null,
      simpleModel: modelData.value.type === BpmModelType.BPMN ? null : data
    }
    // 使用emit更新父组件的数据
    await nextTick()
    //更新表单的模型数据部分
    modelData.value = newModelData
  }
}

/**
 * 重置表单
 */
const resetFields = () => {
  // processData.value = null
}

/**
 * 表单校验
 */
const validate = () => {
  if (processData.value) {
    return true
  }
  throw new Error('请设计流程')
}

defineExpose({
  validate,
  resetFields
})
</script>
