<template>
  <el-table :data="tasks" border header-cell-class-name="table-header-gray">
    <el-table-column label="审批节点" prop="name" min-width="120" align="center" />
    <el-table-column label="审批人" min-width="100" align="center">
      <template #default="scope">
        {{ scope.row.assigneeUser?.nickname || scope.row.ownerUser?.nickname }}
      </template>
    </el-table-column>
    <el-table-column :formatter="dateFormatter" align="center" label="开始时间" prop="createTime" min-width="140" />
    <el-table-column :formatter="dateFormatter" align="center" label="结束时间" prop="endTime" min-width="140" />
    <el-table-column align="center" label="审批状态" prop="status" min-width="90">
      <template #default="scope">
        <el-tag :type="BpmTaskStatusOptions.find(item => item.value === scope.row.status)?.type">{{ BpmTaskStatusOptions.find(item => item.value === scope.row.status)?.label }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column align="center" label="审批建议" prop="reason" min-width="200">
      <template #default="scope">
        {{ scope.row.reason }}
        <el-button class="ml-10px" size="small" v-if="scope.row.formId > 0" @click="handleFormDetail(scope.row)">
          <Icon icon="ep:document" /> 查看表单
        </el-button>
      </template>
    </el-table-column>
    <el-table-column align="center" label="耗时" prop="durationInMillis" min-width="100">
      <template #default="scope">
        {{ formatPast2(scope.row.durationInMillis) }}
      </template>
    </el-table-column>
  </el-table>

  <!-- 弹窗：表单 -->
  <Dialog title="表单详情" v-model="taskFormVisible" width="600">
    <form-create ref="fApi" v-model="taskForm.value" :option="taskForm.option" :rule="taskForm.rule" />
  </Dialog>
</template>
<script lang="ts" setup>
import { dateFormatter, formatPast2 } from '@/utils/formatTime'
import { setPreviewConfAndFields } from '@/utils/formCreate'
import * as TaskApi from '@/api/bpm/task'
import { nextTick, onMounted, ref } from 'vue'
import { BpmTaskStatusOptions } from '@/api/bpm/task'
import FormCreate from '@form-create/element-ui'

defineOptions({ name: 'BpmProcessInstanceTaskList' })

const props = defineProps({
  loading: Boolean, // 是否加载中
  id: String // 流程实例的编号
})
const tasks = ref<any[]>([]) // 流程任务的数组

/** 查看表单 */
const fApi = ref<any>() // form-create 的 API 操作类
const taskForm = ref({
  rule: [],
  option: {},
  value: {}
}) // 流程任务的表单详情
const taskFormVisible = ref(false)
const handleFormDetail = async (row: any) => {
  // 设置表单
  setPreviewConfAndFields(taskForm, row.formConf, row.formFields, row.formVariables)
  // 弹窗打开
  taskFormVisible.value = true
  // 隐藏提交、重置按钮，设置禁用只读
  await nextTick()
  fApi.value.fapi.btn.show(false)
  fApi.value?.fapi?.resetBtn.show(false)
  fApi.value?.fapi?.disabled(true)
}

onMounted(() => {
  TaskApi.getTaskListByProcessInstanceId(props.id as any).then((res) => {
    tasks.value = res.data
  })
})
</script>
