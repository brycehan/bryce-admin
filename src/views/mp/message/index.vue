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
      <el-form-item label="消息类型" prop="messageType">
        <el-input v-model="state.queryForm.messageType" placeholder="请输入消息类型" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth="'mp:message:save'" type="primary" icon="Plus" @click="handleAddOrEdit()"
        >新增</el-button
      >
      <el-button
        v-auth="'mp:message:delete'"
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
      <el-table-column label="openid" prop="openId" header-align="center" align="center" />
      <el-table-column label="消息方向" prop="inOut" header-align="center" align="center" />
      <el-table-column label="消息类型" prop="messageType" header-align="center" align="center" />
      <el-table-column label="消息内容" prop="content" header-align="center" align="center" />
      <el-table-column
        label="创建时间"
        prop="createdTime"
        header-align="center"
        align="center"
        width="160"
      />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="180">
        <template #default="scope">
          <el-button
            v-auth="'mp:message:update'"
            type="primary"
            icon="edit"
            text
            @click="handleAddOrEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            v-auth="'mp:message:delete'"
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
import { postPageApi, deleteMessageApi } from '@/api/mp/message'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'

const state: StateOptions = reactive({
  api: {
    postPageApi: postPageApi,
    deleteByIdsApi: deleteMessageApi
  },
  queryForm: {
    messageType: ''
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
