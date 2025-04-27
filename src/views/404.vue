<template>
  <div class="layout-error">
    <img :src="PageError" alt="404" />
    <div>
      <el-button type="primary" @click="onBack">返回</el-button>
      <el-button type="success" @click="onToHome">主页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageError from '@/assets/svgs/404.svg'

const router = useRouter()

const onBack = () => {
  router.back()
}

const onToHome = () => {
  router.replace('/')
}
</script>

<style lang="scss" scoped>
.layout-error {
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 800px;
    margin-bottom: 20px;
  }
}
</style>
