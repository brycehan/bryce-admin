<template>
  <el-card shadow="never">
    <el-form ref="queryFormRef" :model="state.queryForm" :inline="true" label-width="68px" @keyup.enter="getPage()" @submit.prevent>
      <el-form-item label="账号" label-width="40px" prop="username">
        <el-input v-model="state.queryForm.username" placeholder="账号" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="state.queryForm.phone" placeholder="手机号码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <select-user type="primary" icon="Plus" @select="handleUser" class="mr-3"></select-user>
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
      <el-table-column label="姓名" prop="fullName" header-align="center" align="center" />
      <el-table-column label="手机号码" prop="phone" header-align="center" align="center" />
      <dict-table-column label="状态" prop="status" dict-type="sys_status" width="100"/>
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="100">
        <template #default="scope">
          <el-button type="danger" link @click="handleDeleteBatch(scope.row.id)">删除</el-button>
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
  </el-card>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import AddOrEdit from './add-or-edit.vue'
import { userPage as page, saveUsers, deleteUsers as deleteByIds } from '@/api/system/role'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";
import {ElMessage, ElMessageBox} from "element-plus";

const props = defineProps({
  roleId: {
    type: String,
    required: true
  }
})

const state: StateOptions = reactive({
  api: {
    page,
    deleteByIds
  },
  queryForm: {
    roleId: props.roleId,
    username: '',
    gender: '',
    type: '',
    phone: '',
    orgId: '',
    status: ''
  },
  range: {
    createdTime: ''
  },
})

const queryFormRef = ref()
const addOrEditRef = ref()

onMounted(() => {
  getPage()
})

const {
  getPage,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
} = crud(state)

/** 重置按钮操作 */
const handleResetQuery = () => {
  for (const key in state.range) {
    state.range[key] = []
  }

  if(queryFormRef.value) {
    queryFormRef.value.resetFields()
  }

  getPage()
}

/** 新增用户 */
const handleUser = (userIds: string[]) => {
  saveUsers(props.roleId, userIds).then(() => {
    ElMessage.success({
      message: '操作成功',
      duration: 500,
      onClose: () => {
        getPage()
      }
    })
  })
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
        deleteByIds(props.roleId, data).then(() => {
          ElMessage.success('删除成功')
          getPage()
        })
      })
      .catch((error) => {
        console.error(error)
      })
}
</script>
