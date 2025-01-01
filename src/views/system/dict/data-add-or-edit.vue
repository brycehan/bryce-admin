<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增字典数据' : '修改字典数据'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="state.dataForm"
      :rules="dataRules"
      label-width="100"
      class="mr-4"
    >
      <el-form-item label="字典标签" prop="dictLabel">
        <el-input v-model="state.dataForm.dictLabel" placeholder="请输入字典标签" />
      </el-form-item>
      <el-form-item label="字典值" prop="dictValue">
        <el-input v-model="state.dataForm.dictValue" placeholder="请输入字典值" />
      </el-form-item>
      <el-form-item label="标签样式" prop="labelClass">
        <el-select v-model="state.dataForm.labelClass" class="w-100" clearable>
          <el-option
            v-for="item in [
              { label: 'primary', value: 'primary' },
              { label: 'success', value: 'success' },
              { label: 'info', value: 'info' },
              { label: 'warning', value: 'warning' },
              { label: 'danger', value: 'danger' }
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <el-tag v-if="item.value === 'primary'" class="w-100" size="small">{{ item.label }}</el-tag>
            <el-tag v-else class="w-100" :type="item.value" size="small">{{ item.label }}</el-tag>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="显示顺序" prop="sort">
        <el-input-number v-model="state.dataForm.sort" :min="0" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-radio-group v-model="state.dataForm.status" dict-type="sys_status" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="state.dataForm.remark" placeholder="请输入内容" />
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
import { getByIdApi, saveOrUpdateApi } from '@/api/system/dictData'
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
    dictLabel: '',
    dictValue: '',
    dictTypeId: '',
    labelClass: '',
    sort: 0,
    status: 1,
    remark: ''
  }
})

const dataFormRef = ref()

const dataRules = reactive<FormRules>({
  dictLabel: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 100, message: '长度为2~100个字符', trigger: 'blur' }
  ],
  dictValue: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 1, max: 100, message: '长度为1~100个字符', trigger: 'blur' }
  ],
  labelClass: [{ min: 0, max: 100, message: '长度不能超过100个字符', trigger: 'blur' }],
  sort: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  remark: [{ min: 0, max: 500, message: '长度不能超过500个字符', trigger: 'blur' }]
})

const { getData, handleSaveOrUpdate } = crud(state)

/**
 * 初始化详情数据
 *
 * @param id 字典数据ID
 */
const init = (id?: string) => {
  state.visible = true
  state.dataForm.id = undefined

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // id 存在则为修改
  if (id) {
    getData(id)
  }
}

/** 表单提交 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    handleSaveOrUpdate()
  })
}

defineExpose({
  init,
  dataForm: state.dataForm
})
</script>
