<template>
  <el-breadcrumb separator-icon="ArrowRight" class="header-breadcrumb">
    <el-breadcrumb-item key="home">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in route.meta.breadcrumb" :key="index">
      <span>{{ item }}</span></el-breadcrumb-item
    >
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped lang="scss">
.header-breadcrumb {
  ::v-deep(.el-breadcrumb__inner) {
    color: var(--theme-header-text-color);
    &:hover {
      color: var(--theme-header-text-color);
    }
  }

  padding-left: 10px;
}
</style>
