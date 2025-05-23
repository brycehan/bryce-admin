<template>
  <el-form ref="loginFormRef" :model="loginDto" :rules="loginRules" @keyup.enter="loginByAccount">
    <el-form-item prop="username">
      <el-input v-model="loginDto.username" :prefix-icon="User" placeholder="请输入账号" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginDto.password" :prefix-icon="Lock" placeholder="请输入密码" show-password />
    </el-form-item>
    <el-form-item v-if="captchaEnabled" prop="code" class="login-captcha">
      <el-input v-model="loginDto.code" placeholder="请输入验证码" :prefix-icon="Key" />
      <img v-show="captchaBase64" :src="captchaBase64" alt="验证码" @click="handleCaptcha" />
    </el-form-item>
    <el-form-item prop="rememberMe" style="margin-bottom: 5px">
      <el-checkbox v-model="loginDto.rememberMe">记住密码</el-checkbox>
    </el-form-item>
    <el-form-item class="login-btn">
      <el-button class="w-full" type="primary" size="default" @click="loginByAccount()">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { User, Lock, Key } from '@element-plus/icons-vue'
import { getGenerateApi, getEnabledApi } from '@/api/auth/captcha'

const loginFormRef = ref()
const loading = ref(false)

const loginDto = reactive({
  username: 'admin',
  password: 'brycehan',
  uuid: '',
  code: '',
  rememberMe: false,
})
const captchaBase64 = ref()

const authStore = useAuthStore()
const router = useRouter()

// 是否显示验证码
const captchaEnabled = ref(false)

/**
 * 获取验证码开关
 */
const handleCaptchaEnabled = async () => {
  const { data } = await getEnabledApi('login')
  captchaEnabled.value = data
  if (captchaEnabled.value) {
    await handleCaptcha()
  }
}

/**
 * 获取验证码
 */
const handleCaptcha = async () => {
  const { data } = await getGenerateApi()
  loginDto.uuid = data.uuid
  captchaBase64.value = data.image
}

/**
 * 登录
 */
const loginByAccount = async () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    loading.value = true
    authStore.rememberMe = loginDto.rememberMe
    // 用户登录
    authStore
      .loginByAccount(loginDto)
      .then(() => {
        if (router.currentRoute.value.query?.redirect) {
          router.push({ path: router.currentRoute.value.query.redirect as string })
        } else {
          router.push({ path: '/dashboard' })
        }
      })
      .catch(() => {
        loading.value = false
        if (captchaEnabled.value) {
          handleCaptcha()
        }
      })
  })
}

const loginRules = {
  username: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  password: [{ required: true, min: 6, max: 20, message: '长度为6~20个字符', trigger: 'blur' }],
  code: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
}

onMounted(() => {
  handleCaptchaEnabled()
})
</script>

<style scoped lang="scss">
.login-captcha {
  :deep(.el-input) {
    width: 200px;
  }
}

.login-captcha img {
  width: 150px;
  height: 40px;
  margin: 5px 0 0 10px;
  pointer-events: auto;
  cursor: pointer;
}

.login-btn {
  :deep(.el-button--primary) {
    width: 100%;
    height: 40px;
    margin-top: 10px;
    font-size: 18px;
    letter-spacing: 8px;
  }
}
</style>
