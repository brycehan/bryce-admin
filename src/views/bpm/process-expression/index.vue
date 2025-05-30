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
      <el-form-item label="名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入名称" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-select v-model="state.queryForm.status" dict-type="sys_status" placeholder="状态" clearable />
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
        v-auth:has-authority="'bpm:process-expression:save'"
        type="primary"
        icon="Plus"
        plain
        @click="handleAddOrEdit()"
        >新增</el-button
      >
      <el-button
        v-auth:has-authority="'bpm:process-expression:delete'"
        type="danger"
        icon="Delete"
        plain
        @click="handleDeleteBatch('name', '流程实例的名称')"
        >删除</el-button
      >
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
      <el-table-column label="名称" prop="name" header-align="center" align="center" min-width="120" />
      <el-table-column
        label="表达式"
        prop="expression"
        header-align="center"
        align="center"
        show-overflow-tooltip
        min-width="100"
      />
      <dict-table-column label="状态" prop="status" dict-type="sys_status" min-width="90" />
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" min-width="170" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="170">
        <template #default="scope">
          <el-space :spacer="spacer" class="!gap-0">
            <el-button
              v-auth:has-authority="'bpm:process-expression:update'"
              class="!px-0"
              type="primary"
              icon="Edit"
              link
              @click="handleAddOrEdit(scope.row)"
              >修改</el-button
            >
            <el-button
              v-auth:has-authority="'bpm:process-expression:delete'"
              type="danger"
              class="!px-0"
              icon="Delete"
              link
              @click="handleDeleteBatch('name', '流程实例的名称', scope.row)"
              >删除</el-button
            >
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

    <!-- 弹窗，新增 / 修改 -->
    <add-or-edit ref="addOrEditRef" @refresh-page="getPage" />
  </el-card>
</template>

<script setup lang="ts">
import AddOrEdit from './add-or-edit.vue'
import { postPageApi, deleteByIdsApi } from '@/api/bpm/processExpression'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ElDivider } from 'element-plus'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi,
  },
  queryForm: {
    name: '',
    status: '',
    createdTime: '',
  },
  range: {
    createdTime: '',
  },
})

const queryFormRef = ref()
const addOrEditRef = ref()
// 显示搜索条件
const showSearch = ref(true)
const authStore = useAuthStore()
const spacer = h(ElDivider, { direction: 'vertical' })

const { getPage, handleSizeChange, handleCurrentChange, handleDeleteBatch, handleSelectionChange } = crud(state)

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
 * @param row 当前行数据
 */
const handleAddOrEdit = (row?: any) => {
  if (!authStore.permitAccess()) return
  addOrEditRef.value.init(row?.id)
}

onMounted(() => {
  getPage()
})
</script>
