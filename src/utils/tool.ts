import type {App, Plugin} from "vue";

/**
 * 全局组件安装
 * 
 * @param component 组件
 * @param alias 别名
 */
export const install = <T>(component: T, alias?: string) => {
    const comp = component as any

    comp.install = (app: App) => {
        app.component(comp.name || comp.displayName, comp)
        if(alias) {
            app.config.globalProperties[alias] = component
        }
    }
    return component as T & Plugin
}