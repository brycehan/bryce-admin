<template>
  <el-switch v-model="isDark" :active-action-icon="Moon" :inactive-action-icon="Sunny" />
</template>

<script setup lang="ts">
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useDark } from '@vueuse/core'

// 暗黑模式
const isDark = useDark()
</script>

<style lang="scss" scoped>
.el-switch {
  margin-right: 10px;
  --el-switch-on-color: transparent;
  --el-switch-off-color: rgba(142, 150, 170, .14);
  --el-switch-border-color: #c2c2c4;
  // 亮色样式
  ::v-deep(.el-switch__action) {
    color: var(--el-switch-off-color);
  }
  // 图标颜色
  ::v-deep(i) {
    color: rgba(60, 60, 67, .78);
  }
  // 暗色样式
  &.is-checked {
    ::v-deep(.el-switch__action) {
      background-color: black;
    }
    // 图标颜色
    ::v-deep(i) {
      color: white;
    }
    ::v-deep(.el-switch__core) {
      border: 1px solid #444;
      background-color: rgba(101, 117, 133, .16);
      &:hover {
        border: 1px solid var(--el-color-primary);
      }
    }
  }
}
</style>
