<template>
  <el-container class="w-full !flex-col overflow-hidden bg-[var(--app-main-bg-color)] p-0">
    <Tabs v-if="appStore.theme.showTabsView" />
    <el-scrollbar class="!h-[calc(100vh-var(--app-header-height)-var(--app-main-tabs-height))]">
      <el-main
        class="main-card-container !min-h-[calc(100vh-var(--app-header-height)-var(--app-footer-height)-var(--app-main-tabs-height)-11px)]"
      >
        <router-view v-slot="{ Component, route }">
          <keep-alive :include="cachedViews">
            <component :is="Component" :key="route.name" />
          </keep-alive>
        </router-view>
      </el-main>
      <layout-footer v-if="appStore.theme.showFooter" />
    </el-scrollbar>
  </el-container>
</template>

<script setup lang="ts">
import Tabs from '@/components/layout/layout-main/Tabs.vue'

const tabsStore = useTabsStore()
const appStore = useAppStore()

const cachedViews = computed(() => (appStore.theme.isTabsCache ? tabsStore.cachedViews : []))
</script>

<style lang="scss">
.main-card-container {
  // card 边距
  padding: 9px 10px 10px;

  .el-pagination {
    justify-content: flex-end;
    margin-top: 15px;
  }
}
</style>
