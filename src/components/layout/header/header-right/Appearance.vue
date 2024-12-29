<template>
  <el-switch v-model="isDark" :class="switchPrimaryClass" :active-action-icon="Moon" :inactive-action-icon="Sunny" />
</template>

<script setup lang="ts">
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useDark } from '@vueuse/core'
import { computed } from 'vue'
import { useAppStore } from '@/stores/modules/app'

// 暗黑模式
const isDark = useDark()
const appStore = useAppStore()

const switchPrimaryClass = computed(() => appStore.theme.headerStyle === 'primary' ? 'switch-primary' : '')
</script>

<style lang="scss" scoped>
.el-switch {
  margin-right: 10px;
  --el-switch-on-color: transparent;
  --el-switch-off-color: rgba(142, 150, 170, .14);
  --el-switch-border-color: #c2c2c4;
  // 亮色样式
  // 图标颜色
  ::v-deep(i) {
    color: rgba(60, 60, 67, .78);
  }
  // 主题色hover边框
  ::v-deep(.el-switch__core:hover) {
    border: 1px solid var(--el-color-primary);
  }
  // 暗色样式
  &.is-checked {
    // 图标背景
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
      &:hover {// 主题色hover边框
        border: 1px solid var(--el-color-primary) !important;
      }
    }
  }

  &.switch-primary ::v-deep(.el-switch__core) {
    border: 1px solid rgba(255, 255, 255, 0.3);
    &:hover {// 主题色hover边框
      border: 1px solid white;
    }
  }
}
</style>
