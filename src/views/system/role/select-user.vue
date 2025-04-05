<template>
  <div class="select-role">
    <el-button type="primary" plain icon="Plus" @click="handleInit()">新增</el-button>
    <el-dialog
      v-if="state.visible"
      v-model="state.visible"
      title="选择用户"
      :close-on-click-modal="false"
      :width="900"
      draggable
    >
      <el-table
        v-loading="state.loading as boolean"
        :data="state.data"
        :border="true"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" header-align="center" align="center" width="50" />
        <el-table-column label="账号" prop="username" header-align="center" align="center" />
        <el-table-column label="姓名" prop="nickname" header-align="center" align="center" />
        <el-table-column label="手机号码" prop="phone" header-align="center" align="center" />
        <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" />
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
      <template #footer>
        <el-button @click="state.visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit()">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { postAssignUserPageApi as postPageApi } from '@/api/system/role'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ElMessage } from 'element-plus'

const props = defineProps({
  row: {
    type: Object,
    required: true
  },
})

const emit = defineEmits(['select'])

const state: StateOptions = reactive({
  api: {
    postPageApi
  },
  queryForm: {
    roleId: props.row.id,
    assigned: 'N',
    status: 1
  }
})

/**
 * 初始化选择角色弹窗
 */
const handleInit = () => {
  state.visible = true
  getPage()
}

const { getPage, handleSizeChange, handleCurrentChange, handleSelectionChange } = crud(state)

/**
 * 表单提交
 */
const handleSubmit = () => {
  const dataSelected = state.dataSelections ? state.dataSelections : []
  if (dataSelected.length === 0) {
    ElMessage.warning('请选择角色记录')
    return
  }

  emit('select', dataSelected.map(item => item.id))

  state.dataSelections = []
  state.visible = false
}
</script>

<style scoped lang="scss">
.select-role {
  display: flex;
}
</style>
