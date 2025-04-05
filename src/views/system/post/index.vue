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
      <el-form-item label="岗位名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入岗位名称" clearable />
      </el-form-item>
      <el-form-item label="岗位编码" prop="code">
        <el-input v-model="state.queryForm.code" placeholder="请输入岗位编码" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-select
          v-model="state.queryForm.status"
          dict-type="sys_status"
          placeholder="岗位状态"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth="'system:post:save'" type="primary" plain icon="Plus" @click="handleAddOrEdit()"
        >新增</el-button
      >
      <el-button
        v-auth="'system:post:delete'"
        type="danger"
        plain
        icon="Delete"
        @click="handleDeleteBatch('code', '岗位编码')"
        >删除</el-button
      >
      <el-button v-auth="'system:user:export'" type="success" plain icon="Download" @click="handleDownloadExcel()">导出</el-button>
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
      <el-table-column label="岗位名称" prop="name" header-align="center" align="center" min-width="200"/>
      <el-table-column label="岗位编码" prop="code" sortable="custom" header-align="center" align="center" min-width="150" />
      <el-table-column
        label="岗位排序"
        prop="sort"
        sortable="custom"
        header-align="center"
        align="center"
        min-width="110"
      />
      <dict-table-column label="状态" prop="status" dict-type="sys_status" min-width="80"/>
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" show-overflow-tooltip min-width="170"/>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="170">
        <template #default="scope">
          <el-button
            v-auth="'system:post:update'"
            type="primary"
            icon="edit"
            text
            @click="handleAddOrEdit(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-auth="'system:post:delete'"
            type="danger"
            icon="delete"
            text
            @click="handleDeleteBatch('code', '岗位编码', scope.row)"
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

    <!-- 弹窗，新增 / 修改 -->
    <AddOrEdit ref="addOrEditRef" @refresh-page="getPage" />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddOrEdit from './add-or-edit.vue'
import { postPageApi, deleteByIdsApi, postExportExcelApi } from '@/api/system/post'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi,
    postExportExcelApi
  },
  queryForm: {
    name: '',
    code: '',
    status: ''
  }
})

const queryFormRef = ref()
const addOrEditRef = ref()
// 显示搜索条件
const showSearch = ref(true)

onMounted(() => {
  getPage()
})

const { getPage, handleSizeChange, handleCurrentChange, handleSelectionChange, handleSortChange, handleDeleteBatch, handleDownloadExcel } =
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
 * @param id 主键ID
 */
const handleAddOrEdit = (id?: string) => {
  addOrEditRef.value.init(id)
}

</script>

