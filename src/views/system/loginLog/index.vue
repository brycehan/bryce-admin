<template>
  <el-card shadow="never">
    <el-form
      ref="queryFormRef"
      :model="state.queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="78"
      @keyup.enter="getPage()"
      @submit.prevent
    >
      <el-form-item label="用户账号" prop="username">
        <el-input v-model="state.queryForm.username" placeholder="请输入用户账号" clearable />
      </el-form-item>
      <el-form-item label="登录IP" prop="ip">
        <el-input v-model="state.queryForm.ip" placeholder="请输入登录IP地址" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-select v-model="state.queryForm.status" dict-type="sys_operate_status" placeholder="登录状态" clearable />
      </el-form-item>
      <el-form-item label="访问时间" prop="accessTime">
        <el-date-picker
          v-model="state.range.accessTime"
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
        v-auth="'system:loginLog:delete'"
        type="danger"
        plain
        icon="Delete"
        @click="handleDeleteBatch('id', '日志编号')"
        >删除</el-button
      >
      <el-button v-auth="'system:loginLog:delete'" type="danger" plain icon="Delete" @click="handleCleanLog"
        >清空</el-button
      >
      <el-button v-auth="'system:loginLog:export'" type="success" plain icon="Download" @click="handleDownloadExcel()"
        >导出</el-button
      >
      <right-toolbar v-model:showSearch="showSearch" @refresh-page="getPage" />
    </el-row>
    <el-table
      v-loading="state.loading"
      :data="state.data"
      :border="true"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column label="日志编号" prop="id" header-align="center" align="center" width="160"/>
      <el-table-column label="账号" prop="username" header-align="center" align="center" />
      <el-table-column label="登录IP" prop="ip" header-align="center" align="center" width="120"/>
      <el-table-column label="登录地点" prop="location" header-align="center" align="center" />
      <el-table-column label="User Agent" prop="userAgent" show-overflow-tooltip header-align="center" align="center" />
      <dict-table-column label="状态" prop="status" dict-type="sys_operate_status" width="80"/>
      <dict-table-column label="操作信息" prop="info" dict-type="sys_login_status" width="100"/>
      <el-table-column label="访问时间" prop="accessTime" header-align="center" align="center" width="165" />
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
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { deleteByIdsApi, deleteCleanApi, postExportExcelApi, postPageApi } from '@/api/system/loginLog'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ElMessage } from 'element-plus'
import modal from '@/utils/modal'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi,
    postExportExcelApi
  },
  queryForm: {
    username: '',
    ip: '',
    status: ''
  },
  range: {
    accessTime: ''
  }
})

const queryFormRef = ref()
// 显示搜索条件
const showSearch = ref(true)

onMounted(() => {
  getPage()
})

const {
  getPage,
  handleSizeChange,
  handleCurrentChange,
  handleDeleteBatch,
  handleSelectionChange,
  handleDownloadExcel
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
 * 清空按钮操作
 */
const handleCleanLog = () => {
  modal
    .confirm('是否确认清空所有登录日志数据？')
    .then(() => {
      deleteCleanApi().then(() => {
        ElMessage.success('清空成功')
        getPage()
      })
    })
    .catch(() => {})
}
</script>
