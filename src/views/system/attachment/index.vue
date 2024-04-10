<template>
  <el-card shadow="never">
    <el-form
      ref="queryFormRef"
      :model="state.queryForm"
      :inline="true"
      label-width="68px"
      @keyup.enter="getPage()"
      @submit.prevent
    >
      <el-form-item label="附件名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入附件名称" clearable />
      </el-form-item>
      <el-form-item label="存储平台" prop="platform">
        <el-input v-model="state.queryForm.platform" placeholder="请输入存储平台" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-upload
        v-auth="'system:attachment:save'"
        :action="constant.uploadUrl"
        :headers="headers"
        :before-upload="handleBeforeUpload"
        :on-success="handleOnSuccess"
        :show-file-list="false"
        :limit="9"
        :on-exceed="handleExceed"
        multiple
        class="el-upload-container"
      >
        <el-button type="primary" icon="Upload">上传</el-button>
      </el-upload>
      <el-button
        v-auth="'system:attachment:delete'"
        type="danger"
        icon="Delete"
        @click="handleDeleteBatch()"
        >删除</el-button
      >
    </el-row>
    <el-table
      v-loading="state.loading"
      :data="state.data"
      :border="true"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column
        label="附件名称"
        prop="name"
        show-overflow-tooltip
        header-align="center"
        align="center"
      />
      <el-table-column
        label="附件地址"
        prop="url"
        show-overflow-tooltip
        header-align="center"
        align="center"
      />
      <el-table-column label="附件大小" prop="size" header-align="center" align="center">
        <template #default="scope">
          {{ convertSizeFormat(scope.row.size) }}
        </template>
      </el-table-column>
      <el-table-column label="附件名后缀" prop="suffix" header-align="center" align="center" />
      <el-table-column
        label="哈希码"
        prop="hash"
        show-overflow-tooltip
        header-align="center"
        align="center"
      />
      <el-table-column label="存储平台" prop="platform" header-align="center" align="center" />
      <el-table-column
        label="创建时间"
        prop="createdTime"
        header-align="center"
        align="center"
        width="160"
      />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template #default="scope">
          <a :href="scope.row.url" download>
            <el-button v-auth="'system:attachment:info'" type="primary" link>下载</el-button>
          </a>
          <el-button
            v-auth="'system:attachment:delete'"
            type="danger"
            link
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
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { deleteByIds, page, saveOrUpdate } from '@/api/system/attachment'
import constant from '@/utils/constant'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ElMessage, type UploadProps, type UploadRawFile } from 'element-plus'
import { convertSizeFormat } from '@/utils/tool'
import { useAuthStore } from '@/stores/modules/auth'

const state: StateOptions = reactive({
  api: {
    page,
    deleteByIds
  },
  queryForm: {
    name: '',
    type: '',
    platform: ''
  },
  dataForm: {
    name: '',
    platform: '',
    size: '',
    type: '',
    suffix: '',
    hash: '',
    url: ''
  }
})

const queryFormRef = ref()

onMounted(() => {
  getPage()
})

const { getPage, handleSizeChange, handleCurrentChange, handleDeleteBatch, handleSelectionChange } =
  crud(state)

/** 重置按钮操作 */
const handleResetQuery = () => {
  for (const key in state.range) {
    state.range[key] = []
  }

  if (queryFormRef.value) {
    queryFormRef.value.resetFields()
  }

  getPage()
}

const authStore = useAuthStore()

/** 上传文件请求头 */
const headers = {
  Authorization: authStore.token,
  'source-client': 'pc'
}

/** 上传文件前处理 */
const handleBeforeUpload: UploadProps['beforeUpload'] = (file: UploadRawFile) => {
  if (file.size / 1024 / 1024 / 1024 > 1) {
    ElMessage.error('文件大小不能超过1GB')
    return false
  }
  return true
}

const handleOnSuccess: UploadProps['onSuccess'] = (res) => {
  if (res.code !== 200) {
    ElMessage.error('上传失败' + res.message)
    return false
  }

  Object.assign(state.dataForm, res.data[0])

  saveOrUpdate(state.dataForm).then(() => {
    getPage()
    ElMessage.success('上传成功')
  })
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `限制为9个，您这次选择了 ${files.length} 个文件, 总共 ${
      files.length + uploadFiles.length
    } 个文件`
  )
}
</script>
