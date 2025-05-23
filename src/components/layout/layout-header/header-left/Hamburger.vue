<template>
  <div class="hamburger" @click="handleClick">
    <icon :icon="appStore.sidebarOpened ? 'ep:fold' : 'ep:expand'" />
  </div>
</template>

<script setup lang="ts">
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: var(--app-header-height);
  font-size: 16px;
  line-height: var(--app-header-height);
  color: var(--app-header-text-color);
  cursor: pointer;

  &:hover {
    background-color: rgb(0 0 0 / 10%);
  }
}

.dark .hamburger:hover {
  background-color: rgb(255 255 255 / 10%);
}
</style>
