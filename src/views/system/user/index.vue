<template>
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card shadow="never">
        <org-tree @node-click="handleOrgClick" />
      </el-card>
    </el-col>
    <el-col :span="19">
      <el-card shadow="never">
        <el-form
          ref="queryFormRef"
          :model="state.queryForm"
          :inline="true"
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
            <dict-select
              v-model="state.queryForm.status"
              dict-type="sys_status"
              placeholder="用户状态"
              clearable
            />
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
            <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row class="mb-2">
          <el-button
            v-auth="'system:user:save'"
            type="primary"
            icon="Plus"
            @click="handleAddOrEdit()"
            >新增</el-button
          >

          <el-upload
            v-auth="'system:user:import'"
            :action="importUrl"
            :headers="headers"
            :before-upload="handleBeforeUpload"
            :on-success="handleOnSuccess"
            :show-file-list="false"
            class="el-upload-container"
          >
            <el-button type="info" icon="Upload">导入</el-button>
          </el-upload>
          <!--      <el-button v-auth="'system:user:import'" type="info" icon="Upload" @click="handleDeleteBatch()">导入</el-button>-->
          <el-button
            v-auth="'system:user:export'"
            type="success"
            icon="Download"
            @click="handleDownloadExcel()"
            >导出</el-button
          >
          <el-button
            v-auth="'system:user:delete'"
            type="danger"
            icon="Delete"
            @click="handleDeleteBatch()"
            >批量删除</el-button
          >
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
          <el-table-column label="账号" prop="username" sortable="custom" header-align="center" align="center" />
          <el-table-column label="姓名" prop="nickname" sortable="custom" header-align="center" align="center" />
          <el-table-column label="手机号码" prop="phone" sortable="custom" header-align="center" align="center" />
          <el-table-column label="机构" prop="orgName" header-align="center" align="center" />
          <dict-table-column label="状态" prop="status" dict-type="sys_status" width="80" />
          <el-table-column
            label="创建时间"
            prop="createdTime"
            header-align="center"
            align="center"
            width="160"
          />
          <el-table-column
            label="操作"
            fixed="right"
            header-align="center"
            align="center"
            width="150"
          >
            <template #default="scope">
              <el-button
                v-auth="'system:user:update'"
                type="primary"
                text
                @click="handleAddOrEdit(scope.row.id)"
                >修改</el-button
              >
              <el-button
                v-auth="'system:user:delete'"
                type="danger"
                text
                @click="handleDeleteBatch(scope.row.id)"
                >删除</el-button
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

        <!-- 弹窗，新增 / 修改 -->
        <AddOrEdit ref="addOrEditRef" @refresh-page="getPage" />
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddOrEdit from './add-or-edit.vue'
import { postPageApi, deleteByIdsApi, postDownloadExcelApi, importUrl } from '@/api/system/user'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { useAuthStore } from '@/stores/modules/auth'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import OrgTree from '@/views/system/user/org-tree.vue'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi,
    postExportExcelApi: postDownloadExcelApi
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

onMounted(() => {
  getPage()
})

const {
  getPage,
  handleSizeChange,
  handleCurrentChange,
  handleDeleteBatch,
  handleSelectionChange,
  handleDownloadExcel,
  handleBeforeUpload,
  handleSortChange
} = crud(state)

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

const authStore = useAuthStore()

/**
 * 上传文件请求头
 */
const headers = {
  Authorization: authStore.accessToken
}

const handleOnSuccess: UploadProps['onSuccess'] = (res) => {
  if (res.code !== 200) {
    ElMessage.error('导入失败' + res.message)
    return false
  }
  getPage()
  ElMessage.success('导入成功')
}
</script>
