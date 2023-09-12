<template>
  <div @click="handleClick">
    <svg-icon :icon="icon" />
  </div>
</template>

<script setup lang="ts">
import stores from '@/stores'
import { computed } from 'vue'

const handleClick = () => {
  stores.appStore.toggleSidebarOpened()
}

const icon = computed(() => (stores.appStore.sidebarOpened ? 'icon-outdent' : 'icon-indent'))
</script>
