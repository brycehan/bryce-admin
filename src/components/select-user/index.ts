import type {App} from "vue";
import SelectUser from "./select-user.vue";

export default {
    install(Vue: App) {
        Vue.component('SelectUser', SelectUser)
    }
}