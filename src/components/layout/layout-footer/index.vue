<template>
  <el-footer
    class="!h-[var(--app-footer-height)] bg-[var(--app-main-bg-color)] text-center leading-[var(--app-footer-height)] overflow-ellipsis text-[var(--el-text-color-placeholder)]"
  >
    <span class="text-[1rem]">Copyright ©{{ currentYear }} {{ title }}</span>
  </el-footer>
</template>

<script lang="ts" setup>
const appStore = useAppStore()
// 当前年份计算属性
const currentYear = computed(() => new Date().getFullYear())
const title = computed(() => appStore.title)
</script>
