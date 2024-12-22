<template>
  <div class="theme-setting">
    <SvgIcon icon="icon-ellipsis-v" @click="handleThemeSetting"></SvgIcon>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/svg-icon/svg-icon.vue'
import emitter from '@/utils/emitter'

const handleThemeSetting = () => {
  emitter.emit('openThemeSetting')
}
</script>
<style lang="scss" scoped>
.theme-setting {
  display: flex;
}
</style>
