<template>
  <div class="flex items-center">
    <hamburger v-if="appStore.theme.layout !== 'column'" />
    <refresh />
    <breadcrumb v-if="appStore.theme.showBreadcrumb && width > 900" />
  </div>
</template>

<script setup lang="ts">
import Hamburger from './Hamburger.vue'
import Refresh from './Refresh.vue'
import Breadcrumb from './Breadcrumb.vue'

const appStore = useAppStore()
const { width } = useWindowSize()
</script>
