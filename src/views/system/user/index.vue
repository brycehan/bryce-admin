<template>
  <el-row :gutter="10">
    <!-- 部门数据 -->
    <el-col :span="5" :xs="24">
      <el-card shadow="never">
        <org-tree @node-click="handleOrgClick" />
      </el-card>
    </el-col>
    <!-- 用户数据 -->
    <el-col :span="19" :xs="24">
      <el-card shadow="never">
        <el-form
          ref="queryFormRef"
          :model="state.queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
          @keyup.enter="getPage()"
          @submit.prevent
        >
          <el-form-item label="账号" label-width="40px" prop="username">
            <el-input v-model="state.queryForm.username" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="state.queryForm.phone" placeholder="请输入手机号码" />
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
          <el-button v-auth="'system:user:save'" type="primary" icon="Plus" @click="handleAddOrEdit()">新增 </el-button>
          <el-button v-auth="'system:user:delete'" type="danger" icon="Delete" @click="handleDeleteBatch()">批量删除</el-button>
          <el-button v-auth="'system:user:import'" type="info" icon="Upload" @click="handleXlsxUpload()">导入</el-button>
          <el-button v-auth="'system:user:export'" type="success" icon="Download" @click="handleDownloadExcel()">导出</el-button>
          <right-toolbar v-model:showSearch="showSearch" :columns="columns" @refresh-page="getPage" />
        </el-row>
        <el-table
          v-loading="state.loading"
          :data="state.data"
          :border="true"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" header-align="center" align="center" width="50" />
          <el-table-column label="账号" prop="username" sortable="custom" header-align="center" align="center" v-if="columns[0].visible" />
          <el-table-column label="姓名" prop="nickname" sortable="custom" header-align="center" align="center" v-if="columns[1].visible" />
          <el-table-column label="部门" prop="orgName" header-align="center" align="center" v-if="columns[2].visible"/>
          <el-table-column label="手机号码" prop="phone" sortable="custom" header-align="center" align="center" v-if="columns[3].visible" />
          <el-table-column label="状态" prop="status" sortable="custom" header-align="center" align="center" v-if="columns[4].visible" >
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                :disabled="scope.row.superAdmin"
                :width="40"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" width="160" v-if="columns[5].visible" />
          <el-table-column label="操作" fixed="right" header-align="center" align="center" width="250" v-if="columns[6].visible" >
            <template #default="scope">
              <div v-if="!scope.row.superAdmin">
                <el-button
                  v-auth="'system:user:update'"
                  type="primary"
                  icon="edit"
                  text
                  @click="handleAddOrEdit(scope.row.id)"
                  >修改
                </el-button>
                <el-button
                  v-auth="'system:user:delete'"
                  type="danger"
                  icon="delete"
                  text
                  @click="handleDeleteBatch(scope.row)"
                  >删除
                </el-button>
                <el-dropdown
                  v-auth="['system:user:resetPassword', 'system:user:update']"
                  @command="(command: string) => handleCommand(command, scope.row)"
                >
                  <el-button type="success" class="btn-more-link" icon="d-arrow-right" text>更多</el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-if="auth('system:user:resetPassword')" command="resetPassword" icon="key"
                        >重置密码</el-dropdown-item
                      >
                      <el-dropdown-item v-if="auth('system:user:update')" command="assignRole" icon="plus"
                        >分配角色</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
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
        <!-- 弹窗，导入 -->
        <ImportData ref="importDataRef" @refresh-page="getPage" />
        <!-- 弹窗，重置密码 -->
        <ResetPassword ref="resetPasswordRef" />
        <!-- 弹窗，分配角色 -->
        <el-drawer v-if="assignRoleVisible" v-model="assignRoleVisible" :title="assignRoleTitle" :size="1000">
          <AssignRole :row="assignRoleRow" />
        </el-drawer>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddOrEdit from './add-or-edit.vue'
import ImportData from '@/views/system/user/import-data.vue'
import { postPageApi, deleteByIdsApi, postExportExcelApi, patchStatusApi } from '@/api/system/user'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import OrgTree from '@/views/system/user/org-tree.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ResetPassword from '@/views/system/user/reset-password.vue'
import AssignRole from '@/views/system/user/assign-role.vue'
import { auth } from '@/utils/tool'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi,
    postExportExcelApi
  },
  queryForm: {
    username: '',
    gender: '',
    type: '',
    phone: '',
    orgId: '',
    status: ''
  },
  range: {
    createdTime: ''
  }
})

const queryFormRef = ref()
const addOrEditRef = ref()
const importDataRef = ref()
const resetPasswordRef = ref()

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

const assignRoleVisible = ref(false)
const assignRoleTitle = ref('')
const assignRoleRow = ref()

onMounted(() => {
  getPage()
})

const { getPage, handleSizeChange, handleCurrentChange, handleSelectionChange, handleDownloadExcel, handleSortChange } =
  crud(state)

const handleOrgClick = (orgId: any) => {
  state.queryForm.orgId = orgId
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
const handleAddOrEdit = (id?: bigint) => {
  addOrEditRef.value.init(id)
}

/**
 * 导入按钮操作
 */
const handleXlsxUpload = () => {
  importDataRef.value.init()
}

/**
 * 批量删除
 *
 * @param row
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

  const usernames = data.map((item: any) => item.username).join(',')
  const ids = data.map((item: any) => item.id)

  ElMessageBox.confirm(`是否确认删除账号为“${usernames}”的数据项？`, '系统提示', {
    type: 'warning'
  })
    .then(() => {
      deleteByIdsApi(ids).then(() => {
        ElMessage.success('删除成功')
        getPage()
      })
    })
    .catch((error) => {
      console.error(error)
    })
}

const handleStatusChange = (row: any) => {
  let text = row.status === 1 ? '启用' : '停用'
  ElMessageBox.confirm(`确定要${text}“${row.username}”用户吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      patchStatusApi(row.id, row.status).then(() => {
        ElMessage.success(`${text}成功`)
      })
    })
    .catch(() => {
      row.status = row.status === 1 ? 0 : 1
    })
}

const handleCommand = (command: string, row: any) => {
  switch (command) {
    case 'resetPassword':
      handleResetPassword(row)
      break
    case 'assignRole':
      handleAssignRole(row)
      break
    default:
      break
  }
}

const handleResetPassword = (row: any) => {
  resetPasswordRef.value.init(row)
}

const handleAssignRole = (row: any) => {
  assignRoleVisible.value = true
  assignRoleTitle.value = `分配角色 - 账号“${row.username}”`
  assignRoleRow.value = row
}

</script>
