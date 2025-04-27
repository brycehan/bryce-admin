import mitt, { type Emitter } from 'mitt'

export default mitt() as Emitter<any>

/**
 * mitt 事件枚举
 */
export const enum MittEvent {
  /**
   * 左侧菜单树
   */
  LeftTree = 'leftTree',
}
