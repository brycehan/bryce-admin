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
      <el-form-item label="昵称" label-width="40px" prop="nickname">
        <el-input v-model="state.queryForm.nickname" placeholder="请输入昵称" clearable />
      </el-form-item>
      <el-form-item label="城市" label-width="40px" prop="city">
        <el-input v-model="state.queryForm.city" placeholder="请输入城市" clearable />
      </el-form-item>
      <el-form-item label="扫码场景值" prop="qrSceneStr">
        <el-input v-model="state.queryForm.qrSceneStr" placeholder="请输入扫码场景值" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth="'mp:user:save'" type="primary" icon="Plus" @click="handleAddOrEdit()"
        >新增</el-button
      >
      <el-button v-auth="'mp:user:delete'" type="danger" icon="Delete" @click="handleDeleteBatch()"
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
      <el-table-column label="昵称" prop="nickname" header-align="center" align="center" />
      <el-table-column label="头像" prop="headImgUrl" header-align="center" align="center" />
      <el-table-column label="性别" prop="sex" header-align="center" align="center" />
      <el-table-column label="城市" prop="city" header-align="center" align="center" />
      <el-table-column label="标签ID列表" prop="tagIds" header-align="center" align="center" />
      <el-table-column label="是否关注" prop="subscribe" header-align="center" align="center" />
      <el-table-column label="关注时间" prop="subscribeTime" header-align="center" align="center" />
      <el-table-column
        label="关注场景"
        prop="subscribeScene"
        header-align="center"
        align="center"
      />
      <el-table-column label="扫码场景值" prop="qrSceneStr" header-align="center" align="center" />
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
            v-auth="'mp:user:update'"
            type="primary"
            text
            @click="handleAddOrEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            v-auth="'mp:user:delete'"
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
import { postPageApi, deleteByIdsApi } from '@/api/mp/user'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'

const state: StateOptions = reactive({
  api: {
    postPageApi: postPageApi,
    deleteByIdsApi: deleteByIdsApi
  },
  queryForm: {
    nickname: '',
    city: '',
    qrSceneStr: ''
  },
  orderItems: [
    {
      column: 'createdTime',
      asc: false
    }
  ]
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
