<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增微信公众号消息回复规则' : '修改微信公众号消息回复规则'"
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
      <el-form-item label="名称" prop="name">
        <el-input v-model="state.dataForm.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="匹配的关键词、事件等" prop="matchValue">
        <el-input v-model="state.dataForm.matchValue" placeholder="请输入匹配的关键词、事件等" />
      </el-form-item>
      <el-form-item label="是否精确匹配" prop="exactMatch">
        <el-input v-model="state.dataForm.exactMatch" placeholder="请输入是否精确匹配" />
      </el-form-item>
      <el-form-item label="回复消息类型" prop="replyType">
        <el-input v-model="state.dataForm.replyType" placeholder="请输入回复消息类型" />
      </el-form-item>
      <el-form-item label="回复消息内容" prop="replyContent">
        <el-input v-model="state.dataForm.replyContent" placeholder="请输入回复消息内容" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-radio-group v-model="state.dataForm.status" dict-type="sys_status" />
      </el-form-item>
      <el-form-item label="生效起始时间" prop="effectTimeStart">
        <el-input v-model="state.dataForm.effectTimeStart" placeholder="请输入生效起始时间" />
      </el-form-item>
      <el-form-item label="生效结束时间" prop="effectTimeEnd">
        <el-input v-model="state.dataForm.effectTimeEnd" placeholder="请输入生效结束时间" />
      </el-form-item>
      <el-form-item label="规则优先级" prop="priority">
        <el-input v-model="state.dataForm.priority" placeholder="请输入规则优先级" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="state.dataForm.remark" placeholder="请输入备注" />
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
import { getById, saveOrUpdate } from '@/api/mp/messageReplyRule'
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
    name: '',
    matchValue: '',
    exactMatch: '',
    replyType: '',
    replyContent: '',
    status: true,
    effectTimeStart: '',
    effectTimeEnd: '',
    priority: '',
    remark: ''
  }
})

const dataFormRef = ref()

const dataRules = reactive({
  name: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 50, message: '名称长度不能超过50个字符', trigger: 'blur' }
  ],
  matchValue: [
    { min: 0, max: 200, message: '匹配的关键词、事件等长度不能超过200个字符', trigger: 'blur' }
  ],
  replyType: [{ min: 0, max: 20, message: '回复消息类型长度不能超过20个字符', trigger: 'blur' }],
  replyContent: [
    { min: 0, max: 1000, message: '回复消息内容长度不能超过1000个字符', trigger: 'blur' }
  ],
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
