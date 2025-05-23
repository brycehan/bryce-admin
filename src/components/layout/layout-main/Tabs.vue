<template>
  <el-header class="flex !h-[var(--app-main-tabs-height)] bg-white !px-0 dark:bg-[var(--el-bg-color-overlay)]">
    <div class="tabs-item px-2">
      <el-tabs v-model="activeTabName" class="tabs-item-style" @tab-click="tabClick" @tab-remove="tabRemove as any">
        <el-tab-pane
          v-for="tab in tabsStore.visitedViews"
          :key="tab"
          :label="tab.meta.i18n ? t(tab.title) : tab.title"
          :name="tab.path"
          :closable="!isAffix(tab)"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <el-dropdown class="tabs-action shrink-0" trigger="click" placement="bottom-end" @command="onClose">
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :icon="Close" command="close">{{ t('main.tabs.close') }}</el-dropdown-item>
          <el-dropdown-item :icon="CircleClose" command="closeOthers">{{
            t('main.tabs.closeOthers')
          }}</el-dropdown-item>
          <el-dropdown-item :icon="CircleCloseFilled" command="closeAll">{{
            t('main.tabs.closeAll')
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
      <icon icon="ep:arrow-down" aria-hidden="false" />
    </el-dropdown>
  </el-header>
</template>

<script setup lang="ts">
import { Close, CircleClose, CircleCloseFilled } from '@element-plus/icons-vue'
import { closeTab, closeOthersTabs, closeAllTabs } from '@/utils/tabs'
import type { TabsPaneContext } from 'element-plus'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const routerStore = useRouterStore()
const authStore = useAuthStore()
const { t } = useI18n()

const activeTabName = ref(route.path)

watch(route, () => {
  // 当前路由添加到标签页里
  if (route.name) {
    addTab()
  }
})

/**
 * 初始化固定标签页
 */
const initTabs = () => {
  const affixTabs = getAffixTabs(routerStore.routes)
  for (const tab of affixTabs) {
    // 需要有标签名称
    if (tab.name) {
      tabsStore.addView(tab)
    }
  }
}

/**
 * 获取需要固定的标签
 *
 * @param routes 路由配置数组，包含各个路由的路径、名称和元数据等信息
 * @returns 返回一个包含所有affix标签页信息的数组
 */
const getAffixTabs = (routes: any) => {
  let affixTabs: any[] = []
  routes.forEach((route: any) => {
    if (route.meta && route.meta.affix) {
      affixTabs.push({
        fullPath: route.path,
        path: route.path,
        name: route.name,
        meta: { ...route.meta },
      })
    }
    if (route.children) {
      const tempTabs = getAffixTabs(route.children)
      if (tempTabs.length >= 1) {
        affixTabs = [...affixTabs, ...tempTabs]
      }
    }
  })
  return affixTabs
}

/**
 * 添加标签页
 */
const addTab = () => {
  tabsStore.addView(route)
  tabsStore.addCachedView(route)
  activeTabName.value = route.path
}
/**
 * 判断标签页是否固定
 *
 * @param tab 标签页对象
 */
const isAffix = (tab: any) => {
  return tab.meta && tab.meta.affix
}

/**
 * 标签页被选中
 *
 * @param tab 标签页对象
 */
const tabClick = (tab: TabsPaneContext) => {
  if (!authStore.permitAccess()) return
  if (tab.props.name) router.push(tab.props.name as string)
}

/**
 * 点击关闭标签页回调
 *
 * @param path 路径
 */
const tabRemove = (path: string) => {
  const tab = tabsStore.visitedViews.filter((tab: any) => tab.path === path)
  closeTab(router, tab[0])
}

/**
 * dropdown 关闭回调
 *
 * @param type 关闭类型
 */
const onClose = (type: string) => {
  switch (type) {
    case 'close':
      closeTab(router, route)
      break
    case 'closeOthers':
      closeOthersTabs(router, route)
      break
    case 'closeAll':
      closeAllTabs(router, route)
      break
    default:
      break
  }
}

onMounted(() => {
  initTabs()
  addTab()
})
</script>

<style lang="scss" scoped>
.tabs-item {
  flex-grow: 1;
  overflow: hidden;
  border-bottom: var(--el-border-color-light) 2px solid;
  transition: left 0.3s;

  // 往前图标样式
  ::v-deep(.el-tabs__nav-prev) {
    padding: 0 10px;
    border-right: var(--el-border-color-extra-light);
  }

  // 往后图标样式
  ::v-deep(.el-tabs__nav-next) {
    padding: 0 10px;
    border-right: var(--el-border-color-extra-light);
  }

  ::v-deep(.is-scrollable) {
    padding: 0 32px;
  }

  // 关闭图标样式
  ::v-deep(.el-tabs__item) {
    .is-icon-close {
      &:hover {
        color: var(--el-color-primary-light-9);
        background-color: var(--el-color-primary);
      }
    }
  }
}

.tabs-item-style {
  ::v-deep(.el-tabs__item) {
    padding: 0 15px !important;
    color: #8c8c8c;
    user-select: none;
    border-right: var(--el-border-color-extra-light) 1px solid;

    &:hover {
      color: #444;
      background: rgb(0 0 0 / 2%);
    }

    &.is-active {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);

      // 当前标签页图标样式
      &::before {
        background-color: var(--el-color-primary);
      }
    }

    &::before {
      display: inline-block;
      width: 0.625rem;
      height: 0.625rem;
      margin-right: 0.5rem;
      content: '';
      background-color: #ddd;
      border-radius: 50%;
    }
  }
}

.tabs-action {
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: var(--app-main-tabs-height);
  line-height: var(--app-main-tabs-height);
  color: #666;
  cursor: pointer;
  border-right: var(--el-border-color-extra-light) 1px solid;
  border-bottom: var(--el-border-color-light) 2px solid;
  border-left: var(--el-border-color-extra-light) 1px solid;
}
</style>
