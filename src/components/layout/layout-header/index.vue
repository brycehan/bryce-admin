<template>
  <el-header
    class="flex !h-[var(--app-header-height)] bg-[var(--app-header-bg-color)] !px-0 dark:bg-[var(--el-bg-color-overlay)] dark:text-[var(--app-dark-text-color)]"
    :class="headerClass"
  >
    <layout-logo v-if="appStore.theme.layout === 'horizontalOne' || appStore.theme.layout === 'horizontalTwo'" />
    <div class="flex flex-1 justify-between">
      <header-left />
      <header-right />
    </div>
  </el-header>
</template>

<script setup lang="ts">
const appStore = useAppStore()

const headerClass = computed(() => (appStore.theme.headerStyle === 'primary' ? 'header-primary' : 'header-default'))
</script>

<style lang="scss">
/*
 * 顶栏主题色
 */
.header-primary {
  --app-logo-text-color-light: white;
  --app-logo-text-color-dark: white;
  --app-header-bg-color: var(--el-color-primary);
  --app-header-text-color: white;
  --app-header-hover-color: var(--el-color-primary-light-9);
}

.dark .header-default,
.dark .header-primary {
  --app-header-text-color: rgb(255 255 255 / 66%);
}
</style>
