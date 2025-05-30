<template>
  <el-row :gutter="10">
    <!-- 部门数据 -->
    <el-col :span="4" :xs="24">
      <el-card shadow="never">
        <dept-tree @node-click="handleDeptClick" />
      </el-card>
    </el-col>
    <!-- 用户数据 -->
    <el-col :span="20" :xs="24">
      <el-card shadow="never">
        <el-form
          v-show="showSearch"
          ref="queryFormRef"
          :model="state.queryForm"
          :inline="true"
          class="query-form"
          @keyup.enter="getPage()"
          @submit.prevent
        >
          <el-form-item label="账号" prop="username">
            <el-input v-model="state.queryForm.username" placeholder="请输入账号" clearable />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="state.queryForm.phone" placeholder="请输入手机号码" clearable />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <dict-select v-model="state.queryForm.status" dict-type="sys_status" placeholder="用户状态" clearable />
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
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
            <el-button icon="Refresh" @click="handleResetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row class="mb-2">
          <el-button
            v-auth:has-authority="'system:user:save'"
            type="primary"
            plain
            icon="Plus"
            @click="handleAddOrEdit()"
            >新增
          </el-button>
          <el-button
            v-auth:has-authority="'system:user:delete'"
            type="danger"
            plain
            icon="Delete"
            @click="handleDeleteBatch('username', '账号')"
            >删除</el-button
          >
          <el-button
            v-auth:has-authority="'system:user:import'"
            type="info"
            plain
            icon="Upload"
            @click="handleXlsxUpload()"
            >导入</el-button
          >
          <el-button
            v-auth:has-authority="'system:user:export'"
            type="success"
            plain
            icon="Download"
            @click="handleDownloadExcel()"
            >导出</el-button
          >
          <right-toolbar v-model:show-search="showSearch" :columns="columns" @refresh-page="getPage" />
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
            v-if="columns[0].visible"
            label="账号"
            prop="username"
            sortable="custom"
            header-align="center"
            align="center"
            show-overflow-tooltip
            min-width="100"
            fixed="left"
          />
          <el-table-column
            v-if="columns[1].visible"
            label="姓名"
            prop="nickname"
            sortable="custom"
            header-align="center"
            align="center"
            show-overflow-tooltip
            min-width="90"
          />
          <el-table-column
            v-if="columns[2].visible"
            label="所属部门"
            prop="deptName"
            header-align="center"
            align="center"
            show-overflow-tooltip
            min-width="110"
          />
          <el-table-column
            v-if="columns[3].visible"
            label="手机号码"
            prop="phone"
            sortable="custom"
            header-align="center"
            align="center"
            show-overflow-tooltip
            min-width="125"
          />
          <dict-table-column
            v-if="columns[4].visible"
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
          <el-table-column
            v-if="columns[5].visible"
            label="创建时间"
            prop="createdTime"
            header-align="center"
            align="center"
            show-overflow-tooltip
            min-width="170"
          />
          <el-table-column
            v-if="columns[6].visible"
            label="操作"
            fixed="right"
            header-align="center"
            align="center"
            min-width="255"
          >
            <template #default="scope">
              <el-space v-if="!scope.row.superAdmin" :spacer="spacer" class="!gap-0">
                <el-button
                  v-auth:has-authority="'system:user:update'"
                  type="primary"
                  icon="edit"
                  class="!px-0"
                  text
                  @click="handleAddOrEdit(scope.row.id)"
                  >修改
                </el-button>
                <el-button
                  v-auth:has-authority="'system:user:delete'"
                  type="danger"
                  class="!px-0"
                  icon="delete"
                  text
                  @click="handleDeleteBatch('username', '账号', scope.row)"
                  >删除
                </el-button>
                <el-dropdown
                  v-auth:has-any-authority="['system:user:resetPassword', 'system:user:update']"
                  @command="(command: string) => handleCommand(command, scope.row)"
                >
                  <el-button type="success" class="flex !px-0 leading-normal" icon="d-arrow-right" text>更多</el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-if="authHasAuthority('system:user:resetPassword')"
                        command="handleResetPassword"
                        icon="key"
                        >重置密码</el-dropdown-item
                      >
                      <el-dropdown-item
                        v-if="authHasAuthority('system:user:update')"
                        command="handleAssignRole"
                        icon="plus"
                        >分配角色</el-dropdown-item
                      >
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
        <!-- 弹窗，导入 -->
        <ImportData ref="importDataRef" @refresh-page="getPage" />
        <!-- 弹窗，重置密码 -->
        <ResetPassword ref="resetPasswordRef" />
        <!-- 弹窗，分配角色 -->
        <el-drawer v-if="assignRoleVisible" v-model="assignRoleVisible" :title="assignRoleTitle" size="80%">
          <AssignRole :row="assignRoleRow" />
        </el-drawer>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import AddOrEdit from './add-or-edit.vue'
import ImportData from '@/views/system/user/import-data.vue'
import { deleteByIdsApi, patchStatusApi, postExportExcelApi, postPageApi } from '@/api/system/user'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import DeptTree from '@/views/system/user/dept-tree.vue'
import { ElDivider, ElMessage } from 'element-plus'
import ResetPassword from '@/views/system/user/reset-password.vue'
import AssignRole from '@/views/system/user/assign-role.vue'
import { authHasAuthority } from '@/utils/tool'
import modal from '@/utils/modal'
import { h } from 'vue'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi,
    postExportExcelApi,
  },
  queryForm: {
    username: '',
    gender: '',
    type: '',
    phone: '',
    deptId: '',
    status: '',
  },
  range: {
    createdTime: '',
  },
})

const queryFormRef = ref()
const addOrEditRef = ref()
const importDataRef = ref()
const resetPasswordRef = ref()
const spacer = h(ElDivider, { direction: 'vertical' })

// 表格列信息
const columns = ref([
  { key: 0, label: `账号`, visible: true },
  { key: 1, label: `姓名`, visible: true },
  { key: 2, label: `部门`, visible: true },
  { key: 3, label: `手机号码`, visible: true },
  { key: 4, label: `状态`, visible: true },
  { key: 5, label: `创建时间`, visible: true },
  { key: 6, label: `操作`, visible: true },
])
// 显示搜索条件
const showSearch = ref(true)

// 分配角色
const assignRoleVisible = ref(false)
const assignRoleTitle = ref('')
const assignRoleRow = ref()
const authStore = useAuthStore()

const {
  getPage,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleDeleteBatch,
  handleDownloadExcel,
  handleSortChange,
} = crud(state)

const handleDeptClick = (deptId: any) => {
  state.queryForm.deptId = deptId
  getPage()
}

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
 */
const handleAddOrEdit = (id?: string) => {
  if (!authStore.permitAccess()) return
  addOrEditRef.value.init(id)
}

/**
 * 导入按钮操作
 */
const handleXlsxUpload = () => {
  if (!authStore.permitAccess()) return
  importDataRef.value.init()
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
    .confirm(`确定要${text}“${row.username}”用户吗？`)
    .then(() => patchStatusApi(row.id, row.status === 1 ? 0 : 1))
    .then(() => {
      row.status = row.status === 1 ? 0 : 1
      ElMessage.success(`${text}成功`)
    })
}

/**
 * 处理命令
 *
 * @param command 命令
 * @param row 当前行数据
 */
const handleCommand = (command: string, row: any) => {
  switch (command) {
    case 'handleResetPassword':
      handleResetPassword(row)
      break
    case 'handleAssignRole':
      handleAssignRole(row)
      break
    default:
      break
  }
}

/**
 * 处理重置密码
 *
 * @param row 当前行数据
 */
const handleResetPassword = (row: any) => {
  if (!authStore.permitAccess()) return
  resetPasswordRef.value.init(row)
}

/**
 * 处理分配角色
 *
 * @param row 当前行数据
 */
const handleAssignRole = (row: any) => {
  if (!authStore.permitAccess()) return

  assignRoleVisible.value = true
  assignRoleTitle.value = `分配角色 - 账号“${row.username}”`
  assignRoleRow.value = row
}

onMounted(() => {
  getPage()
})
</script>
