<template>
  <div class="flex items-center">
    <hamburger />
    <refresh />
    <breadcrumb v-if="appStore.theme.showBreadcrumb"/>
  </div>
</template>

<script setup lang="ts">
import Hamburger from './Hamburger.vue'
import Refresh from './Refresh.vue'
import Breadcrumb from './Breadcrumb.vue'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()
</script>
