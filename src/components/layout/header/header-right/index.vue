<template>
  <div class="header-right-container">
    <component-size />
    <a href="https://github.com/brycehan/bryce-admin" target="_blank">
      <svg-icon icon="icon-github-fill" class="block-icon"></svg-icon>
    </a>
    <fullscreen />
    <user />
    <theme-setting />
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/svg-icon/svg-icon.vue'
import User from './User.vue'
import ComponentSize from './ComponentSize.vue'
import Fullscreen from './Fullscreen.vue'
import ThemeSetting from '@/components/layout/header/header-right/ThemeSetting.vue'
</script>

<style scoped lang="scss">
.header-right-container {
  display: flex;
}
.block-icon {
  display: block;
}
</style>
