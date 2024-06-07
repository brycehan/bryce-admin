<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增微信公众号消息' : '修改微信公众号消息'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="state.dataForm"
      :rules="dataRules"
      label-width="100px"
      class="mr-4"
    >
      <el-form-item label="openid" prop="openId">
        <el-input v-model="state.dataForm.openId" placeholder="请输入openid" />
      </el-form-item>
      <el-form-item label="消息方向" prop="inOut">
        <el-input v-model="state.dataForm.inOut" placeholder="请输入消息方向" />
      </el-form-item>
      <el-form-item label="消息类型" prop="messageType">
        <el-input v-model="state.dataForm.messageType" placeholder="请输入消息类型" />
      </el-form-item>
      <el-form-item label="消息内容" prop="content">
        <el-input v-model="state.dataForm.content" placeholder="请输入消息内容" />
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
import { getById, saveOrUpdate } from '@/api/mp/message'
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
    openId: '',
    inOut: '',
    messageType: '',
    content: '',
    createdTime: '',
    updatedTime: ''
  }
})

const dataFormRef = ref()

const dataRules = reactive({
  openId: [{ min: 0, max: 50, message: 'openid长度不能超过50个字符', trigger: 'blur' }],
  messageType: [{ min: 0, max: 25, message: '消息类型长度不能超过25个字符', trigger: 'blur' }]
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
