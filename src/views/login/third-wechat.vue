<template>
  <div class="third-wechat">
    <el-divider>微信登录</el-divider>
    <div id="login_container"></div>
  </div>
</template>

<script setup lang="ts">
import WxLogin from '@/assets/js/wxLogin'

import { onMounted } from 'vue'

onMounted(() => {
  new WxLogin({
    self_redirect: true,
    id: 'login_container',
    appid: 'wx264fcac63168e5bb',
    scope: 'snsapi_login',
    redirect_uri:
      'https%3A%2F%2F6245-111-17-77-162.ngrok-free.app%2Fthird%2Flogin%2Fwechat%2Fmp%2Fauth',
    state: 'STATE',
    style: '',
    href: ''
  })
})
</script>

<style scoped lang="scss">
#third-wechat {
  width: 100%;
  height: 100%;

  #login_container {
    width: 150px;
    height: 150px;
    padding: 0;
    margin: 0;
  }
}
</style>
