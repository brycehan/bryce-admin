<template>
  <el-card shadow="never">
    <el-form
      v-show="showSearch"
      ref="queryFormRef"
      :model="state.queryForm"
      :inline="true"
      @keyup.enter="getPage()"
      @submit.prevent
    >
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入任务名称" clearable />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="state.range.createTime"
          value-format="YYYY-MM-DD"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <right-toolbar v-model:show-search="showSearch" @refresh-page="getPage" />
    </el-row>
    <el-table
      v-loading="state.loading as boolean"
      :data="state.data"
      :border="true"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="流程名称"
        prop="processInstance.name"
        header-align="center"
        align="center"
        show-overflow-tooltip
        min-width="120"
        fixed
      />
      <el-table-column label="发起人" align="center" prop="processInstance.startUser.nickname" width="120" fixed />
      <el-table-column label="发起时间" align="center" prop="createTime" width="180" />
      <el-table-column align="center" label="任务名称" prop="name" width="180" />
      <el-table-column label="任务开始时间" prop="createTime" align="center" width="180" />
      <el-table-column label="任务结束时间" prop="endTime" align="center" width="180" />
      <el-table-column align="center" label="审批状态" prop="status" min-width="120">
        <template #default="scope">
          <el-tag :type="BpmTaskStatusOptions.find((item) => item.value === scope.row.status)?.type as any">{{
            BpmTaskStatusOptions.find((item) => item.value === scope.row.status)?.label
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审批建议" prop="reason" min-width="180" />
      <el-table-column align="center" label="耗时" prop="durationInMillis" width="169">
        <template #default="scope">
          {{ scope.row.durationInMillis > 0 ? formatPast2(scope.row.durationInMillis) : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="流程编号" align="center" prop="processInstanceId" min-width="120" show-overflow-tooltip />
      <el-table-column label="任务编号" align="center" prop="id" min-width="120" show-overflow-tooltip />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="90">
        <template #default="scope">
          <el-button type="primary" icon="View" link @click="handleDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="state.current"
      :page-size="state.size"
      :total="state.total"
      :page-sizes="state.pageSizes"
      :layout="state.layout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 弹窗，表单详情 -->
    <el-dialog v-model="formDetailPreview.visible" title="表单详情" width="60%">
      <form-create :rule="formDetailPreview.rule" :option="formDetailPreview.rule" />
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import * as CategoryApi from '@/api/bpm/category.ts'
import taskApi, { BpmTaskStatusOptions } from '@/api/bpm/task.ts'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import FormCreate from '@form-create/element-ui'
import * as UserApi from '@/api/system/user'
import { formatPast2 } from '@/utils/formatTime'
import { StatusEnum } from '@/enums/system.ts'
import { router } from '@/router'

const state: StateOptions = reactive({
  api: {
    postPageApi: taskApi.postTaskDonePage,
  },
  queryForm: {
    id: '',
    startUserId: null,
  },
  range: {
    createTime: '',
  },
})

const queryFormRef = ref()
const userList = ref<any[]>([])
// 显示搜索条件
const showSearch = ref(true)
const authStore = useAuthStore()
// 表单详情预览
const formDetailPreview = ref({
  visible: false,
  rule: [],
  option: {},
})

const categoryList = ref<any>([]) // 流程分类列表

const { getPage, handleSizeChange, handleCurrentChange, handleSelectionChange } = crud(state)

/**
 * 重置按钮操作
 */
const handleResetQuery = () => {
  for (const key in state.range) {
    state.range[key] = []
  }

  if (queryFormRef.value) {
    queryFormRef.value.resetFields()
  }

  getPage()
}

/**
 * 发布流程
 */
const handleUserList = () => {
  // 加载用户数据
  UserApi.postListApi({}).then((res: any) => {
    userList.value = res.data
  })
}

/**
 * 详情
 *
 * @param row 当前行数据
 */
const handleDetail = (row: any) => {
  if (!authStore.permitAccess()) return
  router.push({ name: 'BpmTaskDoneDetail', params: { id: row.processInstanceId } })
}

/**
 * 流程分类列表
 */
const handleCategoryList = () => {
  CategoryApi.postListApi({ status: StatusEnum.ENABLE }).then((res: any) => {
    categoryList.value = res.data
  })
}

onMounted(() => {
  getPage()
  handleCategoryList()
  handleUserList()
})
</script>
