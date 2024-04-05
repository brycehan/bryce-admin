<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增微信公众号消息模板' : '修改微信公众号消息模板'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="state.dataForm"
      :rules="dataRules"
      label-width="100px"
      @keyup.enter="handleSubmit()"
      class="mr-4"
    >
      <el-form-item label="公众号模板ID" prop="templateId">
        <el-input v-model="state.dataForm.templateId" placeholder="请输入公众号模板ID" />
      </el-form-item>
      <el-form-item label="模版名称" prop="name">
        <el-input v-model="state.dataForm.name" placeholder="请输入模版名称" />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="state.dataForm.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="模板内容" prop="content">
        <el-input v-model="state.dataForm.content" placeholder="请输入模板内容" />
      </el-form-item>
      <el-form-item label="消息内容" prop="data">
        <el-input v-model="state.dataForm.data" placeholder="请输入消息内容" />
      </el-form-item>
      <el-form-item label="链接" prop="url">
        <el-input v-model="state.dataForm.url" placeholder="请输入链接" />
      </el-form-item>
      <el-form-item label="小程序信息" prop="miniProgram">
        <el-input v-model="state.dataForm.miniProgram" placeholder="请输入小程序信息" />
      </el-form-item>
      <el-form-item label="是否有效" prop="status">
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
import { getById, saveOrUpdate } from '@/api/mp/messageTemplate'
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
    id: '',
    templateId: '',
    name: '',
    title: '',
    content: '',
    data: '',
    url: '',
    miniProgram: '',
    status: true,
    updatedTime: ''
  }
})

const dataFormRef = ref()

const dataRules = reactive({
  templateId: [{ min: 0, max: 100, message: '公众号模板ID长度不能超过100个字符', trigger: 'blur' }],
  name: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 50, message: '模版名称长度不能超过50个字符', trigger: 'blur' }
  ],
  title: [{ min: 0, max: 20, message: '标题长度不能超过20个字符', trigger: 'blur' }],
  content: [{ min: 0, max: 65535, message: '模板内容长度不能超过65535个字符', trigger: 'blur' }],
  url: [{ min: 0, max: 255, message: '链接长度不能超过255个字符', trigger: 'blur' }]
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
