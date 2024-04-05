<template>
  <div @click="handleClick">
    <svg-icon :icon="icon" />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import { computed } from 'vue'

const appStore = useAppStore()

const handleClick = () => {
  appStore.toggleSidebarOpened()
}

const icon = computed(() => (appStore.sidebarOpened ? 'icon-outdent' : 'icon-indent'))
</script>
