<template>
  <el-container class="main-container">
    <Tabs />
    <el-main class="main-content">
      <el-scrollbar>
        <el-container class="main-card-container">
            <router-view v-slot="{ Component, route }">
              <keep-alive :include="[...tabsStore.cachedViews]">
                <component :is="Component" :key="route.name"/>
              </keep-alive>
            </router-view>
        </el-container>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import Tabs from '@/components/layout/main/Tabs.vue'
import {useTabsStore} from "@/stores/tabs";

const tabsStore = useTabsStore()
</script>

<style lang="scss">
.main-container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
}

.main-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 !important;

  .main-card-container {
    padding: 15px !important;
    flex-direction: column;

    .el-pagination {
      margin-top: 15px;
      justify-content: flex-end;
    }
  }
}

</style>
