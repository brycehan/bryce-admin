import type { DirectiveBinding } from 'vue'
import _ from 'lodash'
import { authHasAnyAuthority, authHasAnyRole, authHasAuthority, authHasRole } from '@/utils/tool.ts'

type AuthDirectiveArg = 'has-authority' | 'has-any-authority' | 'has-role' | 'has-any-role'

/**
 * 自定义权限指令
 */
export default {
  mounted(el: any, binding: DirectiveBinding) {
    // binding.value 为指令的绑定值
    const { value } = binding
    const arg = binding.arg as AuthDirectiveArg
    let hasPermission = false

    if ((_.isString(value) || _.isArray(value)) && value.length > 0) {
      switch (arg) {
        case 'has-authority':
          hasPermission = authHasAuthority(value as string)
          break
        case 'has-any-authority':
          hasPermission = authHasAnyAuthority(value)
          break
        case 'has-role':
          hasPermission = authHasRole(value as string)
          break
        case 'has-any-role':
          hasPermission = authHasAnyRole(value)
          break
        default:
          hasPermission = authHasAuthority(value as string)
      }

      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    } else {
      el.parentNode?.removeChild(el)
      throw new Error('请设置操作权限指令值')
    }
  }
}
