<template>
  <SvgIcon :icon="isFullscreen ? 'icon-compress' : 'icon-expend'" @click="toggle" />
</template>

<script setup lang="ts">
import SvgIcon from '@/components/svg-icon/svg-icon.vue'
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle } = useFullscreen()
</script>

<style scoped></style>
