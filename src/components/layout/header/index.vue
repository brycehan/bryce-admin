<template>
  <div class="header-container" :class="headerClass">
    <HeaderLeft />
    <HeaderRight />
  </div>
</template>

<script setup lang="ts">
import HeaderLeft from '@/components/layout/header/header-left/index.vue'
import HeaderRight from '@/components/layout/header/header-right/index.vue'
import { useAppStore } from '@/stores/modules/app'
import { computed } from 'vue'

const appStore = useAppStore()

const headerClass = computed(() => appStore.theme.headerStyle === 'primary' ? 'header-primary' : '')
</script>

<style scoped lang="scss">
.header-container {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--theme-border-color-light);
  background: var(--theme-header-bg-color);
  border-bottom: 1px solid var(--theme-border-color-light);
  color: var(--theme-header-text-color);
  ::v-deep(.svg-icon) {
    cursor: pointer;
    line-height: var(--theme-header-height);
    padding: 0 12px;

    svg {
      color: var(--theme-header-text-color) !important;
      font-size: 16px;
    }

    &:hover {
      background-color: var(--theme-header-hover-color);
    }
  }
}
</style>
