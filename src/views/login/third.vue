<template>
  <div class="login-third">
    <el-divider>其它登录</el-divider>
    <div class="third-btn">
      <el-button link title="微信" @click="thirdLogin('wechat')">
        <!--        <SvgIcon icon="icon-weixin" size="24" />-->
        <img :src="wechatIcon" width="20" height="20" alt="微信" />
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/svg-icon/svg-icon.vue'
import wechatIcon from '@/assets/svgs/wechat.svg'

/** 发送验证码 */
const thirdLogin = (type: string) => {
  const url = `${import.meta.env.VITE_APP_BASE_API}/third/login/${type}`
  // 打开新窗口
  window.open(url, '第三方登录', 'width=600,height=400,toolbar=no')

  window.onmessage = (e) => {
    if (!e.data?.type) {
      return
    }

    // 第三方登录
    console.log('第三方登录', e.data)
  }
}
</script>

<style scoped lang="scss">
.login-third {
  margin-top: 36px;

  :deep(.el-divider__text) {
    color: #888 !important;
    font-size: 13px;
  }

  .third-btn {
    display: flex;
    justify-content: center !important;
    .el-button {
      background-color: #ddd;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>
