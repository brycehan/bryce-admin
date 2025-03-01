<template>
  <el-card shadow="never">
    <el-form ref="queryFormRef" :model="state.queryForm" :inline="true" v-show="showSearch" @keyup.enter="getPage()" @submit.prevent>
      <el-form-item label="流程名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入流程名称" clearable />
      </el-form-item>
      <el-form-item label="流程KEY" prop="key">
        <el-input v-model="state.queryForm.name" placeholder="请输入流程KEY" clearable />
      </el-form-item>
      <el-form-item label="流程分类" prop="category">
        <el-input v-model="state.queryForm.category" placeholder="请输入流程分类" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth="'bpm:processDefinitionInfo:save'" type="primary" icon="Plus" plain @click="handleAddOrEdit()">新增</el-button>
      <el-button v-auth="'bpm:processDefinitionInfo:delete'" type="danger" icon="Delete" plain @click="handleDeleteBatch('id', '编号')">删除</el-button>
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
      <el-table-column label="流程名称" prop="name" header-align="center" align="center" />
      <el-table-column label="流程KEY" prop="key" header-align="center" align="center" />
      <el-table-column label="分类名称" prop="modelType" header-align="center" align="center" />
      <el-table-column label="系统" prop="icon" header-align="center" align="center" />
      <el-table-column label="状态" prop="description" header-align="center" align="center" />
      <el-table-column label="应用范围" prop="formType" header-align="center" align="center" />
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" width="170" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="170">
        <template #default="scope">
          <el-button v-auth="'bpm:processDefinitionInfo:update'" type="primary" icon="Edit" link @click="handleAddOrEdit(scope.row)">修改</el-button>
          <el-button v-auth="'bpm:processDefinitionInfo:delete'" type="danger" icon="Delete" link @click="handleDeleteBatch('id', '编号', scope.row)">删除</el-button>
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
import { postPageApi, deleteByIdsApi } from '@/api/bpm/processDefinitionInfo'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi
  },
  queryForm: {
  },
})

const queryFormRef = ref()
const addOrEditRef = ref()
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
} = crud(state)

/**
 * 重置按钮操作
 */
const handleResetQuery = () => {
  for (const key in state.range) {
    state.range[key] = []
  }

  if(queryFormRef.value) {
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
  addOrEditRef.value.init(row?.id)
}
</script>
