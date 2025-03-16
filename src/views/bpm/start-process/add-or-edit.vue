<template>
  <el-dialog
    v-model="state.visible"
    :title="processDefinition.name"
    :close-on-click-modal="false"
  >
    <template #title>
      <div class="flex items-center gap-1">
        <span> {{ processDefinition.name }}</span>
        <SvgIcon
          icon="icon-Partition"
          class-name="text-sky-700 cursor-pointer"
          size="20"
          @click="handleBpmnDetail(processDefinition)" />
      </div>
    </template>
    <el-row v-if="!state.dataForm.id">
      <el-col :span="24">
        <form-create
          :rule="detailForm.rule"
          v-model:api="fApi"
          v-model="detailForm.value"
          :option="detailForm.option"
          @submit="handleSubmit"
        />
      </el-col>
    </el-row>
    <!-- 弹窗，流程图 -->
    <el-dialog title="流程图" v-model="bpmnDetailPreview.visible" width="60%">
      <my-process-viewer style="height: 600px" key="designer" :xml="bpmnDetailPreview.bpmnXml" />
    </el-dialog>
    <template #footer>
      <el-button type="primary" @click="handleSubmit">发起</el-button>
      <el-button @click="state.visible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import {
  getByIdApi,
  saveOrUpdateApi,
} from '@/api/system/user'
import FormCreate from '@form-create/element-ui'
import type { ApiAttrs } from '@form-create/element-ui/types/config'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ElMessage } from 'element-plus'
import SvgIcon from '@/components/svg-icon/svg-icon.vue'
import processDefinitionApi from '@/api/bpm/processDefinitionApi'
import { MyProcessViewer } from '@/components/bpmn-process-designer/package'
import { decodeFields, setPreviewConfAndFields } from '@/utils/formCreate'
import { useRouter } from 'vue-router'
import { CandidateStrategy, FieldPermissionType, NodeId } from '@/components/simple-process-designer-v2/src/consts'
import type { ApprovalNodeInfo } from '@/api/bpm/processInstance'

const props = defineProps<{
  processDefinition: any }>()
const emit = defineEmits(['refreshPage'])

const state: StateOptions = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
    emit
  },
  dataForm: {
    id: '',
  }
})

const dataFormRef = ref()
// 流程实例发起中
const processInstanceStartLoading = ref(false)
// 流程表单详情
const detailForm: any = ref({
  rule: [],
  option: {},
  value: {}
})
const fApi = ref<ApiAttrs>()
// 发起人需要选择审批人或抄送人的任务列表
const startUserSelectTasks: any = ref([])
// 发起人选择审批人的数据
const startUserSelectAssignees = ref<any>({})
// BPMN 数据
const bpmnXML: any = ref(null)
// Simple 设计器数据 json 格式
const simpleJson = ref<string | undefined>()

// 审批节点信息
const activityNodes = ref<any[]>([])

// 流程图预览
const bpmnDetailPreview = ref({
  visible: false,
  bpmnXml: '',
})

const router = useRouter()

const { getData, handleSaveOrUpdate } = crud(state)

/**
 * 初始化详情数据
 *
 * @param row 当前行数据
 * @param formVariables 表单变量
 */
const init = async (row: any, formVariables?: any) => {
  state.visible = true
  // 重置指定审批人
  startUserSelectTasks.value = []
  startUserSelectAssignees.value = {}

  // 情况一：流程表单
  if (row.formType == 0) {
    // 设置表单
    // 注意：需要从 formVariables 中，移除不在 row.formFields 的值。
    // 原因是：后端返回的 formVariables 里面，会有一些非表单的信息。例如说，某个流程节点的审批人。
    //        这样，就可能导致一个流程被审批不通过后，重新发起时，会直接后端报错！！！
    const allowedFields = decodeFields(row.formFields).map((fieldObj: any) => fieldObj.field)
    for (const key in formVariables) {
      if (!allowedFields.includes(key)) {
        delete formVariables[key]
      }
    }
    setPreviewConfAndFields(detailForm, row.formConf, row.formFields, formVariables)

    await nextTick()
    fApi.value?.btn.show(false) // 隐藏提交按钮

    // 获取流程审批信息
    await getApprovalDetail(row)

    // 加载流程图
    const processDefinitionDetail = await processDefinitionApi.getById(row.id).then(res => res.data)
    if (processDefinitionDetail) {
      bpmnXML.value = processDefinitionDetail.bpmnXml
      simpleJson.value = processDefinitionDetail.simpleModel
    }
    // 情况二：业务表单
  } else if (row.formCustomCreatePath) {
    await router.push({ path: row.formCustomCreatePath })
    // 这里暂时无需加载流程图，因为跳出到另外个 Tab；
  }
}

/**
 * 获取审批详情
 */
const getApprovalDetail = async (row: any) => {
  try {
    // 获取审批详情，设置 activityId 为发起人节点（为了获取字段权限。暂时只对 Simple 设计器有效）
    const data = await ProcessInstanceApi.getApprovalDetail({
      processDefinitionId: row.id,
      activityId: NodeId.START_USER_NODE_ID
    }).then(res => res.data)

    if (!data) {
      ElMessage.error('查询不到审批详情信息！')
      return
    }

    // 获取发起人自选的任务
    startUserSelectTasks.value = data.activityNodes?.filter(
      (node: ApprovalNodeInfo) => CandidateStrategy.START_USER_SELECT === node.candidateStrategy
    )
    if (startUserSelectTasks.value?.length > 0) {
      for (const node of startUserSelectTasks.value) {
        startUserSelectAssignees.value[node.id] = []
      }
    }

    // 获取审批节点，显示 Timeline 的数据
    activityNodes.value = data.activityNodes
    // 获取表单字段权限
    const formFieldsPermission = data.formFieldsPermission
    // 设置表单字段权限
    if (formFieldsPermission) {
      Object.keys(formFieldsPermission).forEach((item) => {
        setFieldPermission(item, formFieldsPermission[item])
      })
    }
  } finally { /* empty */ }
}

/**
 * 设置表单权限
 */
const setFieldPermission = (field: string, permission: string) => {
  if (permission === FieldPermissionType.READ) {
    //@ts-ignore
    fApi.value?.disabled(true, field)
  }
  if (permission === FieldPermissionType.WRITE) {
    //@ts-ignore
    fApi.value?.disabled(false, field)
  }
  if (permission === FieldPermissionType.NONE) {
    //@ts-ignore
    fApi.value?.hidden(true, field)
  }
}

/**
 * 表单提交
 */
const handleSubmit = async () => {
  if (!fApi.value || !props.processDefinition) {
    return
  }
  // 流程表单校验
  await fApi.value.validate()
  // 如果有指定审批人，需要校验
  if (startUserSelectTasks.value?.length > 0) {
    for (const userTask of startUserSelectTasks.value) {
      if (
        Array.isArray(startUserSelectAssignees.value[userTask.id]) &&
        startUserSelectAssignees.value[userTask.id].length === 0
      )
        return ElMessage.warning(`请选择${userTask.name}的候选人`)
    }
  }

  // 提交请求
  processInstanceStartLoading.value = true
  try {
    await ProcessInstanceApi.createProcessInstance({
      processDefinitionId: props.processDefinition.id,
      variables: detailForm.value.value,
      startUserSelectAssignees: startUserSelectAssignees.value
    })
    // 提示
    ElMessage.success('发起流程成功')
    // 跳转回去

  } finally {
    processInstanceStartLoading.value = false
  }
}

/**
 * 选择发起人
 */
const selectUserConfirm = (id: string, userList: any[]) => {
  startUserSelectAssignees.value[id] = userList?.map((item: any) => item.id)
}

/**
 * 流程图预览详情
 *
 * @param row 当前行数据
 */
const handleBpmnDetail = (row: any) => {
  // 详情弹窗显示
  bpmnDetailPreview.value.visible = true
  // 获取流程图
  bpmnDetailPreview.value.bpmnXml = ''
  processDefinitionApi.getById(row.id).then((res) => {
    bpmnDetailPreview.value.bpmnXml = res.data.bpmnXml
  })
}

defineExpose({
  init
})
</script>
