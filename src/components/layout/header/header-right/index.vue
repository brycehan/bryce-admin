<template>
  <div class="header-right-container">
    <appearance />
    <languages />
    <component-size />
    <a href="https://github.com/brycehan/bryce-admin" target="_blank">
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
.header-right-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  a {
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
}
</style>
