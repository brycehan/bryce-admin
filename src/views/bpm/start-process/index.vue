<template>
  <el-row :gutter="10">
    <!-- 部门数据 -->
    <el-col :span="4" :xs="24">
      <el-card shadow="never">
        <category-tree @node-click="handleCategoryClick" />
      </el-card>
    </el-col>
    <!-- 用户数据 -->
    <el-col :span="20" :xs="24">
      <el-card shadow="never">
        <div v-if="processDefinitionVisible">
          <el-row v-for="(process, key) in processCategoryList" :key="key">
            <el-divider content-position="left">{{ key }}</el-divider>
            <div class="w-1/3 flex items-center justify-items-stretch gap-2 pt-2" v-for="item in process" :key="item.id">
              <el-avatar shape="circle" :size="30" :src="item.icon || emptyImg"/>
              <el-tooltip effect="dark" content="流程图预览" placement="top">
                <icon icon="ion:ios-git-network" class="text-sky-700 cursor-pointer" size="16" @click="handleBpmnDetail(item)" />
              </el-tooltip>
              <span class="cursor-pointer" style="color: #1890ff" @click="handleAddOrEdit(item)"> {{ item.name }} </span>
            </div>
          </el-row>
        </div>
        <div v-else>
          <el-empty description="暂无数据" />
        </div>

        <!-- 弹窗，新增 / 修改 -->
        <AddOrEdit ref="addOrEditRef" v-if="selectProcessDefinition" :process-definition="selectProcessDefinition"/>
        <!-- 弹窗，流程图 -->
        <el-dialog title="流程图" v-model="bpmnDetailPreview.visible" width="60%">
          <my-process-viewer style="height: 600px" key="designer" :xml="bpmnDetailPreview.bpmnXml" />
        </el-dialog>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import AddOrEdit from './add-or-edit.vue'
import CategoryTree from '@/views/bpm/start-process/category-tree.vue'
import processDefinitionApi from '@/api/bpm/processDefinition.ts'
import emptyImg from '@/assets/images/empty.png'
import _ from 'lodash'
import { MyProcessViewer } from '@/components/bpmn-process-designer/package'
import { SysShowHide } from '@/enums/system.ts'

const addOrEditRef = ref()
const queryForm = ref({
  categoryId: '',
})
const processCategoryList = ref<any>()
// 选择的流程定义
const selectProcessDefinition = ref()
// 流程图预览
const bpmnDetailPreview = ref({
  visible: false,
  bpmnXml: '',
})

const handleCategoryClick = (categoryId: any) => {
  queryForm.value.categoryId = categoryId
}


/**
 * 获取分类列表
 */
const getProcessDefinitionList = () => {
  processDefinitionApi.postListApi({ category: queryForm.value.categoryId, visible: SysShowHide.SHOW }).then((response) => {
    processCategoryList.value = _.groupBy(response.data || [], 'category')
    console.log(_.groupBy(response.data || [], 'category'))
  })
}

/**
 * 分类数据是否显示
 */
const processDefinitionVisible = computed(() => {
  return !_.isEmpty(processCategoryList.value)
})

/**
 * 新增/修改 弹窗
 */
const handleAddOrEdit = async (row: any) => {
  selectProcessDefinition.value = row
  // 初始化流程定义详情
  await nextTick()
  addOrEditRef.value?.init(row)
}

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

watch(queryForm.value, () => {
  getProcessDefinitionList();
})

onMounted(() => {
  getProcessDefinitionList();
})
</script>
