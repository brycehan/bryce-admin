<template>
  <div @click="handleClick">
    <SvgIcon :icon="icon"></SvgIcon>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/svg-icon/svg-icon.vue'
import stores from '@/stores'
import { computed } from 'vue'

const handleClick = () => {
  stores.appStore.toggleSidebarOpened()
}

const icon = computed(() => (stores.appStore.sidebarOpened ? 'icon-outdent' : 'icon-indent'))
</script>
