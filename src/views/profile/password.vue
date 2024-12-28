<template>
  <el-form
    ref="dataFormRef"
    :model="dataForm"
    :rules="dataRules"
    label-width="140px"
    @keyup.enter="handleSubmit()"
    class="mr-4"
  >
    <el-form-item :label="$t('profile.basic.password.password')" prop="password">
      <el-input v-model="dataForm.password" show-password :placeholder="t('profile.basic.password.passwordPlaceholder')" />
    </el-form-item>
    <el-form-item :label="$t('profile.basic.password.newPassword')" prop="newPassword">
      <el-input v-model="dataForm.newPassword" show-password :placeholder="t('profile.basic.password.newPasswordPlaceholder')" />
    </el-form-item>
    <el-form-item :label="$t('profile.basic.password.confirmPassword')" prop="confirmPassword">
      <el-input v-model="dataForm.confirmPassword" show-password :placeholder="t('profile.basic.password.confirmPasswordPlaceholder')" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit()">{{ t('button.confirm') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { putPasswordApi } from '@/api/system/profile'
import { ElMessage, type FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'

const dataForm = reactive({
  password: '',
  newPassword: '',
  confirmPassword: ''
})

const dataFormRef = ref()
const { t } = useI18n()

/**
 * 密码确认校验
 *
 * @param _rule 校验规则
 * @param value 校验值
 * @param callback 回调
 */
const equalToPassword = (_rule: any, value: any, callback: any) => {
  if (dataForm.newPassword !== value) {
    callback(new Error(t('rules.equalToPassword')))
  } else {
    callback()
  }
}

const dataRules = reactive<FormRules>({
  password: [{ required: true, message: () => t('rules.required'), trigger: 'blur' }],
  newPassword: [
    { required: true, message: () => t('rules.required'), trigger: 'blur' },
    { min: 6, max: 20, message: () => t('rules.length', { min: 6, max: 20}), trigger: 'blur' },
    { pattern: /^[^\s\u4e00-\u9fa5]*$/, message: () => t('rules.nonSpaceAndChinese'), trigger: 'change'},
  ],
  confirmPassword: [
    { required: true, message: () => t('rules.required'), trigger: 'blur' },
    { required: true, validator: equalToPassword, trigger: 'blur' }
  ]
})

/**
 * 表单提交
 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    // 修改密码
    putPasswordApi(dataForm).then(() => {
      ElMessage.success(t('message.successUpdate'))
    })
  })
}
</script>
