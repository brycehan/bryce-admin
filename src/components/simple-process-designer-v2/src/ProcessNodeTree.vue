<template>
  <!-- 发起人节点 -->
<!--  <StartUserNode-->
<!--    v-if="currentNode && currentNode.type === NodeType.START_USER_NODE"-->
<!--    :flow-node="currentNode"-->
<!--  />-->
<!--  &lt;!&ndash; 审批节点 &ndash;&gt;-->
<!--  <UserTaskNode-->
<!--    v-if="currentNode && currentNode.type === NodeType.USER_TASK_NODE"-->
<!--    :flow-node="currentNode"-->
<!--    @update:flow-node="handleModelValueUpdate"-->
<!--    @find:parent-node="findFromParentNode"-->
<!--  />-->
<!--  &lt;!&ndash; 抄送节点 &ndash;&gt;-->
<!--  <CopyTaskNode-->
<!--    v-if="currentNode && currentNode.type === NodeType.COPY_TASK_NODE"-->
<!--    :flow-node="currentNode"-->
<!--    @update:flow-node="handleModelValueUpdate"-->
<!--  />-->
<!--  &lt;!&ndash; 条件节点 &ndash;&gt;-->
<!--  <ExclusiveNode-->
<!--    v-if="currentNode && currentNode.type === NodeType.CONDITION_BRANCH_NODE"-->
<!--    :flow-node="currentNode"-->
<!--    @update:model-value="handleModelValueUpdate"-->
<!--    @find:parent-node="findFromParentNode"-->
<!--  />-->
<!--  &lt;!&ndash; 并行节点 &ndash;&gt;-->
<!--  <ParallelNode-->
<!--    v-if="currentNode && currentNode.type === NodeType.PARALLEL_BRANCH_NODE"-->
<!--    :flow-node="currentNode"-->
<!--    @update:model-value="handleModelValueUpdate"-->
<!--    @find:parent-node="findFromParentNode"-->
<!--  />-->
<!--  &lt;!&ndash; 包容分支节点 &ndash;&gt;-->
<!--  <InclusiveNode-->
<!--    v-if="currentNode && currentNode.type === NodeType.INCLUSIVE_BRANCH_NODE"-->
<!--    :flow-node="currentNode"-->
<!--    @update:model-value="handleModelValueUpdate"-->
<!--    @find:parent-node="findFromParentNode"-->
<!--  />-->
<!--  &lt;!&ndash; 延迟器节点 &ndash;&gt;-->
<!--  <DelayTimerNode-->
<!--    v-if="currentNode && currentNode.type === NodeType.DELAY_TIMER_NODE"-->
<!--    :flow-node="currentNode"-->
<!--    @update:flow-node="handleModelValueUpdate"-->
<!--  />-->
<!--  &lt;!&ndash; 路由分支节点 &ndash;&gt;-->
<!--  <RouterNode-->
<!--    v-if="currentNode && currentNode.type === NodeType.ROUTER_BRANCH_NODE"-->
<!--    :flow-node="currentNode"-->
<!--    @update:flow-node="handleModelValueUpdate"-->
<!--  />-->
   <!-- 触发器节点 -->
<!--   <TriggerNode-->
<!--    v-if="currentNode && currentNode.type === NodeType.TRIGGER_NODE"-->
<!--    :flow-node="currentNode"-->
<!--  />-->
<!--    @update:flow-node="handleModelValueUpdate"-->
  <!-- 递归显示孩子节点  -->
<!--  <ProcessNodeTree-->
<!--    v-if="currentNode && currentNode.childNode"-->
<!--    v-model:flow-node="currentNode.childNode"-->
<!--    :parent-node="currentNode"-->
<!--    @find:recursive-find-parent-node="recursiveFindParentNode"-->
<!--  />-->

<!--  &lt;!&ndash; 结束节点 &ndash;&gt;-->
<!--  <EndEventNode-->
<!--    v-if="currentNode && currentNode.type === NodeType.END_EVENT_NODE"-->
<!--    :flow-node="currentNode"-->
<!--  />-->
</template>
<script setup lang="ts">
// import StartUserNode from './nodes/StartUserNode.vue'
// import EndEventNode from './nodes/EndEventNode.vue'
// import UserTaskNode from './nodes/UserTaskNode.vue'
// import CopyTaskNode from './nodes/CopyTaskNode.vue'
// import ExclusiveNode from './nodes/ExclusiveNode.vue'
// import ParallelNode from './nodes/ParallelNode.vue'
// import InclusiveNode from './nodes/InclusiveNode.vue'
// import DelayTimerNode from './nodes/DelayTimerNode.vue'
// import RouterNode from './nodes/RouterNode.vue'
import TriggerNode from './nodes/TriggerNode.vue'
import { type SimpleFlowNode, NodeType } from './consts'
import { useWatchNode } from './nodeUtils.ts'
import { ref } from 'vue'

defineOptions({
  name: 'ProcessNodeTree'
})
const props = defineProps({
  parentNode: {
    type: Object as () => SimpleFlowNode,
    default: () => null
  },
  flowNode: {
    type: Object as () => SimpleFlowNode,
    default: () => null
  }
})
const emits = defineEmits<{
  'update:flowNode': [node: SimpleFlowNode | undefined]
  'find:recursiveFindParentNode': [
    nodeList: SimpleFlowNode[],
    curentNode: SimpleFlowNode,
    nodeType: number
  ]
}>()

const currentNode = ref()
// const currentNode = useWatchNode(props)

// 用于删除节点
// const handleModelValueUpdate = (updateValue: any) => {
//   emits('update:flowNode', updateValue)
// }

// const findFromParentNode = (nodeList: SimpleFlowNode[], nodeType: number) => {
//   emits('find:recursiveFindParentNode', nodeList, props.parentNode, nodeType)
// }
//
// // 递归从父节点中查询匹配的节点
// const recursiveFindParentNode = (
//   nodeList: SimpleFlowNode[],
//   findNode: SimpleFlowNode,
//   nodeType: number
// ) => {
//   if (!findNode) {
//     return
//   }
//   if (findNode.type === NodeType.START_USER_NODE) {
//     nodeList.push(findNode)
//     return
//   }
//
//   if (findNode.type === nodeType) {
//     nodeList.push(findNode)
//   }
//   emits('find:recursiveFindParentNode', nodeList, props.parentNode, nodeType)
// }
</script>
<style lang="scss" scoped></style>
