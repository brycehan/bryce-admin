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
        <dict-select
          v-model="state.queryForm.jobGroup"
          dict-type="quartz_job_group"
          placeholder="任务组名"
          clearable
        />
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <dict-select
          v-model="state.queryForm.status"
          dict-type="quartz_job_status"
          placeholder="任务状态"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth:has-authority="'quartz:job:save'" type="primary" plain icon="Plus" @click="handleAddOrEdit()"
        >新增</el-button
      >
      <el-button
        v-auth:has-authority="'quartz:job:delete'"
        type="danger"
        plain
        icon="Delete"
        @click="handleDeleteBatch('jobName', '任务名称')"
        >删除</el-button
      >
      <el-button v-auth:has-authority="'quartz:job:export'" type="success" plain icon="Download" @click="handleDownloadExcel()">导出</el-button>
      <el-button v-auth:has-authority="'quartz:jobLog:page'" type="info" plain icon="operation" @click="handleJobLog()">日志</el-button>
      <right-toolbar v-model:showSearch="showSearch" @refresh-page="getPage" />
    </el-row>
    <el-table
      v-loading="state.loading as boolean"
      :data="state.data"
      :border="true"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column
        label="任务名称"
        prop="jobName"
        sortable="custom"
        header-align="center"
        align="center"
        show-overflow-tooltip
        min-width="130"
        fixed="left"
      />
      <dict-table-column label="任务组名" prop="jobGroup" dict-type="quartz_job_group" min-width="100"/>
      <el-table-column label="执行方法" prop="method" header-align="center" align="center" min-width="100"/>
      <el-table-column
        label="cron 表达式"
        prop="cronExpression"
        header-align="center"
        align="center"
        min-width="125"
      />
      <el-table-column label="状态" prop="status" sortable="custom" header-align="center" align="center" min-width="90">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                :width="40"
                :active-value="1"
                :inactive-value="0"
                @change="handleChangeStatus(scope.row)"
              />
            </template>
          </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createdTime"
        header-align="center"
        align="center"
        min-width="185"
      />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="255">
        <template #default="scope">
          <el-button
            v-auth:has-authority="'quartz:job:update'"
            type="primary"
            icon="edit"
            text
            @click="handleAddOrEdit(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-auth:has-authority="'quartz:job:delete'"
            type="danger"
            icon="delete"
            text
            @click="handleDeleteBatch('jobName', '任务名称', scope.row)"
            >删除</el-button
          >
          <el-dropdown @command="(command: string) => handleCommand(command, scope.row)">
            <el-button type="success" class="btn-more-link" icon="d-arrow-right" text>更多</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="authHasAuthority('quartz:job:run')" command="runOnce" icon="caretRight"
                  >执行一次</el-dropdown-item
                >
                <el-dropdown-item command="view" icon="view"
                  >任务详情</el-dropdown-item>
                <el-dropdown-item v-if="authHasAuthority('quartz:jobLog:page')" command="jobLog" icon="operation"
                  >调度日志</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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

    <!-- 弹窗，新增 / 修改 -->
    <AddOrEdit ref="addOrEditRef" @refresh-page="getPage" />
    <!-- 弹窗，详情 -->
    <Info ref="infoRef" />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddOrEdit from './add-or-edit.vue'
import { postPageApi, deleteByIdsApi, putRunApi, putStatusApi, postExportExcelApi } from '@/api/quartz/job'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { authHasAuthority } from '@/utils/tool'
import Info from '@/views/quartz/job/info.vue'
import modal from '@/utils/modal'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi,
    postExportExcelApi
  },
  queryForm: {
    jobName: '',
    jobGroup: '',
    status: ''
  }
})

const queryFormRef = ref()
const addOrEditRef = ref()
const infoRef = ref()

// 显示搜索条件
const showSearch = ref(true)

onMounted(() => {
  getPage()
})

const { getPage, handleSizeChange, handleCurrentChange, handleDeleteBatch, handleSelectionChange, handleSortChange, handleDownloadExcel } =
  crud(state)

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
 * 新增/修改 弹窗
 *
 * @param id 任务ID
 */
const handleAddOrEdit = (id?: string) => {
  addOrEditRef.value.init(id)
}

/**
 * 处理立即执行
 *
 * @param row 任务数据行
 */
const handleRunOnce = (row: any) => {
  modal.confirm(`确定要立即执行一次“${row.jobName}”任务吗？`)
    .then(() => {
      putRunApi(row).then(() => {
        ElMessage.success('执行成功')
      })
    })
    .catch(() => {})
}

/**
 * 处理修改状态
 *
 * @param row 任务数据行
 */
const handleChangeStatus = (row: any) => {
  const opt = row.status === 1 ? '启用' : '停用'
  modal.confirm(`确定要${opt}“${row.jobName}”任务吗？`)
    .then(() => {
      putStatusApi(row).then(() => {
        ElMessage.success(`${opt}成功`)
      })
    })
    .catch(() => {
      row.status = row.status === 1 ? 0 : 1
    })
}

const handleCommand = (command: string, row: any) => {
  switch (command) {
    case 'runOnce':
      handleRunOnce(row)
      break
    case 'view':
      handleView(row)
      break
    case 'jobLog':
      handleJobLog(row)
      break
    default:
      break
  }
}

const router = useRouter()

const handleJobLog = (row?: any) => {
  if (row) {
    const query = { jobName: row.jobName }
    router.push({path: '/quartz/jobLog/index', query})
  } else {
    router.push({path: '/quartz/jobLog/index'})
  }
}

/**
 * 详情弹窗
 *
 * @param row 任务数据行
 */
const handleView = (row: any) => {
  infoRef.value.init(row.id)
}
</script>
