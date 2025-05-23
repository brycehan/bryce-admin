<template>
  <el-form
    ref="dataFormRef"
    :model="dataForm"
    :rules="dataRules"
    label-width="120"
    class="mr-4"
    @keyup.enter="handleSubmit()"
  >
    <el-form-item :label="t('profile.basic.data.nickname')" prop="nickname">
      <el-input v-model="dataForm.nickname" :placeholder="t('profile.basic.data.nicknamePlaceholder')" />
    </el-form-item>
    <el-form-item :label="t('profile.basic.data.phone')" prop="phone">
      <el-input v-model="dataForm.phone" :placeholder="t('profile.basic.data.phonePlaceholder')" />
    </el-form-item>
    <el-form-item :label="t('profile.basic.data.email')" prop="email">
      <el-input v-model="dataForm.email" :placeholder="t('profile.basic.data.emailPlaceholder')" />
    </el-form-item>
    <el-form-item :label="t('profile.basic.data.gender')">
      <dict-radio-group v-model="dataForm.gender" dict-type="sys_gender" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit()">{{ t('button.confirm') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { putUserInfoApi } from '@/api/system/profile'
import { ElMessage, type FormRules } from 'element-plus'
import { getCheckPhoneUniqueApi } from '@/api/system/user'
import { phoneRegExp } from '@/utils/tool'

const authStore = useAuthStore()
const { t } = useI18n()

const dataForm = reactive({
  nickname: authStore.user.nickname,
  phone: authStore.user.phone,
  email: authStore.user.email,
  gender: authStore.user.gender,
})

const dataFormRef = ref()

const { required, remote } = useValidator()

const dataRules = reactive<FormRules>({
  nickname: [required(), { min: 2, max: 50, message: () => t('rules.length', { min: 2, max: 50 }), trigger: 'blur' }],
  phone: [
    required(),
    { min: 7, max: 20, message: () => t('rules.length', { min: 7, max: 20 }), trigger: 'blur' },
    { pattern: phoneRegExp, message: t('profile.basic.data.phoneIncorrect'), trigger: 'blur' },
    remote({
      api: getCheckPhoneUniqueApi,
      message: t('profile.basic.data.phoneRegistered'),
      params: authStore.user.id,
    }),
  ],
  email: [{ type: 'email', message: () => t('rules.email'), trigger: 'blur' }],
})

/**
 * 表单提交
 */
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

      ElMessage.success(t('message.successUpdate'))
    })
  })
}
</script>
