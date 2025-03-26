<template>
  <el-table
    v-loading="state.loading"
    :data="state.data"
    :border="true"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" header-align="center" align="center" width="50" />
    <el-table-column label="流程名称" prop="name" header-align="center" align="center" min-width="120">
      <template #default="scope">
        <el-button type="primary" link @click="handleBpmnDetail(scope.row)">{{ scope.row.name }}</el-button>
      </template>
    </el-table-column>
    <el-table-column label="流程KEY" prop="key" header-align="center" align="center" min-width="100"/>
    <el-table-column label="流程分类" prop="category" header-align="center" align="center" min-width="120"/>
    <el-table-column label="定义描述" prop="description" header-align="center" align="center" show-overflow-tooltip min-width="200"/>
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
    <el-table-column label="流程版本" prop="version" header-align="center" align="center" min-width="90">
      <template #default="scope">
        <el-tag type="primary">v{{ scope.row.version }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="状态" prop="suspensionState" header-align="center" align="center" min-width="90">
      <template #default="scope">
        <el-tag type="success" v-if="scope.row.suspensionState === 1">激活</el-tag>
        <el-tag type="warning" v-else>挂起</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="部署时间" prop="deploymentTime" header-align="center" align="center" min-width="170"/>
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

  <!-- 弹窗，流程图 -->
  <el-dialog title="流程图" v-model="bpmnDetailPreview.visible" width="60%">
    <my-process-viewer style="height: 600px" key="designer" :xml="bpmnDetailPreview.bpmnXml" />
  </el-dialog>
  <!-- 弹窗，表单详情 -->
  <el-dialog title="表单详情" v-model="formDetailPreview.visible" width="60%">
    <form-create :rule="formDetailPreview.rule" :option="formDetailPreview.rule" />
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import processDefinitionApi from '@/api/bpm/processDefinition.ts'
import * as FormApi from '@/api/bpm/form'
import { crud, type StateOptions } from '@/utils/state'
import { MyProcessViewer } from '@/components/bpmn-process-designer/package'
import FormCreate from '@form-create/element-ui'
import { BpmFormType } from '@/api/bpm/constant'
import { setPreviewConfAndFields } from '@/utils/formCreate'

const props = defineProps({
  row: {
    type: Object,
    required: true
  }
})

const state: StateOptions = reactive({
  api: {
    postPageApi: processDefinitionApi.postPageApi
  },
  queryForm: {
    key: props.row.key,
    status: 1
  }
})

// 流程图预览
const bpmnDetailPreview = ref({
  visible: false,
  bpmnXml: '',
})

// 表单详情预览
const formDetailPreview = ref({
  visible: false,
  rule: [],
  option: {},
})

const { getPage, handleSizeChange, handleCurrentChange, handleSelectionChange } = crud(state)

/**
 * 流程图预览详情
 *
 * @param row 当前行数据
 */
const handleBpmnDetail = (row: any) => {
    // 详情弹窗显示
    bpmnDetailPreview.value.visible = true
    // 获取流程图
    bpmnDetailPreview.value.bpmnXml = ''
    processDefinitionApi.getById(row.id).then((res) => {
      bpmnDetailPreview.value.bpmnXml = res.data.bpmnXml
    })
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

onMounted(() => {
  getPage()
})
</script>
