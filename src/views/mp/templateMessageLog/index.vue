<template>
  <el-card shadow="never">
    <el-form ref="queryFormRef" :model="state.queryForm" :inline="true" label-width="68px" @keyup.enter="getPage()" @submit.prevent>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth="'mp:templateMessageLog:save'" type="primary" icon="Plus" @click="handleAddOrEdit()">新增</el-button>
      <el-button v-auth="'mp:templateMessageLog:delete'" type="danger" icon="Delete" @click="handleDeleteBatch()">删除</el-button>
    </el-row>
    <el-table
      v-loading="state.loading"
      :data="state.data"
      :border="true"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column label="用户openid" prop="toUser" header-align="center" align="center" />
      <el-table-column label="templateid" prop="templateId" header-align="center" align="center" />
      <el-table-column label="消息数据" prop="data" header-align="center" align="center" />
      <el-table-column label="消息链接" prop="url" header-align="center" align="center" />
      <el-table-column label="小程序信息" prop="miniProgram" header-align="center" align="center" />
      <el-table-column label="发送时间" prop="sendTime" header-align="center" align="center" />
      <el-table-column label="发送结果" prop="sendResult" header-align="center" align="center" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template #default="scope">
          <el-button v-auth="'mp:templateMessageLog:update'" type="primary" link @click="handleAddOrEdit(scope.row.id)">编辑</el-button>
          <el-button v-auth="'mp:templateMessageLog:delete'" type="danger" link @click="handleDeleteBatch(scope.row.id)">删除</el-button>
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
import { page, deleteByIds } from '@/api/mp/templateMessageLog'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";

const state: StateOptions = reactive({
  api: {
    page,
    deleteByIds
  },
  queryForm: {
  },
})

const queryFormRef = ref()
const addOrEditRef = ref()

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

/** 重置按钮操作 */
const handleResetQuery = () => {
  for (const key in state.range) {
    state.range[key] = []
  }

  if(queryFormRef.value) {
    queryFormRef.value.resetFields()
  }

  getPage()
}

/** 新增/修改 弹窗 */
const handleAddOrEdit = (id?: bigint) => {
  addOrEditRef.value.init(id)
}
</script>
