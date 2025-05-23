<template>
  <el-container>
    <component :is="LayoutComponents[layout]"></component>
    <layout-settings />
  </el-container>
</template>
<script setup lang="ts">
import Vertical from '@/components/layout/theme/vertical.vue'
import Column from '@/components/layout/theme/column.vue'
import HorizontalOne from '@/components/layout/theme/horizontal-one.vue'
import HorizontalTwo from '@/components/layout/theme/horizontal-two.vue'

const appStore = useAppStore()
const LayoutComponents: { [key: string]: any } = {
  vertical: Vertical,
  column: Column,
  horizontalOne: HorizontalOne,
  horizontalTwo: HorizontalTwo,
}

const layout = computed(() => appStore.theme.layout)
</script>
