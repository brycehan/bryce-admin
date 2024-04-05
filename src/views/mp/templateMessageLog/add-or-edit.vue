<template>
  <el-dialog
    v-model="state.visible"
    :title="
      !state.dataForm.id ? '新增微信公众号模版消息发送记录' : '修改微信公众号模版消息发送记录'
    "
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
      <el-form-item label="用户openid" prop="toUser">
        <el-input v-model="state.dataForm.toUser" placeholder="请输入用户openid" />
      </el-form-item>
      <el-form-item label="templateid" prop="templateId">
        <el-input v-model="state.dataForm.templateId" placeholder="请输入templateid" />
      </el-form-item>
      <el-form-item label="消息数据" prop="data">
        <el-input v-model="state.dataForm.data" placeholder="请输入消息数据" />
      </el-form-item>
      <el-form-item label="消息链接" prop="url">
        <el-input v-model="state.dataForm.url" placeholder="请输入消息链接" />
      </el-form-item>
      <el-form-item label="小程序信息" prop="miniProgram">
        <el-input v-model="state.dataForm.miniProgram" placeholder="请输入小程序信息" />
      </el-form-item>
      <el-form-item label="发送时间" prop="sendTime">
        <el-input v-model="state.dataForm.sendTime" placeholder="请输入发送时间" />
      </el-form-item>
      <el-form-item label="发送结果" prop="sendResult">
        <el-input v-model="state.dataForm.sendResult" placeholder="请输入发送结果" />
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
import { getById, saveOrUpdate } from '@/api/mp/templateMessageLog'
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
    toUser: '',
    templateId: '',
    data: '',
    url: '',
    miniProgram: '',
    sendTime: '',
    sendResult: ''
  }
})

const dataFormRef = ref()

const dataRules = reactive({
  toUser: [{ min: 0, max: 50, message: '用户openid长度不能超过50个字符', trigger: 'blur' }],
  templateId: [{ min: 0, max: 50, message: 'templateid长度不能超过50个字符', trigger: 'blur' }],
  url: [{ min: 0, max: 255, message: '消息链接长度不能超过255个字符', trigger: 'blur' }],
  sendResult: [{ min: 0, max: 255, message: '发送结果长度不能超过255个字符', trigger: 'blur' }]
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
