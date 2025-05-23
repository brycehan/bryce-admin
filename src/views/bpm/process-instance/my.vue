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
      <el-form-item label="流程名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入流程名称" clearable />
      </el-form-item>
      <el-form-item label="流程编号" prop="id">
        <el-input v-model="state.queryForm.id" placeholder="请输入流程编号" clearable class="!w-[304px]" />
      </el-form-item>
      <el-form-item label="流程分类" prop="category">
        <el-select v-model="state.queryForm.category" placeholder="请选择流程分类" clearable>
          <el-option v-for="category in categoryList" :key="category.id" :label="category.name" :value="category.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="流程状态" prop="status">
        <el-select v-model="state.queryForm.status" placeholder="请选择流程状态" clearable>
          <el-option
            v-for="dict in BpmProcessInstanceStatusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发起时间" prop="createTime">
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
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column
        label="流程名称"
        prop="name"
        header-align="center"
        align="center"
        show-overflow-tooltip
        min-width="120"
      />
      <el-table-column label="流程分类" prop="categoryName" header-align="center" align="center" min-width="100" />
      <el-table-column label="流程状态" header-align="center" align="center" min-width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.status === BpmProcessInstanceStatus.RUNNING" type="primary">审批中</el-tag>
          <el-tag v-else-if="scope.row.status === BpmProcessInstanceStatus.APPROVE" type="success">审批通过</el-tag>
          <el-tag v-else-if="scope.row.status === BpmProcessInstanceStatus.REJECT" type="warning">审批不通过</el-tag>
          <el-tag v-else-if="scope.row.status === BpmProcessInstanceStatus.CANCEL" type="info">已取消</el-tag>
          <el-tag v-else type="info">未开始</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发起时间" align="center" prop="startTime" width="180" />
      <el-table-column label="结束时间" align="center" prop="endTime" width="180" />
      <el-table-column align="center" label="耗时" prop="durationInMillis" width="169">
        <template #default="scope">
          {{ scope.row.durationInMillis > 0 ? formatPast2(scope.row.durationInMillis) : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="当前审批任务" align="center" prop="tasks" min-width="120px">
        <template #default="scope">
          <el-text v-for="task in scope.row.tasks" :key="task.id" link>
            {{ task.name }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column label="流程编号" align="center" prop="id" min-width="320px" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="220">
        <template #default="scope">
          <el-space :spacer="spacer" class="!gap-0">
            <el-button type="primary" class="!px-0" icon="View" link @click="handleDetail(scope.row)">详情</el-button>
            <el-button
              v-if="scope.row.status === 1"
              v-auth:has-authority="'bpm:process-instance:cancel'"
              type="primary"
              class="!px-0"
              icon="CloseBold"
              link
              @click="handleCancel(scope.row)"
            >
              取消
            </el-button>
          </el-space>
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
import processInstanceApi from '@/api/bpm/processInstance'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { BpmProcessInstanceStatus, BpmProcessInstanceStatusOptions } from '@/api/bpm/constant'
import FormCreate from '@form-create/element-ui'
import { ElDivider, ElMessage, ElMessageBox } from 'element-plus'
import * as UserApi from '@/api/system/user'
import { formatPast2 } from '@/utils/formatTime'
import { StatusEnum } from '@/enums/system.ts'
import { router } from '@/router'

const state: StateOptions = reactive({
  api: {
    postPageApi: processInstanceApi.postProcessInstanceMyPage,
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
const spacer = h(ElDivider, { direction: 'vertical' })

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
  router.push({ name: 'BpmProcessInstanceMyDetail', params: { id: row.id } })
}

/** 取消按钮操作 */
const handleCancel = async (row: any) => {
  if (!authStore.permitAccess()) return
  // 二次确认
  const { value } = await ElMessageBox.prompt('请输入取消原因', '取消流程', {
    inputPattern: /^[\s\S]*.*\S[\s\S]*$/, // 判断非空，且非空格
    inputErrorMessage: '取消原因不能为空',
  })
  // 发起取消
  await processInstanceApi.cancelProcessInstanceByAdmin(row.id, value)
  ElMessage.success('取消成功')
  // 刷新列表
  getPage()
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
