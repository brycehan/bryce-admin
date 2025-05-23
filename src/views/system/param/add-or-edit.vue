<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增参数' : '修改参数'"
    :close-on-click-modal="false"
  >
    <el-form ref="dataFormRef" :model="state.dataForm" :rules="dataRules" label-width="100" class="mr-5">
      <el-form-item label="参数名称" prop="paramName">
        <el-input v-model="state.dataForm.paramName" placeholder="请输入参数名称" />
      </el-form-item>
      <el-form-item label="参数键名" prop="paramKey">
        <el-input v-model="state.dataForm.paramKey" placeholder="请输入参数键" />
      </el-form-item>
      <el-form-item label="参数值" prop="paramValue">
        <el-input v-model="state.dataForm.paramValue" placeholder="请输入参数值" />
      </el-form-item>
      <el-form-item label="系统内置" prop="paramType">
        <dict-radio-group v-model="state.dataForm.paramType" dict-type="sys_param_type" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="state.dataForm.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="state.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getByIdApi, getCheckParamKeyUniqueApi, saveOrUpdateApi } from '@/api/system/param'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import type { FormRules } from 'element-plus'

const emit = defineEmits(['refreshPage'])

const state: StateOptions = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
    emit,
  },
  dataForm: {
    id: '',
    paramName: '',
    paramKey: '',
    paramValue: '',
    paramType: 0,
    remark: '',
  },
})

const dataFormRef = ref()

const { required, remote } = useValidator()

const dataRules = reactive<FormRules>({
  paramName: [required(), { min: 2, max: 100, message: '长度为2~100个字符', trigger: 'blur' }],
  paramKey: [
    required(),
    { min: 2, max: 100, message: '长度为2~100个字符', trigger: 'blur' },
    remote({ api: getCheckParamKeyUniqueApi, message: '参数键名已存在', params: toRef(state.dataForm, 'id') }),
  ],
  paramValue: [required(), { min: 1, max: 65535, message: '长度为1~65535个字符', trigger: 'blur' }],
  remark: [{ min: 0, max: 500, message: '长度不能超过500个字符', trigger: 'blur' }],
})

const { getData, handleSaveOrUpdate } = crud(state)

/**
 * 初始化详情数据
 *
 * @param id 参数ID
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
})
</script>
