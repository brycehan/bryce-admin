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

/**
 * 给表单添加日期范围参数
 *
 * @param queryForm 表单
 * @param rangeItem 范围值
 * @param propName 属性名
 */
export const addDateRange = (queryForm: any, rangeItem: string[], propName: string) => {
    const queryParams = queryForm
    // 封装日期时间参数
    if(rangeItem.length === 2) {
        queryParams[propName + 'Start'] = rangeItem[0] + ' 00:00:00'
        queryParams[propName + 'End'] = rangeItem[1] + ' 23:59:59.999999'
    } else {
        delete queryParams[propName + 'Start']
        delete queryParams[propName + 'End']
    }
    return queryParams
}

export const mergeDefaultOptions = (defaultOptions: any, options: any) => {
    for (const key in defaultOptions) {
        if(!Object.getOwnPropertyDescriptor(options, key)) {
            options[key] = defaultOptions[key]
        }
    }
    return options
}