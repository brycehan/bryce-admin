import type { RouteMeta } from 'vue-router'
import { Icon } from '@iconify/vue/offline'

export const useRenderMenuTitle = () => {
  const renderMenuTitle = (meta: RouteMeta) => {
    const { title = 'Please set title' } = meta

    return (
      <>
        <span>{title}</span>
      </>
    )
  }

  const renderMenuAllTitle = (meta: RouteMeta) => {
    const { title = 'Please set title' } = meta
    const appStore = useAppStore()
    /**
     * 菜单图标显示控制
     */
    const showIcon = computed(() => {
      return !appStore.sidebarOpened || appStore.theme.layout !== 'column'
    })

    return showIcon ? (
      <>
        <Icon icon={meta.icon as string} class="el-icon text-base"></Icon>
        <span>{title}</span>
      </>
    ) : (
      <>
        <span>{title}</span>
      </>
    )
  }

  const renderMenuDefault = (meta: RouteMeta) => {
    const appStore = useAppStore()
    /**
     * 菜单图标显示控制
     */
    const showIcon = computed(() => {
      return !appStore.sidebarOpened || appStore.theme.layout !== 'column'
    })

    return showIcon ? (
      <>
        <Icon icon={meta.icon as string} class="el-icon text-base"></Icon>
      </>
    ) : (
      <></>
    )
  }

  return { renderMenuTitle, renderMenuAllTitle, renderMenuDefault }
}
