<template>
  <div class="login-container">
    <div class="login-info">
      <h1>布鲁斯后台管理系统</h1>
      <div class="login-tips"></div>
      <div class="login-bg"><img src="@/assets/images/admin-ui.png" alt="" /></div>
    </div>
    <div class="login-form">
      <div class="login-title">
        <el-button
          link
          :class="loginType === 'account' ? 'text-account' : ''"
          @click="loginSwitch('account')"
          >账号登录</el-button
        >
        <el-button
          link
          :class="loginType === 'phone' ? 'text-account' : ''"
          @click="loginSwitch('phone')"
          >手机验证码登录</el-button
        >
      </div>
      <account v-if="loginType === 'account'" />
      <phone v-if="loginType === 'phone'" />
      <third />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Account from './account.vue'
import Phone from './phone.vue'
import Third from './third.vue'

// 登录类型
const loginType = ref('account')

const loginSwitch = (type: string) => {
  loginType.value = type
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100vh;
}
.login-info {
  display: flex;
  flex-direction: column;
  width: 520px;
  flex: 0 1 auto;
}
.login-info h1 {
  color: var(--el-color-primary);
}
.login-info .login-tips {
  color: #777;
  line-height: 32px;
  padding: 15px 0;
}
.login-bg img {
  width: 520px;
}
.login-title {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  :deep(.el-button) {
    font-size: 18px;
    color: #333;
    padding-bottom: 8px;
    border-radius: 0;
  }
  .text-account {
    color: var(--el-color-primary);
    border-bottom: 3px solid var(--el-color-primary) !important;
  }
}
.login-form {
  background-color: white;
  flex: 0 1 auto;
  padding: 40px;
  border-radius: 6px;
  box-shadow: 1px 1px 8px #aaa;
  box-sizing: border-box;
  width: 440px;

  :deep(.el-input) {
    height: 40px;
    margin-top: 5px;
    .el-input__inner {
      padding: 10px 15px 10px 5px;
      height: 40px;
      line-height: 40px;
      color: #666;
      font-size: 16px;
    }
  }
}

@media only screen and (max-width: 992px) {
  .login-info {
    display: none;
  }
}
@media only screen and (max-width: 768px) {
  .login-container {
    background-color: white;
  }
  .login-info {
    display: none;
  }
  .login-form {
    flex: 0 1 auto;
    border-radius: 0;
    box-shadow: none;
  }
  .login-captcha {
    :deep(.el-input) {
      width: 150px;
    }
  }
}
</style>
