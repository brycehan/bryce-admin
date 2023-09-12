import type {App} from "vue";
import SvgIcon from "./svg-icon.vue";

export default {
    install(Vue: App) {
        Vue.component('SvgIcon', SvgIcon)
    }
}