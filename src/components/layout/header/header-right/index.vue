<template>
    <div class="header-right-container">
        <SvgIcon icon="icon-translate"></SvgIcon>
        <SvgIcon icon="icon-font-size"></SvgIcon>
        <SvgIcon icon="icon-earth"></SvgIcon>
        <SvgIcon icon="icon-github-fill"></SvgIcon>
        <SvgIcon icon="icon-gitee-fill-round"></SvgIcon>
        <SvgIcon icon="icon-expend"></SvgIcon>
        <User />
        <SvgIcon icon="icon-ellipsis-v"></SvgIcon>
    </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/svg-icon/index.vue';
import User from './User.vue';
</script>

<style scoped lang="scss">
.header-right-container {
    display: flex;
}
</style>