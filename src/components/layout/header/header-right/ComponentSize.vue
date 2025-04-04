<template>
  <el-dropdown @command="componentSizeChange">
    <div class="el-dropdown-text">
      <icon icon="ion:text" />
    </div>
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

const appStore = useAppStore()

const componentSize = computed(() => appStore.componentSize)

onMounted(() => {
  componentSizeChange(componentSize.value)
})

/**
 * 设置组件大小
 * @param componentSize
 */
const componentSizeChange = (componentSize: 'default' | 'small' | 'large') => {
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

<style lang="scss" scoped>
.el-dropdown-text {
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
</style>
