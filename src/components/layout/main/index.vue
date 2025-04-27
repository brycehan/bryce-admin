<template>
  <el-container class="h-full !flex-col">
    <Tabs v-if="appStore.theme.showTabsView" />
    <el-main class="flex flex-col overflow-hidden !p-0">
      <el-scrollbar>
        <el-container class="main-card-container">
          <router-view v-slot="{ Component, route }">
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="route.name" />
            </keep-alive>
          </router-view>
        </el-container>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import Tabs from '@/components/layout/main/Tabs.vue'
import { useTabsStore } from '@/stores/modules/tabs'
import { useAppStore } from '@/stores/modules/app'
import { computed } from 'vue'

const tabsStore = useTabsStore()
const appStore = useAppStore()

const cachedViews = computed(() => (appStore.theme.isTabsCache ? tabsStore.cachedViews : []))
</script>

<style lang="scss">
.main-card-container {
  flex-direction: column !important;

  // card 边距
  padding: 9px 10px 10px;

  .el-pagination {
    justify-content: flex-end;
    margin-top: 15px;
  }
}
</style>
