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
      <el-form-item label="名称" label-width="40px" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入名称" clearable />
      </el-form-item>
      <el-form-item label="匹配的关键词、事件等" prop="matchValue">
        <el-input
          v-model="state.queryForm.matchValue"
          placeholder="请输入匹配的关键词、事件等"
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
      <el-button
        v-auth="'mp:messageReplyRule:save'"
        type="primary"
        icon="Plus"
        @click="handleAddOrEdit()"
        >新增</el-button
      >
      <el-button
        v-auth="'mp:messageReplyRule:delete'"
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
      <el-table-column label="名称" prop="name" header-align="center" align="center" />
      <el-table-column
        label="匹配的关键词、事件等"
        prop="matchValue"
        header-align="center"
        align="center"
      />
      <el-table-column
        label="是否精确匹配"
        prop="exactMatch"
        header-align="center"
        align="center"
      />
      <el-table-column label="回复消息类型" prop="replyType" header-align="center" align="center" />
      <el-table-column
        label="回复消息内容"
        prop="replyContent"
        header-align="center"
        align="center"
      />
      <dict-table-column label="状态" prop="status" dict-type="sys_status" />
      <el-table-column
        label="创建时间"
        prop="createdTime"
        header-align="center"
        align="center"
        width="160"
      />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template #default="scope">
          <el-button
            v-auth="'mp:messageReplyRule:update'"
            type="primary"
            text
            @click="handleAddOrEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            v-auth="'mp:messageReplyRule:delete'"
            type="danger"
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
import { postPageApi, deleteByIdsApi } from '@/api/mp/messageReplyRule'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'

const state: StateOptions = reactive({
  api: {
    postPageApi: postPageApi,
    deleteByIdsApi: deleteByIdsApi
  },
  queryForm: {
    name: '',
    matchValue: '',
    status: ''
  }
})

const queryFormRef = ref()
const addOrEditRef = ref()

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

/** 新增/修改 弹窗 */
const handleAddOrEdit = (id?: bigint) => {
  addOrEditRef.value.init(id)
}
</script>
