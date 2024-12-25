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
  background: var(--theme-header-bg-color);
  color: var(--theme-header-text-color);
}
</style>
