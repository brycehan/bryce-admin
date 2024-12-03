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
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入机构名称" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-select
          v-model="state.queryForm.status"
          dict-type="sys_status"
          placeholder="机构状态"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getList()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth="'system:org:save'" type="primary" plain icon="Plus" @click="handleAddOrEdit()"
        >新增</el-button
      >
      <el-button plain @click="toggleExpandAll()">
        <template v-if="!isExpandAll">
          全部展开 <el-icon class="ml-1"> <arrow-down /></el-icon>
        </template>
        <template v-else>
          全部收起 <el-icon class="ml-1"> <arrow-up /></el-icon>
        </template>
      </el-button>
      <right-toolbar v-model:showSearch="showSearch" @refresh-page="getList" />
    </el-row>
    <el-table
      v-if="refreshTable"
      v-loading="state.loading"
      :default-expand-all="isExpandAll"
      :data="state.data"
      row-key="id"
      :border="true"
      style="width: 100%"
    >
      <el-table-column label="名称" prop="name" header-align="center" align="center" />
      <el-table-column label="排序" prop="sort" header-align="center" align="center" />
      <dict-table-column label="状态" prop="status" dict-type="sys_status" width="80" />
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" />
      <el-table-column label="操作" fixed="right" header-align="center" width="240">
        <template #default="scope">
          <el-button
            v-if="scope.row.parentId != 0"
            v-auth="'system:org:update'"
            type="primary"
            icon="plus"
            text
            @click="handleAddOrEdit(scope.row, true)"
            >新增</el-button
          >
          <el-button
            v-auth="'system:org:update'"
            type="primary"
            icon="edit"
            text
            @click="handleAddOrEdit(scope.row, false)"
            >修改</el-button
          >
          <el-button
            v-auth="'system:org:delete'"
            type="danger"
            icon="delete"
            text
            @click="handleDeleteBatch(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗，新增 / 修改 -->
    <AddOrEdit ref="addOrEditRef" @refresh-page="getList" />
  </el-card>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import AddOrEdit from './add-or-edit.vue'
import { deleteByIdsApi, postListApi } from '@/api/system/org'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

const state: StateOptions = reactive({
  api: {
    postListApi
  },
  queryForm: {
    status: '',
    tenantId: '',
    name: ''
  },
  data: [],
  loading: false
})

const queryFormRef = ref()
const addOrEditRef = ref()
// 是否展开，默认全部展开
const isExpandAll = ref(true)
// 是否重新渲染表格状态
const refreshTable = ref(true)

// 显示搜索条件
const showSearch = ref(true)

onMounted(() => {
  getList()
})

const { getList } = crud(state)

/** 重置按钮操作 */
const handleResetQuery = () => {
  if (queryFormRef.value) {
    queryFormRef.value.resetFields()
  }

  getList()
}

const handleAddOrEdit = (row: any = null, isAdd: boolean = true) => {
  addOrEditRef.value.init(row, isAdd)
}

const handleDeleteBatch = (id: string) => {
  let data: any[] = [id]
  ElMessageBox.confirm('确定进行删除操作？', '提示', {
    type: 'warning'
  })
    .then(() => {
      deleteByIdsApi(data).then(() => {
        ElMessage.success('删除成功')
        getList()
      })
    })
    .catch((error) => {
      console.error(error)
    })
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
</script>
