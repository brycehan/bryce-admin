<!-- 执行器选择 -->
<template>
  <el-dialog v-model="dialogVisible" title="请选择监听器" :close-on-click-modal="false" width="1024px">
    <el-card shadow="never">
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="类型" align="center" prop="type">
          <template #default="scope">
            <dict-tag dict-type="bpm_process_listener_type" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column label="事件" align="center" prop="event" />
        <el-table-column label="值类型" align="center" prop="valueType">
          <template #default="scope">
            <dict-tag dict-type="bpm_process_listener_value_type" :value="scope.row.valueType" />
          </template>
        </el-table-column>
        <el-table-column label="值" align="center" prop="value" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="select(scope.row)"> 选择 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination :current-page="queryParams.pageNo" :page-size="queryParams.pageSize" :total="total" />
      <!--        :page-sizes="state.pageSizes"-->
      <!--        :layout="state.layout"-->
      <!--        @size-change="handleSizeChange"-->
      <!--        @current-change="handleCurrentChange"-->
      />
    </el-card>
  </el-dialog>
</template>
<script setup lang="ts">
import ProcessListenerApi from '@/api/bpm/processListener'
import { StatusEnum } from '@/enums/system'
import { BpmTypeEnum } from '@/api/bpm/constant'
import type { BpmProcessListenerDto } from '@/types/modules/bpm'

/** BPM 流程 表单 */
defineOptions({ name: 'ProcessListenerDialog' })

const dialogVisible = ref(false) // 弹窗的是否展示
const loading = ref(true) // 列表的加载中
const list = ref<BpmProcessListenerDto[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  type: '',
  status: StatusEnum.ENABLE,
})

/** 打开弹窗 */
const open = async (type: string) => {
  queryParams.pageNo = 1
  queryParams.type = type
  await getList()
  dialogVisible.value = true
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data: any = await ProcessListenerApi.postPageApi(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/**
 * 提交表单
 */
const emit = defineEmits(['select'])
const select = async (row: any) => {
  dialogVisible.value = false
  // 发送操作成功的事件
  emit('select', row)
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
