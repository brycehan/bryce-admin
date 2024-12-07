<template>
  <el-row class="mb-2">
    <select-user type="primary" icon="Plus" :row="row" @select="handleAssignUser" class="mr-3"></select-user>
    <el-button type="danger" icon="Delete" @click="handleDeleteBatch()">删除</el-button>
  </el-row>
  <el-table
    v-loading="state.loading"
    :data="state.data"
    :border="true"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" header-align="center" align="center" width="50" />
    <el-table-column label="账号" prop="username" header-align="center" align="center" />
    <el-table-column label="姓名" prop="nickname" header-align="center" align="center" />
    <el-table-column label="手机号码" prop="phone" header-align="center" align="center" />
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
import { deleteAssignUserApi, postAssignUserPageApi as postPageApi, postAssignUserSaveApi } from '@/api/system/role'
import { crud, type StateOptions } from '@/utils/state'
import { ElMessage } from 'element-plus'
import SelectUser from '@/views/system/role/select-user.vue'
import modal from '@/utils/modal'

const props = defineProps({
  row: {
    type: Object,
    required: true
  }
})

const state: StateOptions = reactive({
  api: {
    postPageApi
  },
  queryForm: {
    roleId: props.row.id,
    assigned: 'Y',
    status: 1
  }
})

onMounted(() => {
  getPage()
})

const { getPage, handleSizeChange, handleCurrentChange, handleSelectionChange } = crud(state)

/**
 * 为角色分配用户
 *
 * @param userIds 用户ID集合
 */
const handleAssignUser = (userIds: any[]) => {
  postAssignUserSaveApi(state.queryForm.roleId, userIds).then(() => {
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
  const usernameStr = data.map((item) => item.username).join(',')
  modal
    .confirm(`是否确认移除账号为“${usernameStr}”的授权？`)
    .then(() => {
      deleteAssignUserApi(
        state.queryForm.roleId,
        data.map((item) => item.id)
      ).then(() => {
        ElMessage.success('移除授权成功')
        getPage()
      })
    })
    .catch((error) => {
      console.error(error)
    })
}
</script>
