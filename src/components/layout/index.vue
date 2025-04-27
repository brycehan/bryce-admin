<template>
  <component :is="LayoutComponents[layout]"></component>
  <settings />
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import { computed } from 'vue'
import Settings from '@/components/layout/settings/index.vue'
import Vertical from '@/components/layout/theme/Vertical.vue'
import Column from '@/components/layout/theme/Column.vue'
import Horizontal from '@/components/layout/theme/Horizontal.vue'

const appStore = useAppStore()
const LayoutComponents: { [key: string]: any } = {
  vertical: Vertical,
  column: Column,
  horizontal: Horizontal,
}

const layout = computed(() => appStore.theme.layout)
</script>
