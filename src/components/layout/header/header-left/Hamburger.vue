<template>
  <div class="hamburger" @click="handleClick">
    <icon :icon="appStore.sidebarOpened ? 'ep:fold' : 'ep:expand'"/>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import { onMounted, ref } from 'vue'

const appStore = useAppStore()
const screenWidth = ref(0)

/**
 * 点击事件
 */
const handleClick = () => {
  appStore.toggleSidebarOpened()
}

onMounted(() => {
  window.addEventListener('resize', () => {
    screenWidth.value = document.body.clientWidth
  })
})
</script>

<style lang="scss" scoped>
.hamburger {
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
