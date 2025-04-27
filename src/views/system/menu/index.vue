<template>
  <el-card shadow="never">
    <el-form
      ref="queryFormRef"
      :model="state.queryForm"
      :inline="true"
      v-show="showSearch"
      @keyup.enter="getList()"
      @submit.prevent
    >
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
      <el-button v-auth:has-authority="'system:menu:save'" type="primary" plain icon="Plus" @click="handleAddOrEdit()"
        >新增</el-button
      >
      <el-button plain @click="toggleExpandAll()">
        <template v-if="!isExpandAll"> 全部展开 <icon class="ml-1" icon="ep:arrow-down" /> </template>
        <template v-else> 全部收起 <icon class="ml-1" icon="ep:arrow-up" /> </template>
      </el-button>
      <right-toolbar v-model:showSearch="showSearch" @refresh-page="getList" />
    </el-row>
    <el-table
      v-if="refreshTable"
      v-loading="state.loading as boolean"
      :default-expand-all="isExpandAll"
      :data="state.data"
      row-key="id"
      :border="true"
      class="w-full"
    >
      <el-table-column
        label="菜单名称"
        prop="name"
        show-overflow-tooltip
        header-align="center"
        align="center"
        min-width="145"
        fixed="left"
      />
      <el-table-column label="图标" prop="icon" header-align="center" align="center" min-width="70">
        <template #default="scope">
          <div class="flex justify-center">
            <icon :icon="scope.row.icon" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" header-align="center" align="center" min-width="75">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 'C'" type="info" size="small">目录</el-tag>
          <el-tag v-if="scope.row.type === 'M'" type="primary" size="small">菜单</el-tag>
          <el-tag v-if="scope.row.type === 'B'" type="success" size="small">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="权限标识"
        prop="authority"
        header-align="center"
        align="center"
        min-width="160"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="组件路径"
        prop="url"
        header-align="center"
        align="center"
        min-width="150"
        :show-overflow-tooltip="true"
      />
      <dict-table-column label="状态" prop="status" dict-type="sys_status" min-width="75" />
      <el-table-column
        label="创建时间"
        prop="createdTime"
        header-align="center"
        align="center"
        show-overflow-tooltip
        min-width="170"
      />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="255">
        <template #default="scope">
          <el-button
            v-auth:has-authority="'system:menu:update'"
            type="primary"
            icon="edit"
            text
            @click="handleAddOrEdit(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.type === 'C' || scope.row.type === 'M'"
            v-auth:has-authority="'system:menu:update'"
            type="primary"
            icon="edit"
            text
            @click="handleAdd(scope.row)"
            >新增</el-button
          >
          <el-button
            v-auth:has-authority="'system:menu:delete'"
            type="danger"
            icon="delete"
            text
            @click="handleDeleteBatch('name', '菜单名称', scope.row, false)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗，新增 / 修改 -->
    <add-or-edit ref="addOrEditRef" @refresh-page="getList" />
  </el-card>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import AddOrEdit from './add-or-edit.vue'
import { postListApi, deleteByIdsApi } from '@/api/system/menu'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'

const state: StateOptions = reactive({
  api: {
    postListApi,
    deleteByIdsApi,
  },
  queryForm: {
    name: '',
    type: '',
    status: '',
  },
})

const queryFormRef = ref()
const addOrEditRef = ref()

// 是否展开，默认全部折叠
const isExpandAll = ref(false)
// 是否重新渲染表格状态
const refreshTable = ref(true)

// 显示搜索条件
const showSearch = ref(true)

onMounted(() => {
  getList()
})

const { getList, handleDeleteBatch } = crud(state)

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

  getList()
}

/**
 * 新增/修改 弹窗
 *
 * @param id 菜单ID
 */
const handleAddOrEdit = (id?: string) => {
  addOrEditRef.value.init(id)
}

/**
 * 新增 弹窗
 *
 * @param row 当前行数据
 */
const handleAdd = (row?: any) => {
  addOrEditRef.value.initAdd(row)
}

/**
 * 切换 展开/折叠
 */
const toggleExpandAll = () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}
</script>
