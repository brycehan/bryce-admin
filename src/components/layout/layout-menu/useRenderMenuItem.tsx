import { ElMenuItem, ElSubMenu } from 'element-plus'
import { useRenderMenuTitle } from '@/components/layout/layout-menu/useRenderMenuTitle.tsx'
import { isExternalLink, replaceLinkParam } from '@/utils/tool.ts'

const { renderMenuTitle, renderMenuAllTitle, renderMenuDefault } = useRenderMenuTitle()

export const useRenderMenuItem = () => {
  const router = useRouter()

  /**
   * 菜单点击事件
   *
   * @param menu 菜单
   */
  const handleClick = (menu: any) => {
    if (!useAuthStore().permitAccess()) return

    // 不是新开页面，则直接切换路由
    if (!menu.meta.openStyle) {
      void router.push(menu.path)
      return
    }

    // 新开页面逻辑
    if (isExternalLink(menu.path)) {
      // 外链
      window.open(replaceLinkParam(menu.path), '_blank')
    } else {
      // 内部组件
      window.open(menu.path, '_blank')
    }
  }

  const renderMenuItem = (routers: any[]) => {
    return routers
      .filter((menu) => menu.meta?.visible === 1)
      .map((menu) => {
        const meta = menu.meta ?? {}
        if (menu.meta.type === 'C') {
          return (
            <ElSubMenu index={meta.id}>
              {{
                title: () => renderMenuAllTitle(menu.meta),
                default: () => renderMenuItem(menu.children),
              }}
            </ElSubMenu>
          )
        } else if (menu.meta.type === 'M') {
          return (
            <ElMenuItem index={menu.path} onClick={() => handleClick(menu)}>
              {{
                title: () => renderMenuTitle(menu.meta),
                default: () => renderMenuDefault(menu.meta),
              }}
            </ElMenuItem>
          )
        }
      })
  }
  return { renderMenuItem }
}
