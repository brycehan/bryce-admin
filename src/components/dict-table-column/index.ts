import type {App} from "vue";
import DictTableColumn from "./dict-table-column.vue";

export default {
    install(Vue: App) {
        Vue.component('DictTableColumn', DictTableColumn)
    }
}