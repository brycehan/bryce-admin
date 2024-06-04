<template>
  <el-form
    ref="dataFormRef"
    :model="dataForm"
    :rules="dataRules"
    label-width="100px"
    @keyup.enter="handleSubmit()"
    class="mr-4"
  >
    <el-form-item label="姓名" prop="nickname">
      <el-input v-model="dataForm.nickname" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phone">
      <el-input v-model="dataForm.phone" placeholder="请输入手机号码" />
    </el-form-item>
    <el-form-item label="邮箱" prop="confirmPassword">
      <el-input v-model="dataForm.email" placeholder="请输入邮箱" />
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <dict-radio-group v-model="dataForm.gender" dict-type="sys_user_gender" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { updateUserInfo } from '@/api/auth/profile'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/modules/auth'

const authStore = useAuthStore()

const dataForm = reactive({
  nickname: authStore.user.nickname,
  phone: authStore.user.phone,
  email: authStore.user.email,
  gender: authStore.user.gender
})

const dataFormRef = ref()

const dataRules = reactive({
  nickname: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 30, message: '姓名长度在2-30个字符', trigger: 'blur' }
  ],
  phone: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

/** 表单提交 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    // 修改用户信息
    updateUserInfo(dataForm).then(() => {
      // 更新状态管理
      authStore.user.nickname = dataForm.nickname
      authStore.user.phone = dataForm.phone
      authStore.user.email = dataForm.email
      authStore.user.gender = dataForm.gender

      ElMessage.success('修改成功')
    })
  })
}
</script>
