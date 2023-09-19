import stores from "@/stores";
import type {DirectiveBinding} from "vue";

/**
 * 自定义权限指令
 */
export default {

    mounted(el : any, binding : DirectiveBinding) {
        // binding.value 为指令的绑定值
        if(binding.value) {
            if(!stores.authStore.authoritySet.some((v: string) => v === binding.value)) {
                el.parentNode.removeChild(el)
            }
        }
    }
}