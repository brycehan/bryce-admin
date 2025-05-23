<template>
  <el-dropdown @command="componentSizeChange">
    <div class="el-dropdown-text">
      <icon icon="ion:text" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-if="width > 2560" command="2xl" :disabled="componentSize === '2xl'">
          最大型
        </el-dropdown-item>
        <el-dropdown-item v-if="width > 1920" command="xl" :disabled="componentSize === 'xl'">超大型</el-dropdown-item>
        <el-dropdown-item command="large" :disabled="componentSize === 'large'">大型</el-dropdown-item>
        <el-dropdown-item command="default" :disabled="componentSize === 'default'">默认</el-dropdown-item>
        <el-dropdown-item command="small" :disabled="componentSize === 'small'">小型</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
const appStore = useAppStore()
const componentSize = computed(() => appStore.componentSize)
const { width } = useWindowSize()

/**
 * 设置组件大小
 * @param componentSize
 */
const componentSizeChange = (componentSize: 'default' | 'small' | 'large' | 'xl' | '2xl') => {
  appStore.setComponentSize(componentSize)
  switch (componentSize) {
    case '2xl':
      document.documentElement.style.setProperty('--el-font-size-base', '24px')
      break
    case 'xl':
      document.documentElement.style.setProperty('--el-font-size-base', '20px')
      break
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

onMounted(() => {
  componentSizeChange(componentSize.value)
})
</script>

<style lang="scss" scoped>
.el-dropdown-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: var(--app-header-height);
  font-size: 16px;
  line-height: var(--app-header-height);
  color: var(--app-header-text-color);
  cursor: pointer;

  &:hover {
    background-color: rgb(0 0 0 / 10%);
  }
}
</style>
