<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增流程表达式' : '修改流程表达式'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="state.dataForm"
      :rules="dataRules"
      label-width="100"
      class="mr-4"
    >

      <el-form-item label="名称" prop="name">
        <el-input v-model="state.dataForm.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="表达式" prop="expression">
        <el-input v-model="state.dataForm.expression" placeholder="请输入表达式" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-radio-group v-model="state.dataForm.status" dict-type="sys_status" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="state.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { getByIdApi, saveOrUpdateApi } from '@/api/bpm/processExpression'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import type { FormRules } from 'element-plus'

const emit = defineEmits(['refreshPage'])

const state: StateOptions = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
    emit
  },
  dataForm: {
    id: '',
    name: '',
    status: 1,
    expression: ''
  }
})

const dataFormRef = ref()

const dataRules = reactive<FormRules>({
  name: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 64, message: '长度为2~64个字符', trigger: 'blur' }
  ],
  expression: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 5000, message: '长度不能超过5000个字符', trigger: 'blur' }
  ]
})

const { getData, handleSaveOrUpdate } = crud(state)

/**
 * 初始化详情数据
 *
 * @param id 主键ID
 */
const init = (id?: string) => {
  state.visible = true
  state.dataForm.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // id 存在则为修改
  if (id) {
    getData(id)
  }
}

/**
 * 表单提交
 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    handleSaveOrUpdate()
  })
}

defineExpose({
  init
})
</script>
