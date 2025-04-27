<template>
  <div class="fullscreen" @click="toggle">
    <icon :icon="isFullscreen ? 'ion:arrow-shrink' : 'ion:arrow-expand'" />
  </div>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle } = useFullscreen()
</script>

<style scoped>
.fullscreen {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: var(--theme-header-height);
  font-size: 16px;
  line-height: var(--theme-header-height);
  color: var(--theme-header-text-color);
  cursor: pointer;

  &:hover {
    background-color: rgb(0 0 0 / 10%);
  }
}
</style>
