<template>
  <el-card shadow="never">
    <el-form
      ref="queryFormRef"
      :model="state.queryForm"
      :inline="true"
      label-width="68px"
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
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button
        v-auth="'quartz:jobLog:delete'"
        type="danger"
        icon="Delete"
        @click="handleDeleteBatch()"
        >批量删除</el-button
      >
    </el-row>
    <el-table
      v-loading="state.loading"
      :data="state.data"
      :border="true"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column label="任务ID" prop="jobId" header-align="center" align="center" />
      <el-table-column
        label="任务名称"
        prop="jobName"
        show-overflow-tooltip
        header-align="center"
        align="center"
      />
      <dict-table-column label="任务组名" prop="jobGroup" dict-type="quartz_job_group" />
      <el-table-column
        label="执行方法"
        prop="method"
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
        <template #default="scope"> {{ scope.row.beanName }}.{{ scope.row.method }}() </template>
      </el-table-column>
      <el-table-column label="执行状态" prop="executeStatus" header-align="center" align="center">
        <template #default="scope">
          <el-tag v-if="!scope.row.executeStatus" type="danger">失败</el-tag>
          <el-tag v-else type="success">成功</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执行时长" prop="duration" header-align="center" align="center">
        <template #default="scope"> {{ scope.row.duration }}毫秒 </template>
      </el-table-column>
      <el-table-column
        label="执行时间"
        prop="createdTime"
        header-align="center"
        align="center"
        width="160"
      />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="60">
        <template #default="scope">
          <el-button
            v-auth="'quartz:jobLog:info'"
            type="info"
            link
            @click="handleInfo(scope.row.id)"
            >详情</el-button
          >
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
import { onMounted, reactive, ref } from 'vue'
import { page, deleteByIds } from '@/api/quartz/jobLog'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import Info from '@/views/quartz/jobLog/info.vue'

const state: StateOptions = reactive({
  api: {
    page,
    deleteByIds
  },
  queryForm: {
    jobName: '',
    jobGroup: ''
  }
})

const queryFormRef = ref()
const infoRef = ref()

onMounted(() => {
  getPage()
})

const { getPage, handleSizeChange, handleCurrentChange, handleDeleteBatch, handleSelectionChange } =
  crud(state)

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

/** 详情弹窗 */
const handleInfo = (id?: bigint) => {
  infoRef.value.init(id)
}
</script>
