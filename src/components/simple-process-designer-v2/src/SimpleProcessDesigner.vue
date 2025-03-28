<template>
  <div v-loading="loading" class="overflow-auto">
    <SimpleProcessModel
      ref="simpleProcessModelRef"
      v-if="processNodeTree"
      :flow-node="processNodeTree"
      :readonly="false"
      @save="saveSimpleFlowModel"
    />
    <Dialog v-model="errorDialogVisible" title="保存失败" width="400" :fullscreen="false">
      <div class="mb-2">以下节点内容不完善，请修改后保存</div>
      <div
        class="mb-3 b-rounded-1 bg-gray-100 p-2 line-height-normal"
        v-for="(item, index) in errorNodes"
        :key="index"
      >
        {{ item.name }} : {{ NODE_DEFAULT_TEXT.get(item.type) }}
      </div>
      <template #footer>
        <el-button type="primary" @click="errorDialogVisible = false">知道了</el-button>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, provide, reactive, ref, watch, type Ref } from 'vue'
import SimpleProcessModel from './SimpleProcessModel.vue'
import { type SimpleFlowNode, NodeType, NodeId, NODE_DEFAULT_TEXT } from './consts'
import * as ModelApi from '@/api/bpm/model'
import * as FormApi from '@/api/bpm/form'
import { handleTree } from '@/utils/tree'
import * as RoleApi from '@/api/system/role'
import * as DeptApi from '@/api/system/dept'
import * as PostApi from '@/api/system/post'
import * as UserApi from '@/api/system/user'
import * as UserGroupApi from '@/api/bpm/userGroupApi'
import { BpmFormType } from '@/api/bpm/constant'
import { StatusType } from '@/utils/constant'

defineOptions({
  name: 'SimpleProcessDesigner'
})

const emits = defineEmits(['success']) // 保存成功事件

const props = defineProps({
  modelId: {
    type: String,
    required: false
  },
  modelKey: {
    type: String,
    required: false
  },
  modelName: {
    type: String,
    required: false
  },
  // 可发起流程的人员编号
  startUserIds: {
    type: Array,
    required: false
  }
})

const processData = inject('processData') as Ref
const loading = ref(false)
const formFields = ref<string[]>([])
const formType = ref(20)
const roleOptions = ref<any[]>([]) // 角色列表
const postOptions = ref<any[]>([]) // 岗位列表
const userOptions = ref<any[]>([]) // 用户列表
const deptOptions = ref<any[]>([]) // 部门列表
const deptTreeOptions = ref()
const userGroupOptions = ref<any[]>([]) // 用户组列表

provide('formFields', formFields)
provide('formType', formType)
provide('roleList', roleOptions)
provide('postList', postOptions)
provide('userList', userOptions)
provide('deptList', deptOptions)
provide('userGroupList', userGroupOptions)
provide('deptTree', deptTreeOptions)
provide('startUserIds', props.startUserIds)
provide('tasks', [])
provide('processInstance', {})
// const message = useMessage() // 国际化
const processNodeTree = ref<SimpleFlowNode | undefined>()
provide('processNodeTree', processNodeTree)
const errorDialogVisible = ref(false)
let errorNodes: SimpleFlowNode[] = []

// 添加更新模型的方法
const updateModel = () => {
  if (!processNodeTree.value) {
    processNodeTree.value = {
      name: '发起人',
      type: NodeType.START_USER_NODE,
      id: NodeId.START_USER_NODE_ID,
      childNode: {
        id: NodeId.END_EVENT_NODE_ID,
        name: '结束',
        type: NodeType.END_EVENT_NODE
      }
    }
    // 初始化时也触发一次保存
    saveSimpleFlowModel(processNodeTree.value)
  }
}

const saveSimpleFlowModel = async (simpleModelNode: any) => {
  if (!simpleModelNode) {
    return
  }

  try {
    processData.value = simpleModelNode
    emits('success', simpleModelNode)
  } catch (error) {
    console.error('保存失败:', error)
  }
}

// 校验节点设置。 暂时以 showText 为空 未节点错误配置
const validateNode = (node: SimpleFlowNode | undefined, errorNodes: SimpleFlowNode[]) => {
  if (node) {
    const { type, showText, conditionNodes } = node
    if (type == NodeType.END_EVENT_NODE) {
      return
    }
    if (type == NodeType.START_USER_NODE) {
      // 发起人节点暂时不用校验，直接校验孩子节点
      validateNode(node.childNode, errorNodes)
    }

    if (
      type === NodeType.USER_TASK_NODE ||
      type === NodeType.COPY_TASK_NODE ||
      type === NodeType.CONDITION_NODE
    ) {
      if (!showText) {
        errorNodes.push(node)
      }
      validateNode(node.childNode, errorNodes)
    }

    if (
      type == NodeType.CONDITION_BRANCH_NODE ||
      type == NodeType.PARALLEL_BRANCH_NODE ||
      type == NodeType.INCLUSIVE_BRANCH_NODE
    ) {
      // 分支节点
      // 1. 先校验各个分支
      conditionNodes?.forEach((item) => {
        validateNode(item, errorNodes)
      })
      // 2. 校验孩子节点
      validateNode(node.childNode, errorNodes)
    }
  }
}

onMounted(async () => {
  try {
    loading.value = true
    // 获取表单字段
    if (props.modelId) {
      const bpmnModel = await ModelApi.getByIdApi(props.modelId).then((res: any) => res.data)
      if (bpmnModel) {
        formType.value = bpmnModel.formType
        if (formType.value === BpmFormType.NORMAL && bpmnModel.formId) {
          const bpmnForm = (await FormApi.getByIdApi(bpmnModel.formId)).data as unknown as any
          formFields.value = bpmnForm?.fields
        }
      }
    }
    // 获得角色列表
    // roleOptions.value = await RoleApi.getSimpleList({status: StatusType.ENABLE})
    // // 获得岗位列表
    // postOptions.value = await PostApi.getSimpleList({status: StatusType.ENABLE})
    // // 获得用户列表
    // userOptions.value = await UserApi.getSimpleList({status: StatusType.ENABLE})
    // todo api 实现
    // 获得部门列表
    deptOptions.value = await DeptApi.postListApi({}).then((res) => res.data)
    deptTreeOptions.value = handleTree(deptOptions.value as any[], 'id')
    // 获取用户组列表
    userGroupOptions.value = await UserGroupApi.getSimpleList({status: StatusType.ENABLE}).then((res) => res.data)
    // 加载流程数据
    if (processData.value) {
      processNodeTree.value = processData?.value
    } else {
      updateModel()
    }
  } finally {
    loading.value = false
  }
})

const simpleProcessModelRef = ref()
</script>
