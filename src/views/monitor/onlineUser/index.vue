<template>
  <el-card shadow="never">
    <el-form
          ref="queryFormRef"
          :model="state.queryForm"
          :inline="true"
          @keyup.enter="getPage()"
          @submit.prevent
        >
          <el-form-item label="账号" label-width="40px" prop="username">
            <el-input v-model="state.queryForm.username" placeholder="请输入账号" clearable/>
          </el-form-item>
      <el-form-item label="登录IP" label-width="60px" prop="loginIp">
        <el-input v-model="state.queryForm.loginIp" placeholder="请输入登录IP" clearable/>
      </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
            <el-button icon="Refresh" @click="handleResetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
    <el-table
      v-loading="state.loading"
      :data="state.data"
      :border="true"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column
        label="会话编号"
        prop="userKey"
        show-overflow-tooltip
        header-align="center"
        align="center"
      />
      <el-table-column label="账号" prop="username" header-align="center" align="center" />
      <el-table-column
        label="姓名"
        prop="nickname"
        show-overflow-tooltip
        header-align="center"
        align="center"
      />
      <!--      <el-table-column label="机构名称" prop="orgName" header-align="center" align="center" />-->
      <el-table-column
        label="登录IP"
        prop="loginIp"
        show-overflow-tooltip
        header-align="center"
        align="center"
      />
      <el-table-column label="登录位置" prop="loginLocation" header-align="center" align="center" />
      <el-table-column label="浏览器" prop="browser" header-align="center" align="center" />
      <el-table-column label="操作系统" prop="os" header-align="center" align="center" />
      <el-table-column
        label="登录时间"
        prop="loginTime"
        show-overflow-tooltip
        header-align="center"
        align="center"
        width="160"
      />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="100">
        <template #default="scope">
          <el-button
            v-auth="'monitor:onlineUser:delete'"
            type="primary"
            icon="delete"
            text
            @click="handleForceQuit(scope.row.userKey)"
            >强退</el-button
          >
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
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { postPageApi, deleteOnlineUserApi } from '@/api/monitor/onlineUser'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ElMessage, ElMessageBox } from 'element-plus'

const state: StateOptions = reactive({
  api: {
    postPageApi: postPageApi
  },
  queryForm: {
    username: '',
    loginIp: ''
  },
})

const queryFormRef = ref()

onMounted(() => {
  getPage()
})

const { getPage, handleSizeChange, handleCurrentChange, handleSelectionChange } = crud(state)

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

const handleForceQuit = (userKey: string) => {
  ElMessageBox.confirm('确定踢出该用户？', '提示', {
    type: 'warning'
  })
    .then(() => {
      deleteOnlineUserApi(userKey).then(() => {
        ElMessage.success('操作成功')
        getPage()
      })
    })
    .catch(() => {})
}
</script>
