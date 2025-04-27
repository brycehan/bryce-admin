<template>
  <el-card shadow="never">
    <el-form
      ref="queryFormRef"
      :model="state.queryForm"
      :inline="true"
      v-show="showSearch"
      @keyup.enter="getPage()"
      @submit.prevent
    >
      <el-form-item label="任务名称" prop="jobName">
        <el-input v-model="state.queryForm.jobName" placeholder="请输入任务名称" clearable />
      </el-form-item>
      <el-form-item label="任务组名" prop="jobGroup">
        <dict-select v-model="state.queryForm.jobGroup" dict-type="quartz_job_group" placeholder="任务组名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button
        v-auth:has-authority="'quartz:jobLog:delete'"
        type="danger"
        plain
        icon="Delete"
        @click="handleDeleteBatch('id', '日志编号')"
        >删除</el-button
      >
      <el-button
        v-auth:has-authority="'quartz:jobLog:delete'"
        type="danger"
        plain
        icon="Delete"
        @click="handleCleanJobLog"
        >清空</el-button
      >
      <el-button
        v-auth:has-authority="'quartz:jobLog:export'"
        type="success"
        plain
        icon="Download"
        @click="handleDownloadExcel()"
        >导出</el-button
      >
      <right-toolbar v-model:showSearch="showSearch" @refresh-page="getPage" />
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
        label="日志编号"
        prop="id"
        header-align="center"
        align="center"
        show-overflow-tooltip
        min-width="120"
      />
      <el-table-column
        label="任务名称"
        prop="jobName"
        show-overflow-tooltip
        header-align="center"
        align="center"
        min-width="120"
      />
      <dict-table-column label="任务组名" prop="jobGroup" dict-type="quartz_job_group" min-width="100" />
      <el-table-column
        label="执行方法"
        prop="method"
        show-overflow-tooltip
        header-align="center"
        align="center"
        min-width="160"
      >
        <template #default="scope"> {{ scope.row.beanName }}.{{ scope.row.method }}() </template>
      </el-table-column>
      <el-table-column label="执行状态" prop="executeStatus" header-align="center" align="center" min-width="100">
        <template #default="scope">
          <el-tag v-if="!scope.row.executeStatus" type="danger" size="small">失败</el-tag>
          <el-tag v-else type="success" size="small">成功</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执行时长" prop="duration" header-align="center" align="center" min-width="100">
        <template #default="scope"> {{ scope.row.duration }}毫秒 </template>
      </el-table-column>
      <el-table-column label="执行时间" prop="createdTime" header-align="center" align="center" min-width="185" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="100">
        <template #default="scope">
          <el-button type="info" icon="view" text @click="handleInfo(scope.row.id)">详情</el-button>
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

    <!-- 弹窗，详情 -->
    <Info ref="infoRef" />
  </el-card>
</template>

<script setup lang="ts">
import { deleteByIdsApi, deleteCleanApi, postExportExcelApi, postPageApi } from '@/api/quartz/jobLog'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import Info from '@/views/quartz/jobLog/info.vue'
import { ElMessage } from 'element-plus'
import modal from '@/utils/modal'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi,
    postExportExcelApi,
  },
  queryForm: {
    jobName: '',
    jobGroup: '',
  },
})

const queryFormRef = ref()
const infoRef = ref()

// 显示搜索条件
const showSearch = ref(true)

const route = useRoute()

onMounted(() => {
  state.queryForm.jobName = (route.query.jobName as string) || ''
  getPage()
})

const {
  getPage,
  handleSizeChange,
  handleCurrentChange,
  handleDeleteBatch,
  handleSelectionChange,
  handleDownloadExcel,
} = crud(state)

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
 * 详情弹窗
 *
 * @param id 日志编号
 */
const handleInfo = (id: string) => {
  infoRef.value.init(id)
}

/**
 * 清空按钮操作
 */
const handleCleanJobLog = () => {
  modal
    .confirm('是否确认清空所有调度日志数据？')
    .then(() => {
      deleteCleanApi().then(() => {
        ElMessage.success('清空成功')
        getPage()
      })
    })
    .catch(() => {})
}
</script>
