<template>
  <div
    class="flex w-full justify-between bg-[var(--theme-header-bg-color)] text-[var(--theme-header-text-color)]"
    :class="headerClass"
  >
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

const headerClass = computed(() => (appStore.theme.headerStyle === 'primary' ? 'header-primary' : ''))
</script>
