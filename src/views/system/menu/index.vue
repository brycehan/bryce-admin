<template>
  <el-card shadow="never">
    <el-form ref="queryFormRef" :model="state.queryForm" :inline="true" label-width="68px" @keyup.enter="getList()" @submit.prevent>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入菜单名称" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-select v-model="state.queryForm.status" dict-type="sys_status" placeholder="菜单状态" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getList()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth="'system:menu:save'" type="primary" icon="Plus" @click="handleAddOrEdit()">新增</el-button>
    </el-row>
    <el-table
      v-loading="state.loading"
      :data="state.data"
      row-key="id"
      :border="true"
      style="width: 100%"
    >
      <el-table-column label="菜单名称" prop="name" header-align="center" align="center" width="150"/>
      <el-table-column label="图标" prop="icon" header-align="center" align="center">
        <template #default="scope">
          <svg-icon :icon="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" header-align="center" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 'M'" type="">菜单</el-tag>
          <el-tag v-if="scope.row.type === 'B'" type="success">按钮</el-tag>
          <el-tag v-if="scope.row.type === 'I'" type="info">接口</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="组件路径" prop="url" header-align="center" align="center" width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="权限标识" prop="authority" header-align="center" align="center" width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="显示顺序" prop="sort" sortable="custom" header-align="center" align="center" width="120" />
      <dict-table-column label="状态" prop="status" dict-type="sys_status" width="100"/>
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" width="160"/>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="120">
        <template #default="scope">
          <el-button v-auth="'system:menu:update'" type="primary" link @click="handleAddOrEdit(scope.row.id)">编辑</el-button>
          <el-button v-auth="'system:menu:delete'" type="danger" link @click="handleDeleteBatch(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗，新增 / 修改 -->
    <AddOrEdit ref="addOrEditRef" @refresh-page="getList" />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddOrEdit from './add-or-edit.vue'
import { list, deleteByIds } from '@/api/system/menu'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";
import {ElMessage, ElMessageBox} from "element-plus";

const state: StateOptions = reactive({
  api: {
    list,
    deleteByIds
  },
  queryForm: {
    name: '',
    type: '',
    status: ''
  },
})

const queryFormRef = ref()
const addOrEditRef = ref()

onMounted(() => {
  getList()
})

const { getList } = crud(state)

/** 重置按钮操作 */
const handleResetQuery = () => {
  for (const key in state.range) {
    state.range[key] = []
  }

  if(queryFormRef.value) {
    queryFormRef.value.resetFields()
  }

  getList()
}

/** 批量删除 */
const handleDeleteBatch = (id?: bigint) => {
  let data: any[] = []
  if (id) {
    data = [id]
  } else {
    data = state.dataSelections ? state.dataSelections : []
    if (data.length === 0) {
      ElMessage.warning('请选择删除的记录')
      return
    }
  }
  ElMessageBox.confirm('确定进行删除操作？', '提示', {
    type: 'warning'
  })
      .then(() => {
        deleteByIds(data).then(() => {
          ElMessage.success('删除成功')
          getList()
        })
      })
      .catch((error) => {
        console.error(error)
      })
}

/** 新增/修改 弹窗 */
const handleAddOrEdit = (id?: bigint) => {
  addOrEditRef.value.init(id)
}
</script>