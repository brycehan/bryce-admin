<template>
  <div class="header-right-container">
    <ComponentSize />
    <a href="https://github.com/brycehan/bryce-admin" target="_blank">
      <SvgIcon icon="icon-github-fill"></SvgIcon>
    </a>
    <Fullscreen />
    <User />
<!-- <SvgIcon icon="icon-ellipsis-v"></SvgIcon> -->
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/svg-icon/svg-icon.vue'
import User from './User.vue'
import ComponentSize from './ComponentSize.vue'
import Fullscreen from './Fullscreen.vue'
</script>

<style scoped lang="scss">
.header-right-container {
  display: flex;
}
</style>
