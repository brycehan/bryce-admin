<template>
  <div class="theme-setting" @click="handleThemeSetting" >
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
  width: 40px;
  height: var(--theme-header-height);
  line-height: var(--theme-header-height);
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--theme-header-text-color);
  font-size: 16px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
