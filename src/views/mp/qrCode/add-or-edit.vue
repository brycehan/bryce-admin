<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增微信公众号带参二维码' : '修改微信公众号带参二维码'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="state.dataForm"
      :rules="dataRules"
      label-width="100px"
      class="mr-4"
    >
      <el-form-item label="是否为临时二维码" prop="isTemporary">
        <el-input v-model="state.dataForm.isTemporary" placeholder="请输入是否为临时二维码" />
      </el-form-item>
      <el-form-item label="场景值ID" prop="sceneStr">
        <el-input v-model="state.dataForm.sceneStr" placeholder="请输入场景值ID" />
      </el-form-item>
      <el-form-item label="二维码ticket" prop="ticket">
        <el-input v-model="state.dataForm.ticket" placeholder="请输入二维码ticket" />
      </el-form-item>
      <el-form-item label="二维码图片解析后的地址" prop="url">
        <el-input v-model="state.dataForm.url" placeholder="请输入二维码图片解析后的地址" />
      </el-form-item>
      <el-form-item label="该二维码失效时间" prop="expireTime">
        <el-input v-model="state.dataForm.expireTime" placeholder="请输入该二维码失效时间" />
      </el-form-item>
      <el-form-item label="该二维码创建时间" prop="createTime">
        <el-input v-model="state.dataForm.createTime" placeholder="请输入该二维码创建时间" />
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
import { getByIdApi, saveOrUpdateApi } from '@/api/mp/qrCode'
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
    isTemporary: '',
    sceneStr: '',
    ticket: '',
    url: '',
    expireTime: '',
    createTime: ''
  }
})

const dataFormRef = ref()

const dataRules = reactive({
  sceneStr: [{ min: 0, max: 64, message: '场景值ID长度不能超过64个字符', trigger: 'blur' }],
  ticket: [{ min: 0, max: 255, message: '二维码ticket长度不能超过255个字符', trigger: 'blur' }],
  url: [
    { min: 0, max: 255, message: '二维码图片解析后的地址长度不能超过255个字符', trigger: 'blur' }
  ]
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
