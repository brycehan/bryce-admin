<template>
  <div class="login-third">
    <el-divider>其它方式登录</el-divider>
    <div class="third-btn">
      <el-button text title="微信" @click="thirdLogin('wechat')">
        <img :src="wechatIcon" width="16" height="16" alt="微信" />
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import wechatIcon from '@/assets/svgs/wechat.svg'
import constant from '@/utils/constant'
import request from '@/utils/request'
import { useRouter } from 'vue-router'

const router = useRouter()

/** 发送验证码 */
const thirdLogin = (type: string) => {
  const url = `${constant.thirdLoginUrl}/${type}/mp`
  request.get(url).then((res) => {
    window.open(res.data, '第三方登录', 'width=600,height=400,toolbar=no')
  })

  window.onmessage = (e) => {
    if (!e.data?.type) {
      return
    }

    // 第三方登录
    console.log('第三方登录', e.data)
    router.push({ path: constant.loginSuccessPage })
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
