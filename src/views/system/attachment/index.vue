<template>
  <el-card shadow="never">
    <el-form
      ref="queryFormRef"
      :model="state.queryForm"
      :inline="true"
      v-show="showSearch"
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
    <el-row class="mb-2" v-auth:has-authority="">
      <el-button v-auth:has-authority="'system:attachment:save'" type="info" plain icon="Upload" @click="handleUpload()"
      >上传</el-button
      >
      <el-button
        v-auth:has-authority="'system:attachment:delete'"
        type="danger"
        plain
        icon="Delete"
        @click="handleDeleteBatch('name', '附件名称')"
        >删除</el-button
      >
      <right-toolbar v-model:showSearch="showSearch" @refresh-page="getPage" />
    </el-row>
    <el-table
      v-loading="state.loading as boolean"
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
        min-width="180"
        fixed="left"
      />
<!--      <el-table-column-->
<!--        label="附件地址"-->
<!--        show-overflow-tooltip-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        min-width="250"-->
<!--      ><template #default="scope">-->
<!--        <el-button v-if="scope.row.accessType === 0" @click="handleCopy(scope)" text>-->
<!--          <el-text :style="{'width': (scope.column.realWidth - 20) + 'px'}" truncated>-->
<!--            {{ scope.row.url }}-->
<!--          </el-text></el-button>-->
<!--      </template>-->
<!--      </el-table-column>-->
      <el-table-column label="附件名后缀" prop="suffix" header-align="center" align="center" min-width="115"/>
      <dict-table-column label="访问类型" prop="accessType" dict-type="sys_access_type" min-width="100"/>
      <el-table-column label="附件大小" prop="size" header-align="center" align="center" min-width="110">
        <template #default="scope">
          {{ convertSizeFormat(scope.row.size) }}
        </template>
      </el-table-column>
      <el-table-column
        label="sha256"
        prop="hash"
        show-overflow-tooltip
        header-align="center"
        align="center"
        min-width="250"
      />
      <el-table-column label="存储平台" prop="platform" header-align="center" align="center" min-width="100"/>
      <el-table-column
        label="创建时间"
        prop="createdTime"
        show-overflow-tooltip
        header-align="center"
        align="center"
        min-width="170"
      />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="180">
        <template #default="scope">
<!--          &lt;!&ndash; 公共访问权限，浏览器有下载进度条 &ndash;&gt;-->
<!--          <a :href="scope.row.url" download v-if="scope.row.accessType === 0" class="download-a">-->
<!--            <el-button type="primary"  icon="download" text>下载</el-button>-->
<!--          </a>-->
          <el-button
            type="primary"
            icon="download"
            text
            @click="handleDownload(scope.row)"
            >下载</el-button
          >
          <el-button
            v-auth:has-authority="'system:attachment:delete'"
            type="danger"
            icon="delete"
            text
            @click="handleDeleteBatch('name', '附件名称', scope.row)"
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
    <!-- 弹窗，导入 -->
    <upload-file ref="uploadFileRef" @refresh-page="getPage" />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { deleteByIdsApi, downloadByIdApi, postPageApi } from '@/api/system/attachment'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { convertSizeFormat } from '@/utils/tool'
import download from '@/utils/download'
import UploadFile from '@/views/system/attachment/upload-file.vue'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi
  },
  queryForm: {
    name: '',
    platform: ''
  }
})

const queryFormRef = ref()
// 显示搜索条件
const showSearch = ref(true)
const uploadFileRef = ref()
const { copy } = useClipboard()

onMounted(() => {
  getPage()
})

const { getPage, handleSizeChange, handleCurrentChange, handleDeleteBatch, handleSelectionChange } =
  crud(state)

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
 * 上传按钮操作
 */
const handleUpload = () => {
  uploadFileRef.value.init()
}

/**
 * 拷贝附件地址操作
 */
const handleCopy = (row: any) => {
  copy(row.row.url)
  ElMessage.success('已复制')
}

/**
 * 下载按钮操作
 */
const handleDownload = (row: any) => {
  // 访问类型：0-public 1-安全
  if (row.accessType === 1) {
    downloadByIdApi(row.id)
  } else {
    download.get(row.url, { filename: row.name })
  }
}
</script>

<style lang="scss" scoped>
.download-a + .el-button {
  border-left: 1px solid #e4e7ec;
  padding-left: 10px !important;
}
</style>
