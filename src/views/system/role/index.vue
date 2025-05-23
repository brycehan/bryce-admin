<template>
  <el-card shadow="never">
    <el-form
      v-show="showSearch"
      ref="queryFormRef"
      :model="state.queryForm"
      :inline="true"
      @keyup.enter="getPage()"
      @submit.prevent
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入角色名称" clearable />
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input v-model="state.queryForm.code" placeholder="请输入角色编码" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-select v-model="state.queryForm.status" dict-type="sys_status" placeholder="角色状态" clearable />
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
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth:has-authority="'system:role:save'" type="primary" plain icon="Plus" @click="handleAddOrEdit()"
        >新增</el-button
      >
      <el-button
        v-auth:has-authority="'system:role:delete'"
        type="danger"
        plain
        icon="Delete"
        @click="handleDeleteBatch('code', '角色编码')"
        >删除
      </el-button>
      <el-button
        v-auth:has-authority="'system:role:export'"
        type="success"
        plain
        icon="Download"
        @click="handleDownloadExcel()"
        >导出</el-button
      >
      <right-toolbar v-model:show-search="showSearch" @refresh-page="getPage" />
    </el-row>
    <el-table
      v-loading="state.loading as boolean"
      :data="state.data"
      :border="true"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column
        label="角色名称"
        prop="name"
        header-align="center"
        align="center"
        show-overflow-tooltip
        min-width="120"
      />
      <el-table-column
        label="角色编码"
        prop="code"
        sortable="custom"
        header-align="center"
        align="center"
        show-overflow-tooltip
        min-width="120"
      />
      <el-table-column
        label="显示顺序"
        prop="sort"
        sortable="custom"
        header-align="center"
        align="center"
        min-width="110"
      />
      <dict-table-column
        label="状态"
        prop="status"
        sortable="custom"
        header-align="center"
        align="center"
        min-width="90"
        dict-type="sys_status"
        column-type="switch"
        @change="handleChangeStatus"
      />
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" min-width="165" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="220">
        <template #default="scope">
          <el-space v-if="scope.row.id != 1" :spacer="spacer" class="!gap-0">
            <el-button
              v-auth:has-authority="'system:role:update'"
              type="primary"
              class="!px-0"
              icon="edit"
              text
              @click="handleAddOrEdit(scope.row.id)"
              >修改
            </el-button>
            <el-button
              v-auth:has-authority="'system:role:delete'"
              type="danger"
              icon="delete"
              class="!px-0"
              text
              @click="handleDeleteBatch('code', '角色编码', scope.row)"
              >删除
            </el-button>
            <el-dropdown
              v-auth:has-authority="'system:role:update'"
              @command="(command: string) => handleCommand(command, scope.row)"
            >
              <el-button type="success" icon="d-arrow-right" class="flex !px-0 leading-normal" text>更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="handleDataScope" icon="CircleCheck">数据权限</el-dropdown-item>
                  <el-dropdown-item command="handleAssignUser" icon="User">分配用户</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-space>
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
    <add-or-edit ref="addOrEditRef" @refresh-page="getPage" />
    <!-- 数据权限 -->
    <DataScope ref="dataScopeRef" />
    <!-- 弹窗，分配用户 -->
    <el-drawer v-if="assignUserVisible" v-model="assignUserVisible" :title="assignUserTitle" size="80%">
      <AssignUser :row="assignUserRow" />
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import AddOrEdit from './add-or-edit.vue'
import { postPageApi, deleteByIdsApi, postExportExcelApi, patchStatusApi } from '@/api/system/role'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import DataScope from '@/views/system/role/data-scope.vue'
import AssignUser from '@/views/system/role/assign-user.vue'
import modal from '@/utils/modal'
import { ElDivider, ElMessage } from 'element-plus'
import { h } from 'vue'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi,
    postExportExcelApi,
  },
  queryForm: {
    name: '',
    code: '',
    status: '',
    deptId: '',
    createdTime: '',
  },
  range: {
    createdTime: '',
  },
})

const queryFormRef = ref()
const addOrEditRef = ref()
const dataScopeRef = ref()

// 显示搜索条件
const showSearch = ref(true)

// 分配用户
const assignUserVisible = ref(false)
const assignUserTitle = ref('')
const assignUserRow = ref()
const authStore = useAuthStore()
const spacer = h(ElDivider, { direction: 'vertical' })

const {
  getPage,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleSortChange,
  handleDeleteBatch,
  handleDownloadExcel,
} = crud(state)

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

/**
 * 新增/修改 弹窗
 *
 * @param id 数据ID
 */
const handleAddOrEdit = (id?: string) => {
  if (!authStore.permitAccess()) return
  addOrEditRef.value.init(id)
}

/**
 * 状态改变
 *
 * @param row 当前行数据
 */
const handleChangeStatus = (row: any) => {
  const text = row.status === 1 ? '启用' : '停用'
  row.status = row.status === 1 ? 0 : 1
  modal
    .confirm(`确定要${text}名称为“${row.name}”的角色吗？`)
    .then(() => patchStatusApi(row.id, row.status === 1 ? 0 : 1))
    .then(() => {
      row.status = row.status === 1 ? 0 : 1
      ElMessage.success(`${text}成功`)
    })
}

/**
 * 更多弹窗操作
 *
 * @param command 命令
 * @param row 行数据
 */
const handleCommand = (command: string, row: any) => {
  switch (command) {
    case 'handleDataScope':
      handleDataScope(row)
      break
    case 'handleAssignUser':
      handleAssignUser(row)
      break
    default:
      break
  }
}

/**
 * 分配数据权限
 *
 * @param row 当前行数据
 */
const handleDataScope = (row: any) => {
  if (!authStore.permitAccess()) return
  dataScopeRef.value.init(row.id)
}

/**
 * 分配用户
 *
 * @param row 当前行数据
 */
const handleAssignUser = (row: any) => {
  if (!authStore.permitAccess()) return

  assignUserVisible.value = true
  assignUserTitle.value = `分配用户 - 角色“${row.name}”`
  assignUserRow.value = row
}

onMounted(() => {
  getPage()
})
</script>
