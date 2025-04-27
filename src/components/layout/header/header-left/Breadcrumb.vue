<template>
  <el-breadcrumb separator-icon="ArrowRight" class="header-breadcrumb">
    <el-breadcrumb-item v-for="(item, index) in route.meta.breadcrumb" :key="index">
      <span>{{ route.meta.i18n ? t(item) : item }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
</script>

<style scoped lang="scss">
.header-breadcrumb {
  padding-left: 10px;

  ::v-deep(.el-breadcrumb__inner) {
    &,
    &:hover {
      font-size: 1rem;
      color: var(--theme-header-text-color);
    }
  }
}
</style>
