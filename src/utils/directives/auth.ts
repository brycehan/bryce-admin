import type { DirectiveBinding } from 'vue'
import { useAuthStore } from '@/stores/modules/auth'

/**
 * 自定义权限指令
 */
export default {
  mounted(el: any, binding: DirectiveBinding) {
    // binding.value 为指令的绑定值
    if (binding.value) {
      const authStore = useAuthStore()

      if (!authStore.authoritySet.some((v: string) => v === binding.value)) {
        el.parentNode.removeChild(el)
      }
    }
  }
}
