<template>
  <el-card shadow="never">
    <el-form
      v-show="showSearch"
      ref="queryFormRef"
      :model="state.queryForm"
      :inline="true"
      @keyup.enter="getList()"
      @submit.prevent
    >
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入部门名称" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-select v-model="state.queryForm.status" dict-type="sys_status" placeholder="部门状态" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getList()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth:has-authority="'system:dept:save'" type="primary" plain icon="Plus" @click="handleAddOrEdit()"
        >新增</el-button
      >
      <el-button plain @click="toggleExpandAll()">
        <template v-if="!isExpandAll"> 全部展开 <icon icon="ep:arrow-down" class="ml-1" /> </template>
        <template v-else> 全部收起 <icon icon="ep:arrow-up" class="ml-1" /> </template>
      </el-button>
      <right-toolbar v-model:show-search="showSearch" @refresh-page="getList" />
    </el-row>
    <el-table
      v-if="refreshTable"
      v-loading="state.loading as boolean"
      :default-expand-all="isExpandAll"
      :data="state.data"
      row-key="id"
      :border="true"
      style="width: 100%"
    >
      <el-table-column label="部门名称" prop="name" header-align="center" align="center" min-width="180" />
      <el-table-column label="负责人" prop="leaderName" header-align="center" align="center" min-width="180" />
      <el-table-column label="排序" prop="sort" header-align="center" align="center" min-width="100" />
      <dict-table-column label="状态" prop="status" dict-type="sys_status" min-width="80" />
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" min-width="165" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="240">
        <template #default="scope">
          <el-space :spacer="spacer" class="!gap-0">
            <el-button
              v-auth:has-authority="'system:dept:update'"
              type="primary"
              icon="edit"
              class="!px-0"
              text
              @click="handleAddOrEdit(scope.row, false)"
              >修改</el-button
            >
            <el-button
              v-auth:has-authority="'system:dept:update'"
              type="primary"
              class="!px-0"
              icon="plus"
              text
              @click="handleAddOrEdit(scope.row, true)"
              >新增</el-button
            >
            <el-button
              v-if="scope.row.parentId != 0"
              v-auth:has-authority="'system:dept:delete'"
              class="!px-0"
              type="danger"
              icon="delete"
              text
              @click="handleDeleteBatch('name', '名称', scope.row, false)"
              >删除</el-button
            >
          </el-space>
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
import { deleteByIdsApi, postListApi } from '@/api/system/dept'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ElDivider } from 'element-plus'

const state: StateOptions = reactive({
  api: {
    postListApi,
    deleteByIdsApi,
  },
  queryForm: {
    status: '',
    tenantId: '',
    name: '',
  },
  data: [],
  loading: false,
})

const queryFormRef = ref()
const addOrEditRef = ref()
// 是否展开，默认全部展开
const isExpandAll = ref(true)
// 是否重新渲染表格状态
const refreshTable = ref(true)

// 显示搜索条件
const showSearch = ref(true)
const authStore = useAuthStore()
const spacer = h(ElDivider, { direction: 'vertical' })

const { getList, handleDeleteBatch } = crud(state)

/**
 * 重置按钮操作
 */
const handleResetQuery = () => {
  if (queryFormRef.value) {
    queryFormRef.value.resetFields()
  }

  getList()
}

/**
 * 新增 / 修改
 * @param row 当前行数据
 * @param isAdd 是否新增
 */
const handleAddOrEdit = (row: any = null, isAdd: boolean = true) => {
  if (!authStore.permitAccess()) return
  addOrEditRef.value.init(row, isAdd)
}

/**
 * 切换全部展开和折叠
 */
const toggleExpandAll = () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

onMounted(() => {
  getList()
})
</script>
