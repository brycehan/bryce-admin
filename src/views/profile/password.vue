<template>
  <el-form
    ref="dataFormRef"
    :model="dataForm"
    :rules="dataRules"
    label-width="100px"
    @keyup.enter="handleSubmit()"
    class="mr-4"
  >
    <el-form-item label="原密码" prop="password">
      <el-input v-model="dataForm.password" show-password placeholder="请输入原密码" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="dataForm.newPassword" show-password placeholder="请输入新密码" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="dataForm.confirmPassword" show-password placeholder="请确认新密码" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { updatePassword } from '@/api/auth/profile'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { closeTab } from '@/utils/tabs'

const dataForm = reactive({
  password: '',
  newPassword: '',
  confirmPassword: ''
})

const router = useRouter()
const route = useRoute()
const dataFormRef = ref()

/**
 * 密码确认校验
 *
 * @param rule 校验规则
 * @param value 校验值
 * @param callback 回调
 */
const equalToPassword = (rule: any, value: any, callback: any) => {
  if (dataForm.newPassword !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const dataRules = reactive({
  password: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 6, max: 30, message: '密码长度在6-30个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { required: true, validator: equalToPassword, trigger: 'blur' }
  ]
})

/** 表单提交 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    // 修改密码
    updatePassword(dataForm).then(() => {
      ElMessage.success('修改成功')
      // 关闭当前Tab
      closeTab(router, route)
    })
  })
}
</script>
