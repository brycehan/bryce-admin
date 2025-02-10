<template>
  <el-dropdown trigger="click" @command="componentSizeChange">
    <SvgIcon icon="icon-font-size" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="large" :disabled="componentSize === 'large'">大型</el-dropdown-item>
        <el-dropdown-item command="default" :disabled="componentSize === 'default'">默认</el-dropdown-item>
        <el-dropdown-item command="small" :disabled="componentSize === 'small'">小型</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import { computed, onMounted } from 'vue'
import SvgIcon from '@/components/svg-icon/svg-icon.vue'

const appStore = useAppStore()

const componentSize = computed(() => appStore.componentSize)

onMounted(() => {
  componentSizeChange(componentSize.value)
})

/**
 * 设置组件大小
 * @param componentSize
 */
const componentSizeChange = (componentSize: string) => {
  appStore.setComponentSize(componentSize)
  switch (componentSize) {
    case 'large':
      document.documentElement.style.setProperty('--el-font-size-base', '16px')
      break
    case 'default':
      document.documentElement.style.setProperty('--el-font-size-base', '14px')
      break
    case 'small':
      document.documentElement.style.setProperty('--el-font-size-base', '12px')
      break
  }
}
</script>
