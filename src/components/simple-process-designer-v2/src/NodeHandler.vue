<template>
  <div class="node-handler-wrapper">
    <div class="node-handler">
      <el-popover
        trigger="hover"
        v-model:visible="popoverShow"
        placement="right-start"
        width="auto"
        v-if="!readonly"
      >
        <div class="handler-item-wrapper">
          <div class="handler-item" @click="addNode(NodeType.USER_TASK_NODE)">
            <div class="approve handler-item-icon">
              <span class="iconfont icon-approve icon-size"></span>
            </div>
            <div class="handler-item-text">审批人</div>
          </div>
          <div class="handler-item" @click="addNode(NodeType.COPY_TASK_NODE)">
            <div class="handler-item-icon copy">
              <span class="iconfont icon-size icon-copy"></span>
            </div>
            <div class="handler-item-text">抄送</div>
          </div>
          <div class="handler-item" @click="addNode(NodeType.CONDITION_BRANCH_NODE)">
            <div class="handler-item-icon condition">
              <span class="iconfont icon-size icon-exclusive"></span>
            </div>
            <div class="handler-item-text">条件分支</div>
          </div>
          <div class="handler-item" @click="addNode(NodeType.PARALLEL_BRANCH_NODE)">
            <div class="handler-item-icon parallel">
              <span class="iconfont icon-size icon-parallel"></span>
            </div>
            <div class="handler-item-text">并行分支</div>
          </div>
          <div class="handler-item" @click="addNode(NodeType.INCLUSIVE_BRANCH_NODE)">
            <div class="handler-item-icon inclusive">
              <span class="iconfont icon-size icon-inclusive"></span>
            </div>
            <div class="handler-item-text">包容分支</div>
          </div>
          <div class="handler-item" @click="addNode(NodeType.DELAY_TIMER_NODE)">
            <div class="handler-item-icon delay">
              <span class="iconfont icon-size icon-delay"></span>
            </div>
            <div class="handler-item-text">延迟器</div>
          </div>
          <div class="handler-item" @click="addNode(NodeType.ROUTER_BRANCH_NODE)">
            <div class="handler-item-icon router">
              <span class="iconfont icon-size icon-router"></span>
            </div>
            <div class="handler-item-text">路由分支</div>
          </div>
          <div class="handler-item" @click="addNode(NodeType.TRIGGER_NODE)">
            <div class="handler-item-icon trigger">
              <span class="iconfont icon-size icon-trigger"></span>
            </div>
            <div class="handler-item-text">触发器</div>
          </div>
        </div>
        <template #reference>
          <div class="add-icon"><Icon icon="ep:plus" /></div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  ApproveMethodType,
  AssignEmptyHandlerType,
  AssignStartUserHandlerType,
  ConditionType,
  NODE_DEFAULT_NAME,
  NodeType,
  RejectHandlerType,
  type SimpleFlowNode,
  DEFAULT_CONDITION_GROUP_VALUE
} from './consts'
import { ElMessage } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'

defineOptions({
  name: 'NodeHandler'
})

// const message = useMessage() // 消息弹窗

const popoverShow = ref(false)
const props = defineProps({
  childNode: {
    type: Object as () => SimpleFlowNode,
    default: null
  },
  currentNode: {
    type: Object as () => SimpleFlowNode,
    required: true
  }
})
const emits = defineEmits(['update:childNode'])

const readonly = inject<Boolean>('readonly') // 是否只读

const addNode = (type: number) => {
  // 校验：条件分支、包容分支后面，不允许直接添加并行分支
  if (
    type === NodeType.PARALLEL_BRANCH_NODE &&
    [NodeType.CONDITION_BRANCH_NODE, NodeType.INCLUSIVE_BRANCH_NODE].includes(
      props.currentNode?.type
    )
  ) {
    ElMessage.error('条件分支、包容分支后面，不允许直接添加并行分支')
    return
  }

  popoverShow.value = false
  if (type === NodeType.USER_TASK_NODE) {
    const id = 'Activity_' + uuidv4()
    const data: SimpleFlowNode = {
      id: id,
      name: NODE_DEFAULT_NAME.get(NodeType.USER_TASK_NODE) as string,
      showText: '',
      type: NodeType.USER_TASK_NODE,
      approveMethod: ApproveMethodType.SEQUENTIAL_APPROVE,
      // 超时处理
      rejectHandler: {
        type: RejectHandlerType.FINISH_PROCESS
      },
      timeoutHandler: {
        enable: false
      },
      assignEmptyHandler: {
        type: AssignEmptyHandlerType.APPROVE
      },
      assignStartUserHandlerType: AssignStartUserHandlerType.START_USER_AUDIT,
      childNode: props.childNode,
      taskCreateListener: {
        enable: false
      },
      taskAssignListener: {
        enable: false
      },
      taskCompleteListener: {
        enable: false
      }
    }
    emits('update:childNode', data)
  }
  if (type === NodeType.COPY_TASK_NODE) {
    const data: SimpleFlowNode = {
      id: 'Activity_' + uuidv4(),
      name: NODE_DEFAULT_NAME.get(NodeType.COPY_TASK_NODE) as string,
      showText: '',
      type: NodeType.COPY_TASK_NODE,
      childNode: props.childNode
    }
    emits('update:childNode', data)
  }
  if (type === NodeType.CONDITION_BRANCH_NODE) {
    const data: SimpleFlowNode = {
      name: '条件分支',
      type: NodeType.CONDITION_BRANCH_NODE,
      id: 'GateWay_' + uuidv4(),
      childNode: props.childNode,
      conditionNodes: [
        {
          id: 'Flow_' + uuidv4(),
          name: '条件1',
          showText: '',
          type: NodeType.CONDITION_NODE,
          childNode: undefined,
          conditionSetting: {
            defaultFlow: false,
            conditionType: ConditionType.RULE,
            conditionGroups: DEFAULT_CONDITION_GROUP_VALUE
          }
        },
        {
          id: 'Flow_' + uuidv4(),
          name: '其它情况',
          showText: '未满足其它条件时，将进入此分支',
          type: NodeType.CONDITION_NODE,
          childNode: undefined,
          conditionSetting: {
            defaultFlow: true
          }
        }
      ]
    }
    emits('update:childNode', data)
  }
  if (type === NodeType.PARALLEL_BRANCH_NODE) {
    const data: SimpleFlowNode = {
      name: '并行分支',
      type: NodeType.PARALLEL_BRANCH_NODE,
      id: 'GateWay_' + uuidv4(),
      childNode: props.childNode,
      conditionNodes: [
        {
          id: 'Flow_' + uuidv4(),
          name: '并行1',
          showText: '无需配置条件同时执行',
          type: NodeType.CONDITION_NODE,
          childNode: undefined
        },
        {
          id: 'Flow_' + uuidv4(),
          name: '并行2',
          showText: '无需配置条件同时执行',
          type: NodeType.CONDITION_NODE,
          childNode: undefined
        }
      ]
    }
    emits('update:childNode', data)
  }
  if (type === NodeType.INCLUSIVE_BRANCH_NODE) {
    const data: SimpleFlowNode = {
      name: '包容分支',
      type: NodeType.INCLUSIVE_BRANCH_NODE,
      id: 'GateWay_' + uuidv4(),
      childNode: props.childNode,
      conditionNodes: [
        {
          id: 'Flow_' + uuidv4(),
          name: '包容条件1',
          showText: '',
          type: NodeType.CONDITION_NODE,
          childNode: undefined,
          conditionSetting: {
            defaultFlow: false,
            conditionType: ConditionType.RULE,
            conditionGroups: DEFAULT_CONDITION_GROUP_VALUE
          }
        },
        {
          id: 'Flow_' + uuidv4(),
          name: '其它情况',
          showText: '未满足其它条件时，将进入此分支',
          type: NodeType.CONDITION_NODE,
          childNode: undefined,
          conditionSetting: {
            defaultFlow: true
          }
        }
      ]
    }
    emits('update:childNode', data)
  }
  if (type === NodeType.DELAY_TIMER_NODE) {
    const data: SimpleFlowNode = {
      id: 'Activity_' + uuidv4(),
      name: NODE_DEFAULT_NAME.get(NodeType.DELAY_TIMER_NODE) as string,
      showText: '',
      type: NodeType.DELAY_TIMER_NODE,
      childNode: props.childNode
    }
    emits('update:childNode', data)
  }
  if (type === NodeType.ROUTER_BRANCH_NODE) {
    const data: SimpleFlowNode = {
      id: 'GateWay_' + uuidv4(),
      name: NODE_DEFAULT_NAME.get(NodeType.ROUTER_BRANCH_NODE) as string,
      showText: '',
      type: NodeType.ROUTER_BRANCH_NODE,
      childNode: props.childNode
    }
    emits('update:childNode', data)
  }
  if (type === NodeType.TRIGGER_NODE) {
    const data: SimpleFlowNode = {
      id: 'Activity_' + uuidv4(),
      name: NODE_DEFAULT_NAME.get(NodeType.TRIGGER_NODE) as string,
      showText: '',
      type: NodeType.TRIGGER_NODE,
      childNode: props.childNode
    }
    emits('update:childNode', data)
  }
}
</script>

<style lang="scss" scoped></style>
