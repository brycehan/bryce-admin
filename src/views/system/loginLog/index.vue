<template>
  <el-card shadow="never">
    <el-form ref="queryFormRef" :model="state.queryForm" :inline="true" label-width="68px" @keyup.enter="getPage()" @submit.prevent>
      <el-form-item label="用户账号" prop="username">
        <el-input v-model="state.queryForm.username" placeholder="请输入用户账号" clearable />
      </el-form-item>
      <el-form-item label="登录IP" prop="ip">
        <el-input v-model="state.queryForm.ip" placeholder="请输入登录IP地址" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-select v-model="state.queryForm.status" dict-type="sys_operate_status" placeholder="登录状态" clearable />
      </el-form-item>
      <el-form-item label="创建时间" prop="createdTime">
        <el-date-picker
            v-model="state.range.createdTime"
            type="daterange"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth="'system:loginLog:delete'" type="danger" icon="Delete" @click="handleDeleteBatch()">删除</el-button>
      <el-button v-auth="'system:loginLog:export'" type="warning" icon="Download" @click="handleDownloadExcel()">导出</el-button>
    </el-row>
    <el-table
        v-loading="state.loading"
        :data="state.data"
        :border="true"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column label="用户账号" prop="username" header-align="center" align="center" />
      <dict-table-column label="操作信息" prop="info" dict-type="sys_operate_info" />
      <el-table-column label="登录IP" prop="ip" header-align="center" align="center" />
      <el-table-column label="登录地点" prop="location" header-align="center" align="center" />
      <el-table-column label="User Agent" prop="userAgent" show-overflow-tooltip header-align="center" align="center" />
      <dict-table-column label="状态" prop="status" dict-type="sys_operate_status" />
      <el-table-column label="访问时间" prop="accessTime" header-align="center" align="center" width="165" />
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" width="165" />
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
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddOrEdit from './add-or-edit.vue'
import { page, deleteByIds, downloadExcel } from '@/api/system/loginLog'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";

const state: StateOptions = reactive({
  api: {
    page,
    deleteByIds,
    downloadExcel
  },
  queryForm: {
    username: '',
    ip: '',
    status: '',
    createdTime: ''
  },
  range: {
    createdTime: ''
  },
})

const queryFormRef = ref()
const addOrEditRef = ref()

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

/** 重置按钮操作 */
const handleResetQuery = () => {
  for (const key in state.range) {
    state.range[key] = []
  }

  if(queryFormRef.value) {
    queryFormRef.value.resetFields()
  }

  getPage()
}
</script>
