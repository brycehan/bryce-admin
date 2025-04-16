<template>
  <el-card shadow="never" ref="bpmFormCardRef">
    <el-form ref="queryFormRef" :model="state.queryForm" :inline="true" v-show="showSearch" @keyup.enter="getPage()" @submit.prevent>
      <el-form-item label="表单名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入表单名" clearable />
      </el-form-item>
      <el-form-item label="状态" label-width="50" prop="status">
        <dict-select v-model="state.queryForm.status" dict-type="sys_status" placeholder="状态" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth:has-authority="'bpm:form:save'" type="primary" icon="Plus" plain @click="openFormEditor()">新增</el-button>
      <el-button v-auth:has-authority="'bpm:form:delete'" type="danger" icon="Delete" plain @click="handleDeleteBatch('name', '表单名')">删除</el-button>
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
      <el-table-column label="表单名称" prop="name" header-align="center" align="center" />
      <dict-table-column label="状态" prop="status" dict-type="sys_status" />
      <el-table-column label="备注" prop="remark" header-align="center" align="center" />
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" width="170" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="240">
        <template #default="scope">
          <el-button v-auth:has-authority="'bpm:form:update'" type="primary" icon="Edit" link @click="openFormEditor(scope.row)">修改</el-button>
          <el-button type="info" icon="view" text @click="handleInfo(scope.row.id)">详情</el-button>
          <el-button v-auth:has-authority="'bpm:form:delete'" type="danger" icon="Delete" link @click="handleDeleteBatch('name', '表单名', scope.row)">删除</el-button>
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

    <!-- 弹窗，详情 -->
    <el-dialog v-model="detailVisible" title="表单详情" :close-on-click-modal="false">
      <form-create :option="detailData.option" :rule="detailData.rule" />
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { postPageApi, deleteByIdsApi, getByIdApi } from '@/api/bpm/form'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";
import { setPreviewConfAndFields } from '@/utils/formCreate'
import FormCreate from '@form-create/element-ui'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi
  },
  queryForm: {
    name: '',
    status: ''
  },
})

const router = useRouter() // 路由
const queryFormRef = ref()

// 显示搜索条件
const showSearch = ref(true)

onMounted(() => {
  getPage()
})

const {
  getPage,
  handleSizeChange,
  handleCurrentChange,
  handleDeleteBatch,
  handleSelectionChange,
} = crud(state)

/**
 * 重置按钮操作
 */
const handleResetQuery = () => {
  for (const key in state.range) {
    state.range[key] = []
  }

  if(queryFormRef.value) {
    queryFormRef.value.resetFields()
  }

  getPage()
}

/**
 * 打开表单编辑器弹窗
 *
 * @param row 当前行数据
 */
const openFormEditor = (row?: any) => {
  const toRoute: { name: string, query?: any} = { name: 'BpmFormEditor', }
  if (row) toRoute.query = { id: row.id }
  router.push(toRoute)
}

// 详情弹窗显示
const detailVisible = ref(false)
// 详情弹窗数据
const detailData = ref({
  option: {},
  rule: []
})

/**
 * 详情弹窗
 */
const handleInfo = (id: any) => {
  if (id) {
    getByIdApi(id).then((res: any) => {
      setPreviewConfAndFields(detailData, res.data.conf, res.data.fields)
      // 详情弹窗显示
      detailVisible.value = true
    })
  }
}
</script>
