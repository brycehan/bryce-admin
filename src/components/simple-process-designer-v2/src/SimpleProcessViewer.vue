<template>
  <SimpleProcessModel :flow-node="simpleModel" :readonly="true" />
</template>

<script setup lang="ts">
import { onMounted, provide, reactive, ref, watch } from 'vue'
import { useWatchNode } from './nodeUtils.ts'
import { type SimpleFlowNode } from './consts'
import SimpleProcessModel from '@/components/simple-process-designer-v2/src/SimpleProcessModel.vue'

defineOptions({
  name: 'SimpleProcessViewer'
})

const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    required: true
  },
  // 流程任务
  tasks: {
    type: Array,
    default: () => [] as any[]
  },
  // 流程实例
  processInstance: {
    type: Object,
    default: () => undefined
  }
})
const approveTasks = ref<any[]>(props.tasks)
const currentProcessInstance = ref(props.processInstance)
const simpleModel = useWatchNode(props)
watch(
  () => props.tasks,
  (newValue) => {
    approveTasks.value = newValue
  }
)
watch(
  () => props.processInstance,
  (newValue) => {
    currentProcessInstance.value = newValue
  }
)

provide('tasks', approveTasks)
provide('processInstance', currentProcessInstance)
</script>
