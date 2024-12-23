<template>
  <div class="header-left-container">
    <Hamburger />
    <Refresh />
    <Breadcrumb v-if="appStore.theme.showBreadcrumb"/>
  </div>
</template>

<script setup lang="ts">
import Hamburger from './Hamburger.vue'
import Refresh from './Refresh.vue'
import Breadcrumb from './Breadcrumb.vue'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()
</script>

<style scoped lang="scss">
.header-left-container {
  display: flex;
  align-items: center;
}
</style>
