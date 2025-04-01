<template>
  <div class="refresh" @click="refresh">
    <icon icon="ep:refresh-right" />
  </div>
</template>

<script setup lang="ts">
import { useTabsStore } from '@/stores/modules/tabs'
import { useRoute, useRouter } from 'vue-router'
import { nextTick } from 'vue'

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()

const refresh = () => {
  tabsStore.deleteCachedView(route).then(() => {
    nextTick(() => {
      router.replace({ path: '/redirect' + route.path }).catch((error) => {
        console.warn(error)
      })
    })
  })
}
</script>

<style lang="scss" scoped>
.refresh {
  width: 40px;
  height: var(--theme-header-height);
  line-height: var(--theme-header-height);
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--theme-header-text-color);
  font-size: 16px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
