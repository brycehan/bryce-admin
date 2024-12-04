<template>
  <el-card shadow="never">
    <el-form
      ref="queryFormRef"
      :model="state.queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
      @keyup.enter="getList()"
      @submit.prevent
    >
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入菜单名称" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-select
          v-model="state.queryForm.status"
          dict-type="sys_status"
          placeholder="菜单状态"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getList()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth="'system:menu:save'" type="primary" plain icon="Plus" @click="handleAddOrEdit()"
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
      class="w-100"
    >
      <el-table-column
        label="菜单名称"
        prop="name"
        show-overflow-tooltip
        header-align="center"
        align="center"
        width="150"
      />
      <el-table-column label="图标" prop="icon" header-align="center" align="center">
        <template #default="scope">
          <svg-icon :icon="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" header-align="center" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 'M'" type="primary" size="small">菜单</el-tag>
          <el-tag v-if="scope.row.type === 'B'" type="success" size="small">按钮</el-tag>
          <el-tag v-if="scope.row.type === 'I'" type="info" size="small">接口</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="组件路径"
        prop="url"
        header-align="center"
        align="center"
        width="160"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="权限标识"
        prop="authority"
        header-align="center"
        align="center"
        width="160"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="显示顺序"
        prop="sort"
        sortable="custom"
        header-align="center"
        align="center"
        width="120"
      />
      <dict-table-column label="状态" prop="status" dict-type="sys_status" width="100" />
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
            v-auth="'system:menu:update'"
            type="primary"
            icon="edit"
            text
            @click="handleAddOrEdit(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-auth="'system:menu:delete'"
            type="danger"
            icon="delete"
            text
            @click="handleDeleteBatch(scope.row)"
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
import { postListApi, deleteByIdsApi } from '@/api/system/menu'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ElMessage } from 'element-plus'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import modal from '@/utils/modal'

const state: StateOptions = reactive({
  api: {
    postListApi,
    deleteByIdsApi
  },
  queryForm: {
    name: '',
    type: '',
    status: ''
  }
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

const { getList } = crud(state)

/** 重置按钮操作 */
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
 * 批量删除
 *
 * @param row 当前数据行
 */
const handleDeleteBatch = (row?: any) => {
  let data: any[] = []
  if (row) {
    data.push(row)
  } else {
    data = state.dataSelections as []
  }

  if (data.length === 0) {
    ElMessage.warning('请选择删除的记录')
    return
  }

  const menuNames = data.map((item: any) => item.name).join(',')
  modal.confirm(`是否确认删除菜单名称为“${menuNames}”的数据项？`).then(() => {
      deleteByIdsApi(data.map((item: any) => item.id)).then(() => {
        ElMessage.success('删除成功')
        getList()
      })
    })
    .catch((error) => {
      console.error(error)
    })
}

/**
 * 新增/修改 弹窗
 *
 * @param id 菜单ID
 */
const handleAddOrEdit = (id?: bigint) => {
  addOrEditRef.value.init(id)
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
