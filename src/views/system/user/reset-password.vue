<template>
  <el-dialog
    v-model="visible"
    title="系统提示"
    :close-on-click-modal="false"
    width="600"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRules"
      label-width="100px"
      label-position="top"
    >
      <el-form-item :label="`请输入“${username}”的新密码`" prop="password">
        <el-input v-model="dataForm.password" show-password placeholder="请输入新密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { resetPasswordApi } from '@/api/system/user'
import { ElMessage } from 'element-plus'

const visible = ref(false)
const dataForm = reactive({
  id: '',
  password: '',
})
const username = ref('')

const dataFormRef = ref()

const dataRules = reactive({
  password: [
    { required: true, message: '不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度为6~20个字符', trigger: 'blur' },
    { pattern: /^[^\s\u4e00-\u9fa5]*$/, message: '不允许有空格、中文', trigger: 'change'},
  ],
})

/**
 * 初始化数据
 *
 * @param row 表格的当前行数据
 */
const init = (row: any) => {
  username.value = row.username
  dataForm.password = ''
  visible.value = true
  dataForm.id = row.id
}

/**
 * 表单提交
 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    resetPasswordApi(dataForm).then(() => {
      visible.value = false
      ElMessage.success('重置密码成功')
    })
  })
}

defineExpose({
  init
})
</script>
