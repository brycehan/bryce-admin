<template>
  <div class="flex items-center">
    <appearance />
    <languages />
    <component-size />
    <el-link href="https://github.com/brycehan/bryce-admin" :underline="false" class="github-link" target="_blank">
      <icon icon="ion:logo-github" />
    </el-link>
    <search />
    <fullscreen />
    <user />
    <theme-setting />
  </div>
</template>

<script setup lang="ts">
import User from './User.vue'
import ComponentSize from './ComponentSize.vue'
import Fullscreen from './Fullscreen.vue'
import ThemeSetting from '@/components/layout/layout-header/header-right/ThemeSetting.vue'
import Search from '@/components/layout/layout-header/header-right/Search.vue'
import Appearance from '@/components/layout/layout-header/header-right/Appearance.vue'
import Languages from '@/components/layout/layout-header/header-right/Languages.vue'
</script>

<style scoped lang="scss">
a.github-link {
  width: 40px;
  height: var(--app-header-height);
  font-size: 1rem;
  line-height: var(--app-header-height);
  color: var(--app-header-text-color);
  cursor: pointer;

  &:hover {
    background-color: rgb(0 0 0 / 10%);
  }
}
</style>
