<template>
  <RenderMenuWrap />
</template>
<script setup lang="tsx">
import { ElMenu, ElScrollbar } from 'element-plus'
import { useRenderMenuItem } from '@/components/layout/layout-menu/useRenderMenuItem.tsx'
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const props = defineProps<{
  menuRoutes: RouteRecordRaw[] // 根据实际路由类型调整
}>()

const router = useRouter()
const appStore = useAppStore()
const layout = computed(() => appStore.theme.layout)

const menuMode = computed((): 'vertical' | 'horizontal' => {
  if ('horizontalTwo' === unref(layout)) {
    return 'horizontal'
  } else {
    return 'vertical'
  }
})

/**
 * 激活菜单
 */
const activeMenu = computed(() => {
  const { meta, path } = unref(router.currentRoute)
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path
})

const RenderMenuWrap = () => {
  if (unref(layout) === 'horizontalTwo') {
    return renderMenu()
  } else {
    return (
      <ElScrollbar
        class={[
          unref(layout) === 'vertical' && !appStore.theme.showLogo
            ? '!h-dvh'
            : '!h-[calc(100dvh-var(--app-header-height))]',
          {
            'bg-white dark:border-r dark:border-[var(--app-border-color)] dark:bg-[var(--el-bg-color-overlay)]':
              appStore.theme.layout === 'column',
          },
        ]}
      >
        {renderMenu()}
      </ElScrollbar>
    )
  }
}

const renderMenu = () => {
  return (
    <ElMenu
      class={[
        {
          'column-menu !border-gray-100 dark:!border-r-0': unref(layout) === 'column',
          '!border-r-0': unref(layout) === 'vertical' || unref(layout) === 'horizontalOne',
        },
      ]}
      defaultActive={unref(activeMenu)}
      mode={unref(menuMode)}
      collapse={unref(menuMode) === 'horizontal' ? false : !appStore.sidebarOpened}
      uniqueOpened={unref(menuMode) === 'horizontal' ? false : appStore.theme.uniqueOpened}
      collapseTransition={false}
      popperClass={unref(menuMode) === 'vertical' ? 'menu-popup-vertical' : 'menu-popup-horizontal'}
    >
      {{
        default: () => {
          const { renderMenuItem } = useRenderMenuItem()
          return renderMenuItem(unref(props.menuRoutes))
        },
      }}
    </ElMenu>
  )
}
</script>

<style lang="scss" scoped>
// 菜单样式
::v-deep(.el-menu) {
  // 子菜单样式
  .el-sub-menu {
    .el-sub-menu__title:hover {
      color: var(--el-menu-hover-text-color);
    }

    &.is-active > .el-sub-menu__title {
      color: var(--el-menu-active-color);
    }
  }

  // 菜单项样式
  .el-menu-item {
    overflow: hidden; /* 隐藏溢出内容 */

    &:hover {
      color: var(--el-menu-hover-text-color);
    }

    &.is-active {
      background-color: var(--app-aside-active-bg-color);
      border-right: 0;
    }
  }
}

// 列布局中间栏菜单样式
.column-menu {
  display: block;
  width: 160px;
  height: 100%;
  overflow: hidden;
  background: white;

  // 子菜单样式
  ::v-deep(.el-sub-menu) {
    font-size: 14px !important;
    color: var(--el-menu-text-color);
    background-color: transparent;

    .el-sub-menu__title {
      height: 40px !important;
      font-size: 14px !important;
      line-height: 40px !important;
      color: var(--el-menu-text-color);
      background-color: transparent;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    &.is-active > .el-sub-menu__title {
      color: var(--el-menu-active-color);
    }
  }

  // 菜单项样式
  ::v-deep(.el-menu-item) {
    height: 40px !important;
    font-size: 14px !important;
    line-height: 40px !important;
    color: var(--el-menu-text-color);
    background-color: transparent;

    &:hover {
      color: var(--el-color-primary);
    }

    &.is-active {
      color: var(--el-menu-active-color);
      background-color: var(--app-aside-active-bg-color);
    }
  }
}
</style>

<style lang="scss">
:root {
  // 菜单
  --el-menu-bg-color: transparent;
  --el-menu-hover-bg-color: transparent;
  --el-menu-item-height: var(--app-header-height);
}

.dark,
.dark .header-default,
.dark .header-primary {
  --app-logo-text-color-dark: #eee;
  --el-menu-active-color: #eee;
  --el-menu-text-color: rgb(255 255 255 / 66%);
  --el-menu-hover-text-color: #eee;
}

// 侧边栏弹出菜单
.menu-popup-vertical {
  --el-menu-item-height: 36px;

  //  三级子菜单项高度 和 顶栏弹出菜单 高度一致
  .el-sub-menu .el-menu-item {
    height: var(--el-menu-horizontal-sub-item-height);
  }

  // 子菜单目录
  .el-sub-menu.is-active > .el-sub-menu__title {
    color: var(--el-menu-active-color);
    background-color: unset;
  }

  // 子菜单项
  .el-menu-item.is-active {
    background-color: var(--app-aside-active-bg-color);
  }

  .el-menu-item:hover {
    color: var(--el-color-primary);
  }

  .el-sub-menu__title:hover {
    color: var(--el-color-primary);
    background: unset;
  }
}

// 顶部菜单
.el-menu--horizontal {
  --el-menu-horizontal-height: var(--app-header-height);
}

.el-menu--horizontal > .el-sub-menu.is-active .el-sub-menu__title {
  border-bottom: 2px solid var(--el-color-primary);
}

// 顶部弹出菜单
.menu-popup-horizontal {
  // 子菜单目录
  .el-sub-menu__title:hover {
    color: var(--el-color-primary);
  }

  // 子菜单项
  .el-menu-item.is-active {
    background-color: var(--app-aside-active-bg-color);
  }
}
</style>
