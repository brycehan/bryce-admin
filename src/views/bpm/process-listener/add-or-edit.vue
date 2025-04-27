<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增流程监听器' : '修改流程监听器'"
    :close-on-click-modal="false"
  >
    <el-form ref="dataFormRef" :model="state.dataForm" :rules="dataRules" label-width="100" class="mr-4">
      <el-form-item label="名称" prop="name">
        <el-input v-model="state.dataForm.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="监听类型" prop="type">
        <dict-select
          v-model="state.dataForm.type"
          dict-type="bpm_process_listener_type"
          placeholder="请选择监听类型"
          clearable
        />
      </el-form-item>
      <el-form-item label="监听事件" prop="event">
        <el-select v-model="state.dataForm.event" placeholder="请选择事件">
          <el-option
            v-for="event in state.dataForm.type == 'execution'
              ? ['start', 'end']
              : ['create', 'assignment', 'complete', 'delete', 'update', 'timeout']"
            :label="event"
            :value="event"
            :key="event"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="值类型" prop="valueType">
        <dict-select
          v-model="state.dataForm.valueType"
          dict-type="bpm_process_listener_value_type"
          placeholder="请选择监听类型"
          clearable
        />
      </el-form-item>
      <el-form-item prop="value" v-if="state.dataForm.valueType == 'class'">
        <template #label>
          <el-tooltip
            effect="dark"
            content="例如：com.brycehan.boot.bpm.common.listener.BpmTriggerTaskDelegate"
            placement="top"
          >
            <icon icon="ep:question-filled" />
          </el-tooltip>
          <span>类路径</span>
        </template>
        <el-input v-model="state.dataForm.value" placeholder="请输入类路径" />
      </el-form-item>
      <el-form-item prop="value" v-else>
        <template #label>
          <el-tooltip effect="dark" content="例如：${ days > 3 }" placement="top">
            <icon icon="ep:question-filled" />
          </el-tooltip>
          <span>表达式</span>
        </template>
        <el-input v-model="state.dataForm.value" placeholder="请输入表达式" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-radio-group v-model="state.dataForm.status" dict-type="sys_status" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="state.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getByIdApi, saveOrUpdateApi } from '@/api/bpm/processListener'
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
    name: '',
    status: 1,
    type: '',
    event: '',
    valueType: '',
    value: '',
  },
})

const dataFormRef = ref()

const dataRules = reactive<FormRules>({
  name: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 255, message: '长度为2~255个字符', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 255, message: '长度不能超过255个字符', trigger: 'blur' },
  ],
  event: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 255, message: '长度不能超过255个字符', trigger: 'blur' },
  ],
  valueType: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 255, message: '长度不能超过255个字符', trigger: 'blur' },
  ],
  value: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 255, message: '长度不能超过255个字符', trigger: 'blur' },
  ],
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
  init,
})
</script>
