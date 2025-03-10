<template>
  <el-card shadow="never">
    <el-form ref="queryFormRef" :model="state.queryForm" :inline="true" v-show="showSearch" @keyup.enter="getPage()" @submit.prevent>
      <el-form-item label="流程名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入流程名称" clearable />
      </el-form-item>
      <el-form-item label="流程分类" prop="category">
        <el-input v-model="state.queryForm.category" placeholder="请输入流程分类" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth="'bpm:processDefinitionInfo:save'" type="primary" icon="Plus" plain @click="handleAddOrEdit()">新增</el-button>
      <el-button v-auth="'bpm:processDefinitionInfo:delete'" type="danger" icon="Delete" plain @click="handleDeleteBatch('id', '编号')">删除</el-button>
			<right-toolbar v-model:showSearch="showSearch" @refresh-page="getPage" />
    </el-row>
    <el-table
      v-loading="state.loading"
      :data="state.data"
      :border="true"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column label="流程名称" prop="name" header-align="center" align="center" show-overflow-tooltip min-width="120" />
      <el-table-column label="流程KEY" prop="key" header-align="center" align="center" show-overflow-tooltip min-width="120"/>
      <el-table-column label="分类名称" prop="categoryName" header-align="center" align="center" min-width="100" />
      <el-table-column label="表单信息" header-align="center" align="center" min-width="120">
        <template #default="scope">
          <el-button
            v-if="BpmFormType.NORMAL === scope.row.formType"
            type="primary"
            link
            @click="handleFormDetail(scope.row)"
          >
            {{ scope.row.formName }}
          </el-button>
          <el-button
            v-else-if="BpmFormType.CUSTOM === scope.row.formType"
            type="primary"
            link
            @click="handleFormDetail(scope.row)"
          >
            {{ scope.row.formCustomCreatePath }}
          </el-button>
          <el-text v-else>暂无表单</el-text>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="description" header-align="center" align="center" min-width="90">
        <template #default="scope">
          <div v-if="scope.row.processDefinition?.version">
            <el-tag v-if="scope.row.processDefinition?.suspensionState === 0" type="success">已发布</el-tag>
            <el-tag v-if="scope.row.processDefinition?.suspensionState === 1" type="warning">已停用</el-tag>
          </div>
          <el-tag v-else type="info">未部署</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="createTime" header-align="center" align="center" min-width="170">
        <template #default="scope">
          {{ scope.row.processDefinition?.deploymentTime }}
        </template>
      </el-table-column>
      <el-table-column label="版本" prop="version" header-align="center" align="center" min-width="70" >
        <template #default="scope">
          <div v-if="scope.row.processDefinition?.version">
            <el-tag type="primary">v{{ scope.row.processDefinition?.version }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" header-align="center" align="center" min-width="170" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="220">
        <template #default="scope">
          <el-button v-auth="'bpm:model:update'" type="primary" icon="Edit" link @click="handleAddOrEdit(scope.row)">修改</el-button>
          <el-button v-auth="'bpm:model:delete'" type="success" icon="Promotion" link @click="handleDeploy(scope.row)">发布</el-button>
          <el-dropdown
            v-auth="['bpm:model:update']"
            @command="(command: string) => handleCommand(command, scope.row)"
          >
            <el-button type="info" class="btn-more-link" icon="d-arrow-right" text>更多</el-button>
            <template #dropdown>
              <el-dropdown-menu>
<!--                <el-dropdown-item v-if="auth('bpm:model:update')" command="handleAssignRole" icon="CopyDocument"-->
<!--                >复制</el-dropdown-item-->
<!--                >-->
                <el-dropdown-item v-if="auth('bpm:process-definition:page')" command="handleHistoryDefinition" icon="Notebook"
                >历史</el-dropdown-item
                >
<!--                <el-dropdown-item v-if="auth('bpm:model:update')" command="handleReport" icon="Histogram"-->
<!--                >报表</el-dropdown-item-->
<!--                >-->
                <el-dropdown-item v-if="auth('bpm:model:update') && scope.row.processDefinition" command="handleState" icon="SwitchButton"
                >{{ scope.row.processDefinition.suspensionState === 1 ? '启用' : '停用' }}</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="auth('bpm:model:delete')"
                  command="handleDeleteBatch"
                  icon="Delete"
                >删除</el-dropdown-item
                >

              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
    <!-- 弹窗，表单详情 -->
    <el-dialog title="表单详情" v-model="formDetailPreview.visible" width="60%">
      <form-create :rule="formDetailPreview.rule" :option="formDetailPreview.rule" />
    </el-dialog>
    <!-- 弹窗，历史流程 -->
    <el-drawer v-if="historyDefinitionVisible" v-model="historyDefinitionVisible" :title="historyDefinitionTitle" :size="1000">
      <HistoryDefinition :row="historyDefinitionRow" />
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddOrEdit from './form/index.vue'
import modelApi from '@/api/bpm/modelApi'
import * as FormApi from '@/api/bpm/form'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";
import { BpmFormType } from '@/api/bpm/constant'
import { setPreviewConfAndFields } from '@/utils/formCreate'
import FormCreate from '@form-create/element-ui'
import { auth } from '@/utils/tool'
import modal from '@/utils/modal'
import { ElMessage } from 'element-plus'
import HistoryDefinition from '@/views/bpm/model/history-definition.vue'

const state: StateOptions = reactive({
  api: {
    postPageApi: modelApi.postPageApi,
    deleteByIdsApi: modelApi.deleteByIdsApi
  },
  queryForm: {
  },
})

const queryFormRef = ref()
const addOrEditRef = ref()
// 显示搜索条件
const showSearch = ref(true)

// 表单详情预览
const formDetailPreview = ref({
  visible: false,
  rule: [],
  option: {},
})

// 历史流程
const historyDefinitionVisible = ref(false)
const historyDefinitionTitle = ref('')
const historyDefinitionRow = ref()

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
 * 新增/修改 弹窗
 *
 * @param row 当前行数据
 */
const handleAddOrEdit = (row?: any) => {
  addOrEditRef.value.init(row?.id)
}

/**
 * 发布流程
 *
 * @param row 当前行数据
 */
const handleDeploy = (row: any) => {
  modal.confirm(`确定要发布“${row.name}”流程吗？`)
    .then(() => {
      return modelApi.deployModelApi(row.id)
    })
    .then(() => {
      ElMessage.success('发布成功')
    })
    .then(() => {
      getPage()
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
    case 'handleDeleteBatch':
      handleDeleteBatch('id', '编号', row)
      break
    case 'handleHistoryDefinition':
      handleHistoryDefinition(row)
      break
    case 'handleState':
      handleState(row)
      break
    default:
      break
  }
}

/**
 * 表单详情
 *
 * @param row 当前行数据
 */
const handleFormDetail = (row: any) => {
  if (BpmFormType.NORMAL === row.formType) {
    FormApi.getByIdApi(row.formId).then((res) => {
      const form = res.data
      setPreviewConfAndFields(formDetailPreview, form.conf, form.fields)
      // 详情弹窗显示
      formDetailPreview.value.visible = true
    })
  } else if (BpmFormType.CUSTOM === row.formType) {
    window.open(`${row.formCustomCreatePath}`)
  }
}

/**
 * 处理历史流程
 *
 * @param row 当前行数据
 */
const handleHistoryDefinition = (row: any) => {
  historyDefinitionVisible.value = true
  historyDefinitionTitle.value = `历史流程 - 名称“${row.name}”`
  historyDefinitionRow.value = row
}

/**
 * 停用/启用
 *
 * @param row 当前行数据
 */
const handleState = (row: any) => {
  modal
    .confirm(`确定要${row.processDefinition.suspensionState === 1 ? '启用' : '停用'}“${row.name}”流程吗？`)
    .then(() => {
      console.log('patchState')
      return modelApi.patchState(row.id, row.processDefinition.suspensionState === 1 ? 1 : 0)
    })
    .then(() => {
      console.log('操作成功')
      ElMessage.success('操作成功')
    })
    .then(() => {
      console.log('getPage')
      getPage()
    })
}

onMounted(() => {
  getPage()
})
</script>
