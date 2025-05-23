<template>
  <el-switch v-model="isDark" :class="switchPrimaryClass" :active-action-icon="Moon" :inactive-action-icon="Sunny" />
</template>

<script setup lang="ts">
import { Moon, Sunny } from '@element-plus/icons-vue'

// 暗黑模式
const isDark = useDark()
const appStore = useAppStore()

const switchPrimaryClass = computed(() =>
  appStore.theme.headerStyle === 'primary' && appStore.theme.layout !== 'horizontalTwo' ? 'switch-primary' : '',
)
</script>

<style lang="scss" scoped>
.el-switch {
  --el-switch-on-color: transparent;
  --el-switch-off-color: rgb(142 150 170 / 14%);
  --el-switch-border-color: #c2c2c4;

  margin-right: 10px;

  // 亮色样式
  // 图标颜色
  ::v-deep(i) {
    color: rgb(60 60 67 / 78%);
  }

  // 主题色hover边框
  ::v-deep(.el-switch__core:hover) {
    border: 1px solid var(--el-color-primary);
  }
}

.el-switch.switch-primary ::v-deep(.el-switch__core) {
  border: 1px solid rgb(255 255 255 / 30%);
}

.el-switch.is-checked ::v-deep(.el-switch__core) {
  background-color: rgb(101 117 133 / 16%);
  border: 1px solid #444;
}

.el-switch.switch-primary ::v-deep(.el-switch__core):hover {
  // 主题色hover边框
  border: 1px solid white;
}

.el-switch.is-checked ::v-deep(.el-switch__core):hover {
  // 主题色hover边框
  border: 1px solid var(--el-color-primary) !important;
}

// 暗色样式
.el-switch.is-checked {
  // 图标背景
  ::v-deep(.el-switch__action) {
    background-color: black;
  }

  // 图标颜色
  ::v-deep(i) {
    color: white;
  }
}
</style>
