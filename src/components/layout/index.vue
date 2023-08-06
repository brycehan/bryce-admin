<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside class="layout-sidebar" :class="sidebarClass">
            <Logo />
            <el-scrollbar>
                <el-menu :default-active="route.path" :collapse="!stores.appStore.sidebarOpened" unique-opened="true"
                    collapse-transition="false" mode="vertical">
                    <MenuItem v-for="menu in stores.routerStore.menuRoutes" :key="menu.path" :menu="menu" />
                    <el-menu-item index="11">
                        <el-icon>
                            <Setting />
                        </el-icon>
                        <template #title>系统管理2</template>
                    </el-menu-item>
                    <el-sub-menu index="1">
                        <template #title>
                            <el-icon>
                                <location />
                            </el-icon>
                            <span>Navigator One</span>
                        </template>
                        <el-menu-item-group title="Group One">
                            <el-menu-item index="1-1">item one</el-menu-item>
                            <el-menu-item index="1-2">item two</el-menu-item>
                        </el-menu-item-group>
                        <el-sub-menu index="1-4">
                            <template #title>item four</template>
                            <el-menu-item index="1-4-1">item one</el-menu-item>
                        </el-sub-menu>
                    </el-sub-menu>
                </el-menu>
            </el-scrollbar>
        </el-aside>
        <!-- 顶部导航 -->
        <el-container>
            <el-header class="layout-header">
                <Header />
            </el-header>
            <!-- 内容区域 -->
            <div class="layout-main">
                <Main />
            </div>
        </el-container>

    </el-container>
</template>
<script setup lang="ts">
import stores from '@/stores';
import Logo from '@/components/layout/logo/index.vue'
import MenuItem from '@/components/layout/menu-item/index.vue'
import Header from '@/components/layout/header/index.vue'

import Main from '@/components/layout/main/index.vue'
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute()
const sidebarClass = computed(() => {
    return stores.appStore.sidebarOpened ? 'aside-expend' : 'aside-compress'
})

</script>

<style scoped lang="scss">
.layout-container {
    width: 100%;
    height: 100%;

    .layout-sidebar {
        height: inherit;
        background: var(--theme-menu-bg-color);
        display: flex;
        position: relative;
        flex-direction: column;
        overflow-x: hidden !important;

        .el-scrollbar__view {
            overflow: hidden;
        }

        &.aside-expend {
            width: var(--theme-menu-width) !important;
            transition: width .3s ease;
        }

        &.aside-compress {
            width: var(--theme-menu-min-width) !important;
            transition: width .3s ease;
        }

    }

    .layout-header {
        display: flex;
        flex-direction: column;
        height: var(--theme-header-height);
    }

    .layout-main {
        position: absolute;
        top: var(--theme-header-height);
        left: var(--theme-menu-width);
        width: calc(100% - var(--theme-menu-width));
        height: calc(100vh - var(--theme-header-height));
        padding: 20px;
        overflow: auto;
        transition: all 0.3s;
    }

    .el-header {
        --el-header-padding: 0;
    }
}
</style>