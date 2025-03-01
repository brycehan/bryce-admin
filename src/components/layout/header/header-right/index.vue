<template>
  <div class="header-right-container">
    <appearance />
    <languages />
    <component-size />
    <a href="https://github.com/brycehan/bryce-admin" target="_blank">
      <svg-icon icon="icon-github-fill" class="block-icon"></svg-icon>
    </a>
    <search />
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
import Search from '@/components/layout/header/header-right/Search.vue'
import Appearance from '@/components/layout/header/header-right/Appearance.vue'
import Languages from '@/components/layout/header/header-right/Languages.vue'
</script>

<style scoped lang="scss">
.header-right-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  ::v-deep(.svg-icon) {
    display: flex;
    cursor: pointer;
    line-height: var(--theme-header-height);
    height: var(--theme-header-height);
    padding: 0 12px;
    align-items: center;

    svg {
      color: var(--theme-header-text-color) !important;
      font-size: 16px;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
.block-icon {
  display: block;
}
</style>
