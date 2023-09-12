import type {App} from "vue";
import DictSelect from "./dict-select.vue";

export default {
    install(Vue: App) {
        Vue.component('DictSelect', DictSelect)
    }
}