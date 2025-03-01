<template>
  <div class="header-left-container">
    <Hamburger />
    <Refresh />
    <Breadcrumb v-if="appStore.theme.showBreadcrumb"/>
  </div>
</template>

<script setup lang="ts">
import Hamburger from './Hamburger.vue'
import Refresh from './Refresh.vue'
import Breadcrumb from './Breadcrumb.vue'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()
</script>

<style scoped lang="scss">
.header-left-container {
  display: flex;
  align-items: center;
  ::v-deep(.svg-icon) {
    display: flex;
      cursor: pointer;
      line-height: var(--theme-header-height);
      height: var(--theme-header-height);
      padding: 0 12px;
      align-items: center;

      svg {
        color: var(--theme-header-text-color) !important;
        font-size: 16px;
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
}
</style>
