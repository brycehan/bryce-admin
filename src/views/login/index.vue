<template>
  <div class="login-container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <div class="login-form">
          <account v-if="loginType === 'account'"/>
          <phone v-if="loginType === 'phone'"/>
          <div class="login-more">
            <el-button type="info" link :class="loginType === 'account'? 'text-white' : ''" @click="loginSwitch('account')">账号密码登录</el-button>
            <el-button type="info" link :class="loginType === 'phone'? 'text-white' : ''" @click="loginSwitch('phone')">手机短信登录</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import Account from "@/views/login/account.vue";
import Phone from "@/views/login/phone.vue";

// 登录类型
const loginType = ref('account')

const loginSwitch = (type: string) => {
  loginType.value = type
}

</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
}

.login-form {
  position: relative;
  width: 400px;
  top: 30vh;
  background: url('@/assets/images/login_form.png') no-repeat;
  background-size: cover;
  padding: 40px;
  margin-left: 100px;
}

@media only screen and (max-width: 992px) {
  .login-form {
    margin-left: 0 !important;
  }
}

.login-more {
  display: flex;
  justify-content: space-evenly;
  padding-top: 25px;


}

.text-white :deep(span) {
  color: white !important;
}
</style>
