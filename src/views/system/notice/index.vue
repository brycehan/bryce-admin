<template>
  <el-card shadow="never">
    <el-form
      ref="queryFormRef"
      :model="state.queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
      @keyup.enter="getPage()"
      @submit.prevent
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="state.queryForm.title" placeholder="请输入标题" clearable />
      </el-form-item>
       <el-form-item label="创建者" prop="createdUsername">
        <el-input v-model="state.queryForm.createdUsername" placeholder="请输入创建者账号" clearable />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <dict-select
          v-model="state.queryForm.type"
          dict-type="sys_notice_type"
          placeholder="类型"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态" label-width="40px" prop="status">
        <dict-select
          v-model="state.queryForm.status"
          dict-type="sys_status"
          placeholder="状态"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth="'system:notice:save'" type="primary" plain icon="Plus" @click="handleAddOrEdit()"
        >新增</el-button
      >
      <el-button
        v-auth="'system:notice:delete'"
        type="danger"
        plain
        icon="Delete"
        @click="handleDeleteBatch('title', '标题')"
        >删除</el-button
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
      <el-table-column
        label="标题"
        prop="title"
        show-overflow-tooltip
        header-align="center"
        align="center"
      />
      <dict-table-column label="类型" prop="type" dict-type="sys_notice_type" width="100"/>
      <dict-table-column label="状态" prop="status" dict-type="sys_status" width="100"/>
      <el-table-column label="创建者" prop="createdUsername" header-align="center" align="center" width="150" />
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" width="200"/>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="180">
        <template #default="scope">
          <el-button
            v-auth="'system:notice:update'"
            type="primary"
            icon="edit"
            text
            @click="handleAddOrEdit(scope.row)"
            >修改</el-button
          >
          <el-button
            v-auth="'system:notice:delete'"
            type="danger"
            icon="delete"
            text
            @click="handleDeleteBatch('title', '标题', scope.row)"
            >删除</el-button
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

    <!-- 新增/修改 -->
    <el-drawer
      v-if="addOrEditVisible"
      v-model="addOrEditVisible"
      :title="addOrEditTitle"
      :size="1000"
    >
      <AddOrEdit
        v-model="addOrEditVisible"
        :addOrEditVisible="addOrEditVisible"
        :notice-id="noticeId"
        @refresh-page="getPage"
      />
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddOrEdit from './add-or-edit.vue'
import { postPageApi, deleteByIdsApi } from '@/api/system/notice'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi
  },
  queryForm: {
    title: '',
    createdUsername: '',
    type: '',
    status: ''
  }
})

const queryFormRef = ref()

const addOrEditVisible = ref(false)
const addOrEditTitle = ref()
const noticeId = ref()
// 显示搜索条件
const showSearch = ref(true)

onMounted(() => {
  getPage()
})

const { getPage, handleSizeChange, handleCurrentChange, handleDeleteBatch, handleSelectionChange } =
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
 * 新增/修改
 *
 * @param row 当前行数据
 */
const handleAddOrEdit = (row?: any) => {
  addOrEditVisible.value = true
  addOrEditTitle.value = !row?.id ? '新增通知公告' : '修改通知公告'
  noticeId.value = row?.id
}
</script>
