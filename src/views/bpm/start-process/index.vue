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
            <div
              class="flex w-1/3 items-center justify-items-stretch gap-2 pt-2"
              v-for="item in process"
              :key="item.id"
            >
              <el-avatar shape="circle" :size="30" :src="item.icon || emptyImg" />
              <el-tooltip effect="dark" content="流程图预览" placement="top">
                <icon
                  icon="ion:ios-git-network"
                  class="cursor-pointer text-sky-700"
                  size="16"
                  @click="handleBpmnDetail(item)"
                />
              </el-tooltip>
              <span class="cursor-pointer" style="color: #1890ff" @click="handleAddOrEdit(item)">
                {{ item.name }}
              </span>
            </div>
          </el-row>
        </div>
        <div v-else>
          <el-empty description="暂无数据" />
        </div>

        <!-- 弹窗，流程图 -->
        <el-dialog title="流程图" v-model="bpmnDetailPreview.visible" width="60%">
          <my-process-viewer style="height: 600px" key="designer" :xml="bpmnDetailPreview.bpmnXml" />
        </el-dialog>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import CategoryTree from '@/views/bpm/start-process/category-tree.vue'
import processDefinitionApi from '@/api/bpm/processDefinition.ts'
import emptyImg from '@/assets/images/empty.png'
import _ from 'lodash'
import { MyProcessViewer } from '@/components/bpmn-process-designer/package'
import { SysShowHide } from '@/enums/system.ts'

const router = useRouter()
const queryForm = ref({
  categoryId: '',
})
const processCategoryList = ref<any>()
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
  processDefinitionApi
    .postListApi({
      category: queryForm.value.categoryId,
      visible: SysShowHide.SHOW,
    })
    .then((response) => {
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
 * 流程申请弹窗
 */
const handleAddOrEdit = async (row: any) => {
  await router.push({ name: 'BpmStartProcessApply', params: { id: row.id } })
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
  getProcessDefinitionList()
})

onMounted(() => {
  getProcessDefinitionList()
})
</script>
