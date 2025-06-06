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
      <el-form-item label="模块名称" prop="moduleName">
        <el-input v-model="state.queryForm.moduleName" placeholder="请输入模块名称" clearable />
      </el-form-item>
      <el-form-item label="请求URI" prop="requestUri">
        <el-input v-model="state.queryForm.requestUri" placeholder="请输入请求URI" clearable />
      </el-form-item>
      <el-form-item label="操作状态" prop="status">
        <dict-select v-model="state.queryForm.status" dict-type="sys_status" placeholder="操作状态" clearable />
      </el-form-item>
      <el-form-item label="操作账号" prop="username">
        <el-input v-model="state.queryForm.username" placeholder="请输入操作账号" clearable />
      </el-form-item>
      <el-form-item label="操作时间" prop="operatedTime">
        <el-date-picker
          v-model="state.range.createdTime"
          type="daterange"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button
        v-auth:has-authority="'system:operateLog:delete'"
        type="danger"
        plain
        icon="Delete"
        @click="handleDeleteBatch('id', '日志编号')"
        >删除</el-button
      >
      <el-button
        v-auth:has-authority="'system:operateLog:delete'"
        type="danger"
        plain
        icon="Delete"
        @click="handleCleanLog"
        >清空</el-button
      >
      <el-button
        v-auth:has-authority="'system:operateLog:export'"
        type="success"
        plain
        icon="Download"
        @click="handleDownloadExcel()"
        >导出</el-button
      >
      <right-toolbar v-model:show-search="showSearch" @refresh-page="getPage" />
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
        label="日志编号"
        prop="id"
        show-overflow-tooltip
        header-align="center"
        align="center"
        fixed="left"
        min-width="150"
      />
      <el-table-column
        label="模块名称"
        prop="moduleName"
        header-align="center"
        align="center"
        fixed="left"
        show-overflow-tooltip
        min-width="100"
      />
      <dict-table-column
        label="操作类型"
        prop="operatedType"
        dict-type="sys_operate_type"
        header-align="center"
        align="center"
        min-width="100"
      />
      <el-table-column
        label="操作账号"
        prop="username"
        sortable="custom"
        header-align="center"
        align="center"
        min-width="125"
      />
      <el-table-column
        label="操作IP"
        prop="ip"
        show-overflow-tooltip
        header-align="center"
        align="center"
        min-width="120"
      />
      <el-table-column label="操作地点" prop="location" header-align="center" align="center" min-width="110" />
      <dict-table-column label="操作状态" prop="status" dict-type="sys_status" min-width="100" />
      <el-table-column label="操作时间" prop="operatedTime" header-align="center" align="center" min-width="185" />
      <el-table-column
        label="执行时长"
        prop="duration"
        header-align="center"
        align="center"
        show-overflow-tooltip
        min-width="120"
      >
        <template #default="scope"> {{ scope.row.duration }}毫秒 </template>
      </el-table-column>
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
import Info from './info.vue'
import { deleteByIdsApi, deleteCleanApi, postExportExcelApi, postPageApi } from '@/api/system/operateLog'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ElMessage } from 'element-plus'
import modal from '@/utils/modal'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi,
    postExportExcelApi,
  },
  queryForm: {
    name: '',
    moduleName: '',
    requestUri: '',
    status: '',
    username: '',
    deptId: '',
    operatedTime: '',
  },
  range: {
    operatedTime: '',
  },
})

const queryFormRef = ref()
const infoRef = ref()
// 显示搜索条件
const showSearch = ref(true)
const authStore = useAuthStore()

const {
  getPage,
  handleSizeChange,
  handleCurrentChange,
  handleDeleteBatch,
  handleSelectionChange,
  handleSortChange,
  handleDownloadExcel,
} = crud(state)

/** 重置按钮操作 */
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
 */
const handleInfo = (id?: string) => {
  if (!authStore.permitAccess()) return
  infoRef.value.init(id)
}

/**
 * 清空按钮操作
 */
const handleCleanLog = () => {
  if (!authStore.permitAccess()) return
  modal
    .confirm('是否确认清空所有操作日志数据？')
    .then(() => {
      deleteCleanApi().then(() => {
        ElMessage.success('清空成功')
        getPage()
      })
    })
    .catch(() => {})
}

onMounted(() => {
  getPage()
})
</script>
