<template>
  <el-dropdown trigger="click" @command="fontSizeChange">
    <SvgIcon icon="icon-font-size" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="large" :disabled="componentSize === 'large'"
          >大型</el-dropdown-item
        >
        <el-dropdown-item command="default" :disabled="componentSize === 'default'"
          >默认</el-dropdown-item
        >
        <el-dropdown-item command="small" :disabled="componentSize === 'small'"
          >小型</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import { computed } from 'vue'
import SvgIcon from '@/components/svg-icon/svg-icon.vue'

const appStore = useAppStore()

const componentSize = computed(() => appStore.componentSize)
const fontSizeChange = (componentSize: string) => {
  appStore.setComponentSize(componentSize)
}
</script>
