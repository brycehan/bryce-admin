<template>
  <el-dialog
    v-model="visible"
    modal-class="modal-dialog-full"
    :modal="false"
    title="流程详情"
    :close-on-click-modal="false"
  >
    <div class="processInstance-wrap-main">
      <el-scrollbar>
        <el-divider class="!mt-0" />
        <div class="flex">
          <div>
            <div class="text-[#878c93]">编号：{{ state.id }}</div>
            <div class="flex items-center gap-5 my-5">
              <div class="text-[26px] font-bold">{{ processInstance.name }}</div>
              <el-tag v-if="processInstance.status" :type="BpmProcessInstanceStatusOptions.find(item => item.value === processInstance.status)?.type">
                {{ BpmProcessInstanceStatusOptions.find(item => item.value === processInstance.status)?.label }}
              </el-tag>
            </div>
            <div class="flex items-center gap-5 mb-4 text-[13px] h-[35px]">
              <div
                class="bg-gray-100 rounded-3xl flex items-center p-[8px] gap-2 h-[35px] dark:color-gray-600"
              >
                <el-avatar
                  :size="28"
                  v-if="processInstance?.startUser?.avatar"
                  :src="processInstance?.startUser?.avatar"
                />
                <el-avatar :size="28" v-else-if="processInstance?.startUser?.nickname">
                  {{ processInstance?.startUser?.nickname.substring(0, 1) }}
                </el-avatar>
                {{ processInstance?.startUser?.nickname }}
              </div>
              <div class="text-[#878c93]"> {{ formatDate(processInstance.startTime) }} 提交 </div>
            </div>
          </div>
          <div>
            <img
              class="absolute right-[20px]"
              width="150"
              :src="auditIconsMap[processInstance.status]"
              alt=""
            />
          </div>
        </div>
          <el-tabs v-model="activeTab">
            <!-- 表单信息 -->
            <el-tab-pane label="审批详情" name="form">
              <div class="form-scroll-area">
                <el-scrollbar>
                  <el-row>
                    <el-col :span="17" class="!flex !flex-col formCol">
                      <!-- 表单信息 -->
                      <div
                        v-loading="processInstanceLoading"
                        class="form-box flex flex-col mb-[30px] flex-1"
                      >
                        <!-- 情况一：流程表单 -->
                        <el-col v-if="processDefinition?.formType === BpmFormType.NORMAL">
                          <form-create
                            v-model="detailForm.value"
                            v-model:api="fApi"
                            :option="detailForm.option"
                            :rule="detailForm.rule"
                          />
                        </el-col>
                        <!-- 情况二：业务表单 -->
                        <div v-if="processDefinition?.formType === BpmFormType.CUSTOM">
                          <BusinessFormComponent :id="processInstance.businessKey" />
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="7">
                      <!-- 审批记录时间线 -->
                      <ProcessInstanceTimeline :activity-nodes="activityNodes" />
                    </el-col>
                  </el-row>
                </el-scrollbar>
              </div>
            </el-tab-pane>

            <!-- 流程图 -->
            <el-tab-pane label="流程图" name="diagram">
              <div class="form-scroll-area">
                <ProcessInstanceSimpleViewer
                  v-show="
                    processDefinition.modelType && processDefinition.modelType === BpmModelType.SIMPLE
                  "
                  :loading="processInstanceLoading"
                  :model-view="processModelView"
                />
                <ProcessInstanceBpmnViewer
                  v-show="processDefinition.modelType === BpmModelType.BPMN"
                  :loading="processInstanceLoading"
                  :model-view="processModelView"
                />
              </div>
            </el-tab-pane>

            <!-- 流转记录 -->
            <el-tab-pane label="流转记录" name="record">
              <div class="form-scroll-area">
                <el-scrollbar>
                  <ProcessInstanceTaskList :loading="processInstanceLoading" :id="state.id" />
                </el-scrollbar>
              </div>
            </el-tab-pane>

            <!-- 流转评论 TODO 待开发 -->
            <el-tab-pane label="流转评论" name="comment" v-if="false">
              <div class="form-scroll-area">
                <el-scrollbar> 流转评论 </el-scrollbar>
              </div>
            </el-tab-pane>
          </el-tabs>

          <div class="b-t-solid border-t-1px border-[var(--el-border-color)] mt-[10px]">
            <!-- 操作栏按钮 -->
            <ProcessInstanceOperationButton
              ref="operationButtonRef"
              :process-instance="processInstance"
              :process-definition="processDefinition"
              :userOptions="userOptions"
              :normal-form="detailForm"
              :normal-form-api="fApi"
              :writable-fields="writableFields"
              @success="refresh"
            />
          </div>
        </el-scrollbar>
      </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import { BpmFormType, BpmModelType, BpmProcessInstanceStatusOptions } from '@/api/bpm/constant'
import { setPreviewConfAndFields } from '@/utils/formCreate'
import type { ApiAttrs } from '@form-create/element-ui/types/config'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import * as userApi from '@/api/system/user'
import ProcessInstanceBpmnViewer from './ProcessInstanceBpmnViewer.vue'
// import ProcessInstanceSimpleViewer from './ProcessInstanceSimpleViewer.vue'
import ProcessInstanceTaskList from './ProcessInstanceTaskList.vue'
import ProcessInstanceOperationButton from './ProcessInstanceOperationButton.vue'
import ProcessInstanceTimeline from './ProcessInstanceTimeline.vue'
import { TaskStatusEnum } from '@/api/bpm/task'
import runningSvg from '@/assets/svgs/bpm/running.svg'
import approveSvg from '@/assets/svgs/bpm/approve.svg'
import rejectSvg from '@/assets/svgs/bpm/reject.svg'
import cancelSvg from '@/assets/svgs/bpm/cancel.svg'
import { nextTick, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { FieldPermissionType } from '@/api/bpm/consts'
import FormCreate from '@form-create/element-ui'

defineOptions({ name: 'BpmProcessInstanceDetail' })

const visible = ref(false)

const state = ref({
  id: '', // 流程实例的编号
  taskId: '', // 任务编号
  activityId: '' //流程活动编号，用于抄送查看
})

const processInstanceLoading = ref(false) // 流程实例的加载中
const processInstance = ref<any>({}) // 流程实例
const processDefinition = ref<any>({}) // 流程定义
const processModelView = ref<any>({}) // 流程模型视图
const operationButtonRef = ref() // 操作按钮组件 ref
const auditIconsMap = {
  [TaskStatusEnum.RUNNING]: runningSvg,
  [TaskStatusEnum.APPROVE]: approveSvg,
  [TaskStatusEnum.REJECT]: rejectSvg,
  [TaskStatusEnum.CANCEL]: cancelSvg
} as any

// ========== 申请信息 ==========
const fApi = ref<ApiAttrs>() //
const detailForm = ref({
  rule: [],
  option: {},
  value: {}
}) // 流程实例的表单详情

const writableFields: Array<string> = [] // 表单可以编辑的字段

/**
 * 获得详情
 *
 * @param processInstanceId 流程实例的编号
 * @param activityId 流程活动编号
 * @param taskId 任务编号
 */
const getDetail = (processInstanceId: string, activityId: any, taskId: any) => {
  state.value.id = processInstanceId
  state.value.taskId = taskId
  state.value.activityId = activityId
  getApprovalDetail(processInstanceId, activityId, taskId)

  getProcessModelView(processInstanceId)
}

/** 加载流程实例 */
const BusinessFormComponent = ref<any>(null) // 异步组件

/** 获取审批详情 */
const getApprovalDetail = async (processInstanceId: string, activityId: any, taskId: any) => {
  processInstanceLoading.value = true
  try {
    const param = {
      processInstanceId,
      activityId,
      taskId
    }
    const data = await ProcessInstanceApi.getApprovalDetail(param).then(res => res.data)
    if (!data) {
      ElMessage.error('查询不到审批详情信息！')
      return
    }
    if (!data.processDefinition || !data.processInstance) {
      ElMessage.error('查询不到流程信息！')
      return
    }
    processInstance.value = data.processInstance
    processDefinition.value = data.processDefinition

    // 设置表单信息
    if (processDefinition.value.formType === BpmFormType.NORMAL) {
      // 获取表单字段权限
      const formFieldsPermission = data.formFieldsPermission
      // 清空可编辑字段为空
      writableFields.splice(0)
      if (detailForm.value.rule?.length > 0) {
        debugger
        // 避免刷新 form-create 显示不了
        detailForm.value.value = processInstance.value.formVariables
      } else {
        setPreviewConfAndFields(
          detailForm,
          processDefinition.value.formConf,
          processDefinition.value.formFields,
          processInstance.value.formVariables
        )
      }
      nextTick().then(() => {
        fApi.value?.btn.show(false)
        fApi.value?.resetBtn.show(false)
        //@ts-ignore
        fApi.value?.disabled(true)
        // 设置表单字段权限
        if (formFieldsPermission) {
          Object.keys(data.formFieldsPermission).forEach((item) => {
            setFieldPermission(item, formFieldsPermission[item])
          })
        }
      })
    } else {
      // 注意：data.processDefinition.formCustomViewPath 是组件的全路径，例如说：/crm/contract/detail/index.vue
      // BusinessFormComponent.value = registerComponent(data.processDefinition.formCustomViewPath)
    }

    // 获取审批节点，显示 Timeline 的数据
    activityNodes.value = data.activityNodes

    // 获取待办任务显示操作按钮
    operationButtonRef.value?.loadTodoTask(data.todoTask)
  } finally {
    processInstanceLoading.value = false
  }
}

/**
 * 获取流程模型视图
 *
 * @param processInstanceId 流程实例的编号
 */
const getProcessModelView = (processInstanceId: string) => {
  if (BpmModelType.BPMN === processDefinition.value?.modelType) {
    // 重置，解决 BPMN 流程图刷新不会重新渲染问题
    processModelView.value = {
      bpmnXml: ''
    }
  }
  ProcessInstanceApi.getProcessInstanceBpmnModelView(processInstanceId)
    .then(res => {
      if (res.data) {
        processModelView.value = res.data
      }
    })
}

// 审批节点信息
const activityNodes = ref<ProcessInstanceApi.ApprovalNodeInfo[]>([])
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
    // 加入可以编辑的字段
    writableFields.push(field)
  }
  if (permission === FieldPermissionType.NONE) {
    //@ts-ignore
    fApi.value?.hidden(true, field)
  }
}

/**
 * 操作成功后刷新
 */
const refresh = () => {
  // 重新获取详情
  // getDetail()
}

/** 当前的Tab */
const activeTab = ref('form')

/** 初始化 */
const userOptions = ref<any[]>([]) // 用户列表

/**
 * 初始化
 *
 * @param processInstanceId 流程实例的编号
 * @param activityId 流程活动编号
 * @param taskId 任务编号
 */
const init = (processInstanceId: string, activityId?: any, taskId?: any) => {
  // 显示
  visible.value = true
  activeTab.value = 'form'
  getDetail(processInstanceId, null, null)
}

defineExpose({
  init
})

onMounted(async () => {
  // getDetail()
  // 获得用户列表
  userOptions.value = await userApi.postListApi({}).then(res => res.data)
})
</script>

<style lang="scss" scoped>
$wrap-padding-height: 20px;
$wrap-margin-height: 15px;
$button-height: 51px;
$process-header-height: 194px;

.processInstance-wrap-main {
  height: calc(100vh - var(--theme-header-height) - var(--theme-main-tabs-height) - 75px);
  max-height: calc(100vh - var(--theme-header-height) - var(--theme-main-tabs-height) - 75px);
  overflow: hidden;

  .form-scroll-area {
    display: flex;
    height: calc(100vh - var(--theme-header-height) - var(--theme-main-tabs-height) - 35px -
        $process-header-height - 120px);
    max-height: calc(100vh - var(--theme-header-height) - var(--theme-main-tabs-height) - 35px -
        $process-header-height - 120px);
    overflow: auto;
    flex-direction: column;
  }
}

.form-box {
  :deep(.el-card) {
    border: none;
  }
}
</style>
