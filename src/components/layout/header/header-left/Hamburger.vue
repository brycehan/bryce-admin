<template>
  <svg-icon :icon="icon" @click="handleClick"/>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import { computed, onMounted, ref } from 'vue'

const appStore = useAppStore()
const screenWidth = ref(0)

const handleClick = () => {
  appStore.toggleSidebarOpened()
}

onMounted(() => {
  window.addEventListener('resize', () => {
    screenWidth.value = document.body.clientWidth
  })
})

const icon = computed(() => (appStore.sidebarOpened ? 'icon-outdent' : 'icon-indent'))
</script>
