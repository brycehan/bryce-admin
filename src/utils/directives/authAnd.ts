import type { DirectiveBinding } from 'vue'
import { useAuthStore } from '@/stores/modules/auth'

/**
 * 自定义权限指令
 */
export default {
  mounted(el: any, binding: DirectiveBinding) {
    // binding.value 为指令的绑定值
    const { value } = binding

    if (value && value instanceof Array && value.length > 0) {
      const authStore = useAuthStore()

      // 验证是否拥有权限
      const hasPermissions = value.every((v: string) => authStore.authoritySet.includes(v))

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
         throw new Error('请设置操作权限标签值')
      }
  }
}
