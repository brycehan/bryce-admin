<template>
  <div class="flex items-center">
    <appearance />
    <languages />
    <component-size />
    <a href="https://github.com/brycehan/bryce-admin" class="github-link" target="_blank">
      <icon icon="ion:logo-github" />
    </a>
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
import ThemeSetting from '@/components/layout/header/header-right/ThemeSetting.vue'
import Search from '@/components/layout/header/header-right/Search.vue'
import Appearance from '@/components/layout/header/header-right/Appearance.vue'
import Languages from '@/components/layout/header/header-right/Languages.vue'
</script>

<style scoped lang="scss">
a.github-link {
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
