<template>
    <div class="header-container">
        <HeaderLeft />
        <HeaderRight />
    </div>
</template>

<script setup lang="ts">
import HeaderLeft from '@/components/layout/header/header-left/index.vue'
import HeaderRight from '@/components/layout/header/header-right/index.vue'
</script>

<style scoped lang="scss">
.header-container {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--theme-border-color-light);

    ::v-deep(.svg-icon) {
        cursor: pointer;
        line-height: var(--theme-header-height);
        padding: 0 12px;

        svg {
            color: var(--theme-header-text-color);
            font-size: 16px;
        }

        &:hover {
            background-color: var(--theme-header-hover-color);
            ;
        }
    }
}
</style>