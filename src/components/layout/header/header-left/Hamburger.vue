<template>
    <div @click="handleClick">
        <SvgIcon :icon="icon"></SvgIcon>
    </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/svg-icon/index.vue';
import stores from '@/stores';
import { computed, onMounted, ref } from 'vue';

const screenWidth = ref(0)

const handleClick = () => {
    stores.appStore.toggleSidebarOpened()
}

onMounted(() => {
    debugger
    window.addEventListener('resize', () => {
        screenWidth.value = document.body.clientWidth
    })
})

const icon = computed(() => stores.appStore.sidebarOpened ? 'icon-outdent' : 'icon-indent')
</script>

<style scoped lang="scss"></style>