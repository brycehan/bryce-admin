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
      <el-form-item label="参数名称" prop="paramName">
        <el-input v-model="state.queryForm.paramName" placeholder="请输入参数名称" clearable />
      </el-form-item>
      <el-form-item label="参数键名" prop="paramKey">
        <el-input v-model="state.queryForm.paramKey" placeholder="请输入参数键名" clearable />
      </el-form-item>
      <el-form-item label="参数类型" prop="paramType">
        <dict-select
          v-model="state.queryForm.paramType"
          dict-type="sys_param_type"
          placeholder="参数类型"
          clearable
        />
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
      <el-button v-auth="'system:param:save'" type="primary" plain icon="Plus" @click="handleAddOrEdit()"
        >新增</el-button
      >
      <el-button
        v-auth="'system:param:delete'"
        type="danger"
        plain
        icon="Delete"
        @click="handleDeleteBatch()"
        >删除</el-button
      >
      <el-button
        v-auth="'system:param:export'"
        type="success"
        plain
        icon="Download"
        @click="handleDownloadExcel()"
      >
        导出
      </el-button>
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
        label="参数名称"
        prop="paramName"
        show-overflow-tooltip
        header-align="center"
        align="center"
      />
      <el-table-column
        label="参数键名"
        prop="paramKey"
        show-overflow-tooltip
        header-align="center"
        align="center"
      />
      <el-table-column
        label="参数值"
        prop="paramValue"
        header-align="center"
        align="center"
        width="100"
      />
      <dict-table-column label="参数类型" prop="paramType" dict-type="sys_param_type" width="100" />
      <el-table-column
        label="备注"
        prop="remark"
        show-overflow-tooltip
        header-align="center"
        align="center"
      />
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" width="160"/>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="180">
        <template #default="scope">
          <el-button
            v-auth="'system:param:update'"
            type="primary"
            icon="edit"
            text
            @click="handleAddOrEdit(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-auth="'system:param:delete'"
            type="danger"
            icon="delete"
            text
            @click="handleDeleteBatch(scope.row.id)"
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
import { postPageApi, deleteByIdsApi, postExportExcelApi } from '@/api/system/param'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi,
    postExportExcelApi
  },
  queryForm: {
    paramName: '',
    paramKey: '',
    paramType: '',
    createdTime: ''
  },
  orderItems: [
    {
      column: 'updatedTime',
      asc: false
    },
    {
      column: 'paramType',
      asc: true
    }
  ],
  range: {
    createdTime: ''
  }
})

const queryFormRef = ref()
const addOrEditRef = ref()
// 显示搜索条件
const showSearch = ref(true)

onMounted(() => {
  getPage()
})

const { getPage, handleSizeChange, handleCurrentChange, handleDeleteBatch, handleSelectionChange, handleDownloadExcel } =
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
 * @param id 参数ID
 */
const handleAddOrEdit = (id?: bigint) => {
  addOrEditRef.value.init(id)
}
</script>
