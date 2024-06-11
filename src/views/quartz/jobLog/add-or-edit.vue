<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增quartz 定时任务调度日志' : '修改quartz 定时任务调度日志'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="state.dataForm"
      :rules="dataRules"
      label-width="100px"
      class="mr-4"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务ID" prop="jobId">
            <el-input v-model="state.dataForm.jobId" placeholder="请输入任务ID" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务名称" prop="jobName">
            <el-input v-model="state.dataForm.jobName" placeholder="请输入任务名称" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务组名" prop="jobGroup">
            <el-input v-model="state.dataForm.jobGroup" placeholder="请输入任务组名" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Spring Bean 名称" prop="beanName">
            <el-input
              v-model="state.dataForm.beanName"
              placeholder="请输入Spring Bean 名称"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="执行方法" prop="method">
            <el-input v-model="state.dataForm.method" placeholder="请输入执行方法" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参数" prop="params">
            <el-input v-model="state.dataForm.params" placeholder="请输入参数" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="执行状态" prop="executeStatus">
            <el-input
              v-model="state.dataForm.executeStatus"
              placeholder="请输入执行状态"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行时长" prop="duration">
            <el-input v-model="state.dataForm.duration" placeholder="请输入执行时长" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="异常信息" prop="errorInfo">
            <el-input v-model="state.dataForm.errorInfo" placeholder="请输入异常信息" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="state.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { getByIdApi, saveOrUpdateApi } from '@/api/quartz/jobLog'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'

const emit = defineEmits(['refreshPage'])

const state: StateOptions = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
    emit
  },
  dataForm: {
    id: '',
    jobId: '',
    jobName: '',
    jobGroup: '',
    beanName: '',
    method: '',
    params: '',
    executeStatus: '',
    duration: '',
    errorInfo: '',
    createdTime: ''
  }
})

const dataFormRef = ref()

const dataRules = reactive({
  jobName: [{ min: 0, max: 50, message: '任务名称长度不能超过50个字符', trigger: 'blur' }],
  jobGroup: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 50, message: '任务组名长度不能超过50个字符', trigger: 'blur' }
  ],
  beanName: [
    { min: 0, max: 200, message: 'Spring Bean 名称长度不能超过200个字符', trigger: 'blur' }
  ],
  method: [{ min: 0, max: 100, message: '执行方法长度不能超过100个字符', trigger: 'blur' }],
  params: [{ min: 0, max: 500, message: '参数长度不能超过500个字符', trigger: 'blur' }],
  errorInfo: [{ min: 0, max: 2000, message: '异常信息长度不能超过2000个字符', trigger: 'blur' }]
})

const { getData, handleSaveOrUpdate } = crud(state)

/** 初始化详情数据 */
const init = (id?: bigint) => {
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
