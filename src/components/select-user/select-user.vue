<template>
  <div class="select-user">
    <el-button :type="props.type" :icon="props.icon" @click="state.visible = true">新增</el-button>
    <el-dialog
      v-model="state.visible"
      title="选择用户"
      :close-on-click-modal="false"
      :width="900"
      draggable
    >
      <el-form
        ref="queryFormRef"
        :model="state.queryForm"
        :inline="true"
        @keyup.enter="getPage()"
        @submit.prevent
      >
        <el-form-item label="账号" label-width="50" prop="username">
          <el-input v-model="state.queryForm.username" placeholder="账号" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="state.queryForm.phone" placeholder="手机号码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
          <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="state.loading"
        :data="state.data"
        :border="true"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" header-align="center" align="center" width="50" />
        <el-table-column label="账号" prop="username" header-align="center" align="center" />
        <el-table-column label="姓名" prop="nickname" header-align="center" align="center" />
        <el-table-column label="手机号码" prop="phone" header-align="center" align="center" />
        <el-table-column label="部门" prop="deptName" header-align="center" align="center" />
        <dict-table-column label="状态" prop="status" dict-type="sys_status" />
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
import { onMounted, reactive, ref } from 'vue'
import { postPageApi } from '@/api/system/user'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ElMessage } from 'element-plus'

const props = defineProps({
  type: {
    type: String,
    default: () => ''
  },
  icon: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['select'])

const state: StateOptions = reactive({
  api: {
    postPageApi
  },
  queryForm: {
    username: '',
    gender: '',
    phone: ''
  }
})

const queryFormRef = ref()

onMounted(() => {
  getPage()
})

const { getPage, handleSizeChange, handleCurrentChange, handleSelectionChange } = crud(state)

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

/** 表单提交 */
const handleSubmit = () => {
  const dataSelected = state.dataSelections ? state.dataSelections : []
  if (dataSelected.length === 0) {
    ElMessage.warning('请选择用户记录')
    return
  }

  state.visible = false

  emit('select', dataSelected)
}
</script>

<style scoped lang="scss">
.select-user {
  display: flex;
}
</style>
