<template>
  <el-breadcrumb separator-icon="ArrowRight" class="header-breadcrumb">
    <el-breadcrumb-item v-for="(item, index) in route.meta.breadcrumb" :key="index">
      <span>{{ route.meta.i18n ? t(item) : item }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()
</script>

<style scoped lang="scss">
.header-breadcrumb {
  ::v-deep(.el-breadcrumb__inner) {
    &,
    &:hover {
      color: var(--theme-header-text-color);
      font-size: 1rem;
    }
  }

  padding-left: 10px;
}
</style>
