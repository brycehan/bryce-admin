<template>
  <div
    v-if="appStore.theme.showLogo"
    class="!dark:text-[var(--app-logo-text-color-dark)] flex h-[var(--app-header-height)] items-center justify-center"
    :class="{
      'w-[var(--app-aside-width)]': appStore.theme.layout === 'vertical' && appStore.sidebarOpened,
      'w-72': appStore.theme.layout === 'horizontalOne' || appStore.theme.layout === 'horizontalTwo',
      'border-b dark:border-r dark:border-[var(--app-border-color)]': appStore.theme.layout === 'column',
      'border-[#444]': appStore.theme.sidebarStyle === 'dark',
      'border-r border-[#eee]': appStore.theme.sidebarStyle === 'light' && appStore.theme.layout === 'column',
    }"
  >
    <el-avatar
      v-if="appStore.theme.layout === 'column'"
      class="!h-[2.1rem] !w-[2.1rem] align-middle"
      src="/favicon.ico"
    ></el-avatar>
    <template v-else>
      <el-avatar class="!h-[1.8rem] !w-[1.8rem]" src="/favicon.ico"></el-avatar>
      <span
        v-if="
          appStore.sidebarOpened ||
          appStore.theme.layout === 'horizontalOne' ||
          appStore.theme.layout === 'horizontalTwo'
        "
        class="ml-[0.7rem]"
        :class="[
          {
            'text-[var(--app-logo-text-color-dark)]': appStore.theme.sidebarStyle === 'dark',
            'text-[var(--app-logo-text-color-light)]':
              appStore.theme.sidebarStyle === 'light' ||
              appStore.theme.layout === 'horizontalOne' ||
              appStore.theme.layout === 'horizontalTwo',
          },
        ]"
      >
        {{ appStore.title }}
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore()
</script>

<style scoped>
.dark .el-avatar {
  filter: drop-shadow(4px 4px 12px green);
}
</style>
