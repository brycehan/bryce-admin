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
    <el-form-item label="邮箱">
      <el-input v-model="dataForm.email" placeholder="请输入邮箱" />
    </el-form-item>
    <el-form-item label="性别">
      <dict-radio-group v-model="dataForm.gender" dict-type="sys_gender" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { putUserInfoApi } from '@/api/system/profile'
import { ElMessage, type FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/modules/auth'
import { getCheckPhoneUniqueApi } from '@/api/system/user'
import { phoneRegExp } from '@/utils/tool'

const authStore = useAuthStore()

const dataForm = reactive({
  nickname: authStore.user.nickname,
  phone: authStore.user.phone,
  email: authStore.user.email,
  gender: authStore.user.gender
})

const dataFormRef = ref()

/**
 * 校验手机号码是否唯一
 *
 * @param _rule 校验规则
 * @param value 校验值
 * @param callback 回调
 */
const checkPhoneUnique = (_rule: any, value: any, callback: any) => {
  // 校验手机号码格式
  if (!phoneRegExp.test(value)) {
    callback(new Error('手机号码格式错误'))
    return
  }
  // 后端校验唯一
  getCheckPhoneUniqueApi(value, authStore.user.id).then((res) => {
    if (res.data) {
      callback()
    } else {
      callback(new Error('此手机号码已注册'))
    }
  })
}

const dataRules = reactive<FormRules>({
  nickname: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '长度为2~50个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 7, max: 20, message: '长度为7~20个字符', trigger: 'blur' },
    { validator: checkPhoneUnique, trigger: 'blur' }
  ]
})

/** 表单提交 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    // 修改用户信息
    putUserInfoApi(dataForm).then(() => {
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
