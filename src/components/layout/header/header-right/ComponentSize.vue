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
import stores from '@/stores'
import { computed } from 'vue'
import SvgIcon from '@/components/svg-icon/svg-icon.vue'

const componentSize = computed(() => stores.appStore.componentSize)
const fontSizeChange = (componentSize: string) => {
  stores.appStore.setComponentSize(componentSize)
}
</script>
