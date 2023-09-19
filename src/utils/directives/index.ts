import auth from "@/utils/directives/auth";
import type {App} from "vue";

export default {
    install(Vue: App) {
        Vue.directive('auth', auth)
    }
}