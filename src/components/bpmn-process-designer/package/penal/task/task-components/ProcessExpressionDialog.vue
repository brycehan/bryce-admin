<!-- 表达式选择 -->
<template>
  <el-dialog
    v-model="dialogVisible"
    title="请选择表达式"
    :close-on-click-modal="false"
    width="60%"
  >
      <el-table
        v-loading="state.loading"
        :data="state.data"
        :border="true"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        show-overflow-tooltip
      >
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="表达式" align="center" prop="expression" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="select(scope.row)"> 选择 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
<!--      <pagination-->
<!--        :total="total"-->
<!--        v-model:page="queryParams.pageNo"-->
<!--        v-model:limit="queryParams.pageSize"-->
<!--        @pagination="getList"-->
<!--      />-->
      <el-pagination
        :current-page="state.current"
        :page-size="state.size"
        :total="state.total"
        :page-sizes="state.pageSizes"
        :layout="state.layout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
  </el-dialog>
</template>
<script setup lang="ts">
import ProcessExpressionApi from '@/api/bpm/processExpression'
import { reactive, ref } from 'vue'
import { crud, type StateOptions } from '@/utils/state.ts'

defineOptions({ name: 'ProcessExpressionDialog' })

const emit = defineEmits(['select'])

const state : StateOptions = reactive({
  api: {
    postPageApi: ProcessExpressionApi.postPageApi,
  },
  queryForm: {
  }
})
const dialogVisible = ref(false) // 弹窗的是否展示

/**
 * 打开弹窗
 */
const open = () => {
  getPage()
  dialogVisible.value = true
}

const { getPage, handleSizeChange, handleCurrentChange, handleSelectionChange, handleSortChange } = crud(state)

/**
 * 选择
 *
 * @param row 表单数据
 */
const select = async (row: any) => {
  dialogVisible.value = false
  // 发送操作成功的事件
  emit('select', row)
}

defineExpose({ open })
</script>
