<template>
  <el-card shadow="never">
    <el-form ref="queryFormRef" :model="state.queryForm" :inline="true" v-show="showSearch" @keyup.enter="getPage()" @submit.prevent>
      <el-form-item label="名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入名称" clearable />
      </el-form-item>
      <el-form-item label="监听类型" prop="type">
        <dict-select
          v-model="state.queryForm.type"
          dict-type="bpm_process_listener_type"
          placeholder="请选择监听类型"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态" label-width="50" prop="status">
        <dict-select v-model="state.queryForm.status" dict-type="sys_status" placeholder="状态" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth="'bpm:processListener:save'" type="primary" icon="Plus" plain @click="handleAddOrEdit()">新增</el-button>
      <el-button v-auth="'bpm:processListener:delete'" type="danger" icon="Delete" plain @click="handleDeleteBatch('name', '监听器名称')">删除</el-button>
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
      <el-table-column label="名称" prop="name" header-align="center" align="center" min-width="100" />
      <el-table-column label="监听类型" prop="type" header-align="center" align="center" min-width="100" />
      <el-table-column label="监听事件" prop="event" header-align="center" align="center" min-width="100"/>
      <dict-table-column label="值类型" prop="valueType" dict-type="bpm_process_listener_value_type" />
      <el-table-column label="值" prop="value" header-align="center" align="center" min-width="200" show-overflow-tooltip />
      <dict-table-column label="状态" prop="status" dict-type="sys_status" />
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" min-width="170" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="170">
        <template #default="scope">
          <el-button v-auth="'bpm:processListener:update'" type="primary" icon="Edit" link @click="handleAddOrEdit(scope.row)">修改</el-button>
          <el-button v-auth="'bpm:processListener:delete'" type="danger" icon="Delete" link @click="handleDeleteBatch('name', '监听器名称', scope.row)">删除</el-button>
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
import { postPageApi, deleteByIdsApi } from '@/api/bpm/processListener'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi
  },
  queryForm: {
    name: '',
    status: '',
    type: ''
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
