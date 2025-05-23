<template>
  <div class="theme-setting" @click="handleThemeSetting">
    <icon icon="ion:ellipsis-vertical" />
  </div>
</template>

<script setup lang="ts">
import emitter from '@/utils/emitter'

const handleThemeSetting = () => {
  emitter.emit('openThemeSetting')
}
</script>
<style lang="scss" scoped>
.theme-setting {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: var(--app-header-height);
  font-size: 16px;
  line-height: var(--app-header-height);
  color: var(--app-header-text-color);
  cursor: pointer;

  &:hover {
    background-color: rgb(0 0 0 / 10%);
  }
}
</style>
