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
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="state.queryForm.dictName" placeholder="请输入字典名称" clearable />
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input v-model="state.queryForm.dictType" placeholder="请输入字典类型" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-select
          v-model="state.queryForm.status"
          dict-type="sys_status"
          placeholder="字典状态"
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
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button
        v-auth="'system:dictType:save'"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddOrEdit()"
        >新增</el-button
      >
      <el-button
        v-auth="'system:dictType:delete'"
        type="danger"
        plain
        icon="Delete"
        @click="handleDeleteBatch('dictType', '字典类型')"
        >删除</el-button
      >
      <el-button
        v-auth="'system:dictType:export'"
        type="success"
        plain
        icon="Download"
        @click="handleDownloadExcel()"
      >导出</el-button>
      <right-toolbar v-model:showSearch="showSearch" @refresh-page="getPage" />
    </el-row>
    <el-table
      v-loading="state.loading"
      :data="state.data"
      :border="true"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column label="字典名称" prop="dictName" header-align="center" align="center" />
      <el-table-column label="字典类型" prop="dictType" sortable="custom" header-align="center" align="center" />
      <el-table-column
        label="显示顺序"
        prop="sort"
        sortable="custom"
        header-align="center"
        align="center"
        width="120"
      />
      <dict-table-column label="状态" prop="status" dict-type="sys_status" width="80" />
      <el-table-column label="备注" prop="remark" header-align="center" align="center" />
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="250">
        <template #default="scope">
          <el-button
            v-auth="'system:dictData:page'"
            type="primary"
            icon="setting"
            text
            @click="handleShowDictData(scope.row)"
            >字典配置</el-button
          >
          <el-button
            v-auth="'system:dictType:update'"
            type="primary"
            icon="edit"
            text
            @click="handleAddOrEdit(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-auth="'system:dictType:delete'"
            type="danger"
            icon="delete"
            text
            @click="handleDeleteBatch('dictType', '字典类型', scope.row)"
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

    <!-- 字典配置 -->
    <el-drawer v-if="dataVisible" v-model="dataVisible" :title="dataTitle" :size="1000">
      <Data :dict-type-id="dictTypeId"  value=""/>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddOrEdit from './add-or-edit.vue'
import Data from '@/views/system/dict/data.vue'
import { postPageApi, deleteByIdsApi,postExportExcelApi } from '@/api/system/dictType'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi,
    postExportExcelApi,
  },
  queryForm: {
    dictName: '',
    dictType: '',
    status: ''
  },
  range: {
    createdTime: []
  }
})

const queryFormRef = ref()
const addOrEditRef = ref()

const dataVisible = ref(false)
const dataTitle = ref()
const dictTypeId = ref()

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

/** 新增/修改 弹窗 */
const handleAddOrEdit = (id?: string) => {
  addOrEditRef.value.init(id)
}

/**
 * 显示字典数据
 *
 * @param row 当前数据行
 */
const handleShowDictData = (row: any) => {
  dictTypeId.value = row.id
  dataVisible.value = true
  dataTitle.value = `字典配置 - 字典类型“${row.dictType}”`
}
</script>
