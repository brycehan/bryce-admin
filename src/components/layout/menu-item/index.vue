<template>
    <div>
        <el-sub-menu v-if="menu.children.length > 0" :key="menu.meta.id" :index="menu.path" :class="titleSpanClass">
            <template #title>
                <SvgIcon :icon="menu.meta.icon" />
                <span v-if="stores.appStore.sidebarOpened">{{ menu.meta.title }}</span>
            </template>
            <MenuItem v-for="item in menu.children" :key="item.path" :menu="item" />
        </el-sub-menu>
        <el-menu-item v-if="menu.children.length === 0" :key="menu.meta.id" :index="menu.path" @click="handleClick(menu)">
            <SvgIcon :icon="menu.meta.icon" />
            <template #title>
                {{ menu.meta.title }}
            </template>
        </el-menu-item>
    </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from "vue";
import { useRouter } from "vue-router";
import stores from "@/stores";
import SvgIcon from '@/components/svg-icon/index.vue'

defineProps({
    menu: {
        type: Object as PropType<any>,
        required: true
    }
})

const router = useRouter()

const titleSpanClass = computed(() => {
    return stores.appStore.sidebarOpened ? '' : 'title-hide'
})

/**
 * 菜单点击事件
 * 
 * @param menu 菜单
 */
const handleClick = (menu: any) => {

    console.log('clickM:', menu, router);

    router.push(menu.path)
    return
}

</script>

<script lang="ts">
export default {
    name: 'MenuItem'
}
</script>
<style scoped lang="scss">
/** 修复折叠样式问题 */
.title-hide {
    .el-sub-menu__title {
        display: none;
    }

    ::v-deep(.el-sub-menu__icon-arrow) {
        display: none;
    }

    // 修复图标显示问题
    ::v-deep(.svg-icon) {
        margin-left: 4px;
    }
}

/** 修复弹出菜单样式问题 */
.el-menu--popup .el-menu-item.is-active {
    position: relative;
    overflow: hidden;
    color: var(--el-color-primary);
    background-color: var(--theme-menu-hover-bg-color) !important;
    border-right: 2px solid;

    &:hover {
        color: var(--el-color-primary);
    }
}

/** 修复弹出菜单样式问题 */
.el-menu--popup .el-menu-item,
.el-sub-menu__title {
    height: 50px !important;
    overflow: hidden;
    color: var(--theme-header-text-color);

    &:hover {
        background-color: unset;
        color: var(--el-color-primary) !important;
    }
}

/** 修复弹出菜单样式问题 */
.el-menu--popup .el-sub-menu.is-active.is-opened {
    .el-sub-menu__title {
        background-color: unset !important;
    }
}
</style>
