<template>
  <el-row class="mb-2">
    <select-role type="primary" icon="Plus" :row="row" class="mr-3" @select="handleAssignRole" />
    <el-button type="danger" icon="Delete" @click="handleDeleteBatch()">删除</el-button>
  </el-row>
  <el-table
    v-loading="state.loading as boolean"
    :data="state.data"
    :border="true"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" header-align="center" align="center" width="50" />
    <el-table-column label="角色名称" prop="name" header-align="center" align="center" />
    <el-table-column label="角色编码" prop="code" header-align="center" align="center" />
    <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" />
    <el-table-column label="操作" fixed="right" header-align="center" align="center" width="100">
      <template #default="scope">
        <el-button type="danger" icon="delete" text @click="handleDeleteBatch(scope.row)">删除</el-button>
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
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { deleteAssignRoleApi, postAssignRolePageApi as postPageApi, postAssignRoleSaveApi } from '@/api/system/user'
import { crud, type StateOptions } from '@/utils/state'
import { ElMessage } from 'element-plus'
import SelectRole from '@/views/system/user/select-role.vue'
import modal from '@/utils/modal'

const props = defineProps({
  row: {
    type: Object,
    required: true,
  },
})

const state: StateOptions = reactive({
  api: {
    postPageApi,
  },
  queryForm: {
    userId: props.row.id,
    assigned: 'Y',
    status: 1,
  },
})

const authStore = useAuthStore()

const { getPage, handleSizeChange, handleCurrentChange, handleSelectionChange } = crud(state)

/**
 * 为用户分配增角色
 *
 * @param roleIds 角色ID集合
 */
const handleAssignRole = (roleIds: any[]) => {
  postAssignRoleSaveApi(state.queryForm.userId, roleIds).then(() => {
    getPage()
    ElMessage.success('授权成功')
  })
}

/**
 * 批量删除
 *
 * @param row
 */
const handleDeleteBatch = (row?: any) => {
  if (!authStore.permitAccess()) return
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

  const roleCodeStr = data.map((item) => item.code).join(',')
  modal
    .confirm(`是否确认移除角色编码为“${roleCodeStr}”的授权？`)
    .then(() => {
      deleteAssignRoleApi(
        state.queryForm.userId,
        data.map((item) => item.id),
      ).then(() => {
        ElMessage.success('移除授权成功')
        getPage()
      })
    })
    .catch((error) => {
      console.error(error)
    })
}

onMounted(() => {
  getPage()
})
</script>
