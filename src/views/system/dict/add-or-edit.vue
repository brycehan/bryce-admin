<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增字典类型' : '修改字典类型'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="state.dataForm"
      :rules="dataRules"
      label-width="100"
      class="mr-4"
    >
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="state.dataForm.dictName" placeholder="请输入字典名称" />
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input v-model="state.dataForm.dictType" placeholder="请输入字典类型" />
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
import { getByIdApi, getCheckDictTypeCodeUniqueApi, saveOrUpdateApi } from '@/api/system/dictType'
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
    dictName: '',
    dictType: '',
    sort: 0,
    status: 1,
    remark: ''
  }
})

const dataFormRef = ref()

/**
 * 字典类型编码是否唯一
 *
 * @param rule 校验规则
 * @param value 校验值
 * @param callback 回调
 */
const checkDictTypeCodeUnique = (rule: any, value: any, callback: any) => {
  getCheckDictTypeCodeUniqueApi(value, state.dataForm.id).then((res) => {
    if (res.data) {
      callback()
    } else {
      callback(new Error('字典类型已存在'))
    }
  })
}

const dataRules = reactive<FormRules>({
  dictName: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  dictType: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 100, message: '长度为2~100个字符', trigger: 'blur' },
    { validator: checkDictTypeCodeUnique, trigger: 'blur' }
  ],
  sort: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  remark: [{ min: 0, max: 500, message: '长度不能超过500个字符', trigger: 'blur' }]
})

const { getData, handleSaveOrUpdate } = crud(state)

/**
 * 初始化详情数据
 *
 * @param id 字典类型id
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
  init
})
</script>
