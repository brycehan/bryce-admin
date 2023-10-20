<template>
  <el-card shadow="never">
    <el-form ref="queryFormRef" :model="state.queryForm" :inline="true" label-width="68px" @keyup.enter="getPage()" @submit.prevent>
      <el-form-item label="任务名称" prop="jobName">
        <el-input v-model="state.queryForm.jobName" placeholder="请输入任务名称" clearable />
      </el-form-item>
      <el-form-item label="任务组名" prop="jobGroup">
        <dict-select v-model="state.queryForm.jobGroup" dict-type="quartz_job_group" placeholder="任务组名" clearable />
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <dict-select v-model="state.queryForm.status" dict-type="quartz_job_status" placeholder="任务状态" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth="'quartz:job:save'" type="primary" icon="Plus" @click="handleAddOrEdit()">新增</el-button>
      <el-button v-auth="'quartz:job:delete'" type="danger" icon="Delete" @click="handleDeleteBatch()">删除</el-button>
    </el-row>
    <el-table
      v-loading="state.loading"
      :data="state.data"
      :border="true"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column label="任务名称" prop="jobName" show-overflow-tooltip header-align="center" align="center" />
      <dict-table-column label="任务组名" prop="jobGroup" dict-type="quartz_job_group" />
      <el-table-column label="执行方法" prop="method" header-align="center" align="center" />
      <el-table-column label="cron 表达式" prop="cronExpression" header-align="center" align="center" />
      <dict-table-column label="状态" prop="status" dict-type="quartz_job_status" />
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" width="160" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
        <template #default="scope">
          <el-button v-auth="'quartz:job:update'" type="primary" link @click="handleAddOrEdit(scope.row.id)">编辑</el-button>
          <el-button v-if="!scope.row.status" v-auth="'quartz:job:update'" type="info" link @click="handleChangeStatus(scope.row, true)">恢复</el-button>
          <el-button v-if="scope.row.status" v-auth="'quartz:job:update'" type="warning" link @click="handleChangeStatus(scope.row, false)">暂停</el-button>
          <el-button v-auth="'quartz:job:run'" type="success" link @click="handleRun(scope.row)">执行</el-button>
          <el-button v-auth="'quartz:job:delete'" type="danger" link @click="handleDeleteBatch(scope.row.id)">删除</el-button>
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
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddOrEdit from './add-or-edit.vue'
import { page, deleteByIds, run, changeStatus } from '@/api/quartz/job'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";
import {ElMessage, ElMessageBox} from "element-plus";

const state: StateOptions = reactive({
  api: {
    page,
    deleteByIds
  },
  queryForm: {
    jobName: '',
    jobGroup: '',
    status: ''
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

/** 新增/修改 弹窗 */
const handleAddOrEdit = (id?: bigint) => {
  addOrEditRef.value.init(id)
}

/**
 * 处理立即执行
 *
 * @param row 任务数据行
 */
const handleRun = (row: any) => {
  ElMessageBox.confirm('确定进行立即执行操作？', '提示', {
    type: 'warning'
  })
      .then(() => {
        run(row).then(() => {
          ElMessage.success('操作成功')
        })
      }).catch(() => {})
}

/**
 * 处理修改状态
 *
 * @param row 任务数据行
 */
const handleChangeStatus = (row: any, status: boolean) => {
  const opt = status ? '恢复' : '暂停'
  ElMessageBox.confirm(`确定进行${opt}操作？`, '提示', {
    type: 'warning'
  })
      .then(() => {
        row.status = status
        changeStatus(row).then(() => {
          ElMessage.success('操作成功')
        })
      })
      .catch(() => {})
}
</script>
