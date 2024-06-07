<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增定时任务' : '修改定时任务'"
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
          <el-form-item label="任务名称" prop="jobName">
            <el-input v-model="state.dataForm.jobName" placeholder="请输入任务名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务组名" prop="jobGroup">
            <dict-select
              v-model="state.dataForm.jobGroup"
              dict-type="quartz_job_group"
              placeholder="请选择任务组名"
              class="w-100"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Bean 名称" prop="beanName">
            <el-input
              v-model="state.dataForm.beanName"
              placeholder="请输入Spring Bean 名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行方法" prop="method">
            <el-input v-model="state.dataForm.method" placeholder="请输入执行方法" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="方法参数" prop="params">
            <el-input v-model="state.dataForm.params" placeholder="请输入方法参数" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="cron 表达式" prop="cronExpression">
            <el-input
              v-model="state.dataForm.cronExpression"
              placeholder="请输入cron 表达式"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否并发执行" prop="concurrent">
            <el-radio-group v-model="state.dataForm.concurrent">
              <el-radio-button label="Y">是</el-radio-button>
              <el-radio-button label="N">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <dict-radio-group v-model="state.dataForm.status" dict-type="quartz_job_status" />
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
import { getById, saveOrUpdate } from '@/api/quartz/job'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'

const emit = defineEmits(['refreshPage'])

const state: StateOptions = reactive({
  api: {
    saveOrUpdate,
    getById,
    emit
  },
  dataForm: {
    id: undefined,
    jobName: '',
    jobGroup: '',
    beanName: '',
    method: '',
    params: '',
    cronExpression: '',
    concurrent: 'N',
    sort: '',
    status: true,
    remark: ''
  }
})

const dataFormRef = ref()

const dataRules = reactive({
  jobName: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 50, message: '任务名称长度不能超过50个字符', trigger: 'blur' }
  ],
  jobGroup: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 50, message: '任务组名长度不能超过50个字符', trigger: 'blur' }
  ],
  beanName: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 200, message: 'Spring Bean 名称长度不能超过200个字符', trigger: 'blur' }
  ],
  method: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 100, message: '执行方法长度不能超过100个字符', trigger: 'blur' }
  ],
  params: [{ min: 0, max: 2000, message: '参数长度不能超过2000个字符', trigger: 'blur' }],
  cronExpression: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 255, message: 'cron 表达式长度不能超过255个字符', trigger: 'blur' }
  ],
  sort: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  remark: [{ min: 0, max: 500, message: '备注长度不能超过500个字符', trigger: 'blur' }]
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
