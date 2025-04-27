<template>
  <div class="login-container">
    <div class="login-info">
      <h1>布莱斯后台管理系统</h1>
      <div class="login-tips"></div>
      <div class="login-bg"><img src="@/assets/images/admin-ui.png" alt="" /></div>
    </div>
    <div class="login-form">
      <div class="login-title">
        <el-button text :class="loginType === 'account' ? 'text-account' : ''" @click="loginSwitch('account')"
          >账号登录</el-button
        >
        <el-button text :class="loginType === 'phone' ? 'text-account' : ''" @click="loginSwitch('phone')"
          >手机验证码登录</el-button
        >
      </div>
      <account v-if="loginType === 'account'" />
      <phone v-if="loginType === 'phone'" />
      <!--  <third /> -->
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
  align-items: center;
  justify-content: space-evenly;
  height: 100vh;
}

.login-info {
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  width: 520px;
}

.login-info h1 {
  font-size: 28px;
  color: var(--el-color-primary);
}

.login-info .login-tips {
  padding: 15px 0;
  line-height: 32px;
  color: #777;
}

.login-bg img {
  width: 520px;
}

.login-title {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;

  :deep(.el-button) {
    padding-bottom: 8px;
    font-size: 18px;
    color: #333;
    border-radius: 0;
  }

  .text-account {
    color: var(--el-color-primary);
    border-bottom: 3px solid var(--el-color-primary) !important;
  }
}

.login-form {
  box-sizing: border-box;
  flex: 0 1 auto;
  width: 440px;
  padding: 40px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 1px 1px 8px #aaa;

  :deep(.el-input) {
    height: 40px;
    margin-top: 5px;

    .el-input__inner {
      height: 40px;
      padding: 10px 15px 10px 5px;
      font-size: 16px;
      line-height: 40px;
      color: #666;
    }
  }
}

@media only screen and (width <= 992px) {
  .login-info {
    display: none;
  }
}

@media only screen and (width <= 768px) {
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
