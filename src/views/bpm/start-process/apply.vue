<template>
  <el-card shadow="never">
    <!-- 中间主要内容 tab 栏 -->
    <el-tabs v-model="activeTab">
      <!-- 表单信息 -->
      <el-tab-pane label="表单填写" name="form">
        <div v-loading="processInstanceStartLoading" class="form-scroll-area">
          <el-scrollbar>
            <el-row v-if="!state.dataForm.id">
              <el-col :span="17">
                <form-create
                  v-model:api="fApi"
                  v-model="detailForm.value"
                  :rule="detailForm.rule"
                  :option="detailForm.option"
                  @submit="handleSubmit"
                />
              </el-col>
              <el-col :span="6" :offset="1">
                <!-- 流程时间线 -->
                <ProcessInstanceTimeline
                  ref="timelineRef"
                  :activity-nodes="activityNodes"
                  :show-status-icon="false"
                  @select-user-confirm="selectUserConfirm"
                />
              </el-col>
            </el-row>
          </el-scrollbar>
        </div>
      </el-tab-pane>
      <!-- 流程图 -->
      <el-tab-pane label="流程图" name="diagram">
        <div class="form-scroll-area">
          <!-- BPMN 流程图预览 -->
          <ProcessInstanceBpmnViewer v-if="BpmModelType.BPMN === modelType" :bpmn-xml="bpmnDetailPreview.bpmnXml" />
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 底部操作栏 -->
    <div class="b-t-solid border-t-[1px] border-[var(--el-border-color)] pt-[10px]">
      <!-- 操作栏按钮 -->
      <el-button type="primary" icon="select" @click="handleSubmit">发起</el-button>
      <el-button icon="close" @click="state.visible = false">取消</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { getByIdApi, saveOrUpdateApi } from '@/api/system/user'
import FormCreate from '@form-create/element-ui'
import type { ApiAttrs } from '@form-create/element-ui/types/config'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import type { StateOptions } from '@/utils/state'
import { ElMessage } from 'element-plus'
import processDefinitionApi from '@/api/bpm/processDefinition.ts'
import ProcessInstanceBpmnViewer from '@/views/bpm/process-instance/detail/ProcessInstanceBpmnViewer.vue'
import { decodeFields, setPreviewConfAndFields } from '@/utils/formCreate'
import type { ApprovalNodeInfo } from '@/types/modules/bpm'
import { CandidateStrategy, FieldPermissionType, NodeId } from '@/api/bpm/consts.ts'
import ProcessInstanceTimeline from '@/views/bpm/process-instance/detail/ProcessInstanceTimeline.vue'
import { BpmModelType } from '@/api/bpm/constant.ts'

const emit = defineEmits(['refreshPage'])

const state: StateOptions = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
    emit,
  },
  dataForm: {
    id: '',
  },
})

const activeTab = ref('form') // 当前的 Tab
const modelType = ref()
// 流程实例发起中
const processInstanceStartLoading = ref(false)
// 流程表单详情
const detailForm: any = ref({
  rule: [],
  option: {},
  value: {},
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
  bpmnXml: '',
})

const tabsStore = useTabsStore()
const router = useRouter()
const { params } = useRoute() // 路由信息

/**
 * 初始化详情数据
 *
 * @param formVariables 表单变量
 */
const init = async (formVariables?: any) => {
  const id = params.id as string
  processDefinitionApi.getById(id).then(async (res) => {
    const data = res.data

    // 重置指定审批人
    startUserSelectTasks.value = []
    startUserSelectAssignees.value = {}

    modelType.value = data.modelType
    // 情况一：流程表单
    if (data.formType == 0) {
      // 设置表单
      // 注意：需要从 formVariables 中，移除不在 row.formFields 的值。
      // 原因是：后端返回的 formVariables 里面，会有一些非表单的信息。例如说，某个流程节点的审批人。
      //        这样，就可能导致一个流程被审批不通过后，重新发起时，会直接后端报错！！！
      const allowedFields = decodeFields(data.formFields).map((fieldObj: any) => fieldObj.field)
      for (const key in formVariables) {
        if (!allowedFields.includes(key)) {
          delete formVariables[key]
        }
      }
      setPreviewConfAndFields(detailForm, data.formConf, data.formFields, formVariables)

      await nextTick()
      fApi.value?.btn.show(false) // 隐藏提交按钮

      // 获取流程审批信息
      await getApprovalDetail(data)

      // 加载流程图
      bpmnXML.value = data.bpmnXml
      simpleJson.value = data.simpleModel
    }
    handleBpmnDetail(data)
  })
}

/**
 * 获取审批详情
 */
const getApprovalDetail = async (row: any) => {
  try {
    // 获取审批详情，设置 activityId 为发起人节点（为了获取字段权限。暂时只对 Simple 设计器有效）
    const data = await ProcessInstanceApi.getApprovalDetail({
      processDefinitionId: row.id,
      activityId: NodeId.START_USER_NODE_ID,
    }).then((res) => res.data)

    if (!data) {
      ElMessage.error('查询不到审批详情信息！')
      return
    }

    // 获取发起人自选的任务
    startUserSelectTasks.value = data.activityNodes?.filter(
      (node: ApprovalNodeInfo) => CandidateStrategy.START_USER_SELECT === node.candidateStrategy,
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
  } finally {
    /* empty */
  }
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
  if (!fApi.value || !params.id) {
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
      processDefinitionId: params.id,
      variables: detailForm.value.value,
      startUserSelectAssignees: startUserSelectAssignees.value,
    })
    // 提示
    ElMessage.success('发起流程成功')
    // 关闭当前页签
    tabsStore.deleteView(unref(router.currentRoute))
    // 跳转到我的流程页面
    await router.push({ path: '/bpm/process-instance/my' })
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
  // 获取流程图
  processDefinitionApi.getById(row.id).then((res) => {
    bpmnDetailPreview.value.bpmnXml = res.data.bpmnXml
  })
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.form-scroll-area {
  --wrap-margin-height: 20px;
  --process-header-height: 110px;
  --process-footer-height: 64px;

  height: calc(
    100vh - var(--app-header-height) - var(--app-main-tabs-height) - var(--process-header-height) - var(
        --process-footer-height
      ) - var(--wrap-margin-height)
  );
  max-height: calc(
    100vh - var(--app-header-height) - var(--app-main-tabs-height) - var(--process-header-height) - var(
        --process-footer-height
      ) - var(--wrap-margin-height)
  );
  overflow: hidden;
}
</style>
