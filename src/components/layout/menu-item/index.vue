<template>
  <el-sub-menu
    v-if="menu.meta.type === 'C'"
    :key="menu.meta.id"
    :index="menu.path"
    :class="titleSpanClass"
  >
    <template #title>
      <SvgIcon v-if="showIcon" :icon="menu.meta.icon" />
      <span>{{ menu.meta.title }}</span>
    </template>
    <menu-item v-for="item in menu.children" :key="item.path" :menu="item" />
  </el-sub-menu>
  <el-menu-item
    v-if="menu.meta.type === 'M'"
    :key="menu.meta.id"
    :index="menu.path"
    @click="handleClick(menu)"
  >
    <SvgIcon v-if="showIcon" :icon="menu.meta.icon" />
    <template #title>
      {{ menu.meta.title }}
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '@/components/svg-icon/svg-icon.vue'
import { isExternalLink, replaceLinkParam } from '@/utils/tool'
import { useAppStore } from '@/stores/modules/app'
import MenuItem from '@/components/layout/menu-item/index.vue'

defineOptions({
  name: 'MenuItem'
})

defineProps({
  menu: {
    type: Object as PropType<any>,
    required: true
  }
})

const router = useRouter()
const appStore = useAppStore()

/**
 * 菜单图标显示控制
 */
const showIcon = computed(() => {
  return !appStore.sidebarOpened || appStore.theme.layout !== 'column'
})

const titleSpanClass = computed(() => {
  return appStore.sidebarOpened || appStore.theme.layout === 'horizontal' ? '' : 'title-hide'
})

/**
 * 菜单点击事件
 *
 * @param menu 菜单
 */
const handleClick = (menu: any) => {
  // 不是新开页面，则直接切换路由
  if (!menu.meta.openStyle) {
    router.push(menu.path)
    return
  }

  // 新开页面逻辑
  if (isExternalLink(menu.meta.url)) {
    // 外链
    window.open(replaceLinkParam(menu.meta.url), '_blank')
  } else {
    // 内部组件
    window.open('/' + menu.meta.url, '_blank')
  }
}
</script>
