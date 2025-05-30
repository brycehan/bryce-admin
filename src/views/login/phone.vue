<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" @keyup.enter="loginByPhone">
    <el-form-item prop="phone">
      <el-input v-model="loginForm.phone" prefix-icon="Iphone" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item prop="code" class="login-code">
      <el-input v-model="loginForm.code" prefix-icon="Key" placeholder="请输入验证码" />
      <el-button v-if="!sms.disabled" @click="sendCode">发送验证码</el-button>
      <el-button v-else disabled>{{ sms.count }} 秒后重新发送</el-button>
    </el-form-item>
    <el-form-item prop="rememberMe" style="margin-bottom: 5px">
      <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
    </el-form-item>
    <el-form-item class="login-btn">
      <el-button class="w-full" type="primary" @click="loginByPhone()">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { getSendLoginCodeApi } from '@/api/auth/sms'
import { phoneRegExp } from '@/utils/tool'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()

const loginFormRef = ref()
const loading = ref(false)

const loginForm = reactive({
  phone: '15853155402',
  code: '',
  rememberMe: true,
})

const router = useRouter()

/**
 * 短信计时器
 */
const sms = reactive({
  disabled: false,
  total: 60,
  count: 0,
})

/**
 * 发送验证码
 */
const sendCode = () => {
  if (!phoneRegExp.test(loginForm.phone)) {
    ElMessage.error('请输入正确的手机号')
    return
  }

  getSendLoginCodeApi(loginForm.phone).then(() => {
    handleCounter()
  })
}
/**
 * 计时处理器
 */
const handleCounter = () => {
  sms.count = sms.total
  sms.disabled = true
  const timer = setInterval(() => {
    if (sms.count > 1 && sms.count <= sms.total) {
      sms.count--
    } else {
      sms.disabled = false
      clearInterval(timer)
    }
  }, 1000)
}

/**
 * 登录
 */
const loginByPhone = async () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    loading.value = true
    // 用户登录
    authStore
      .loginByPhone(loginForm)
      .then(() => {
        if (router.currentRoute.value.query?.redirect) {
          router.push({ path: router.currentRoute.value.query.redirect as string })
        } else {
          router.push({ path: '/dashboard' })
        }
      })
      .catch((e: any) => {
        console.error(e)
      })
  })
}

const loginRules = {
  phone: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
}
</script>

<style scoped lang="scss">
.login-code {
  :deep(.el-input) {
    width: 200px;
  }

  :deep(.el-button) {
    width: 150px;
    height: 40px;
    margin: 5px 0 0 10px;
  }
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
