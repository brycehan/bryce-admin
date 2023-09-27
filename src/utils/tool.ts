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

/**
 * 合并对象的默认参数
 *
 * @param defaultOptions 默认参数对象
 * @param options 目标对象
 */
export const mergeDefaultOptions = (defaultOptions: any, options: any) => {
    for (const key in defaultOptions) {
        if(!Object.getOwnPropertyDescriptor(options, key)) {
            options[key] = defaultOptions[key]
        }
    }
    return options
}

/** 获取svg图标（id）列表 */
export const getIconList = (): string[] => {
    const list: string[] = []
    const icons = document.querySelectorAll('svg symbol[id^="icon-"]')
    for(let i = 0; i < icons.length; i++){
        list.push(icons[i].id)
    }
    return list
}

/**
 * 获取字典数据列表
 *
 * @param dictList 全部字典列表
 * @param dictType 字典类型
 */
export const dictDataList = (dictList: any[], dictType: string) => {
    const dict = dictList.find((element: any) => element.dictType === dictType)
    if(dict) {
        return dict.datalist
    } else {
        return []
    }
}

/** 获取字典Label */
export const getDictLabel = (dictList: any[], dictType: string, dictValue: string) => {
  const dict = dictList.find((element: any) => element.dictType === dictType)
    if(dict) {
        const dictData = dict.datalist.find((element: any) => element.dictValue === dictValue + '')
        if(dictData) {
            return dictData.dictLabel
        }
    }
    return dictValue
}

/** 获取字典Label样式 */
export const getDictLabelClass = (dictList: any[], dictType: string, dictValue: string) => {
    const dict = dictList.find((element: any) => element.dictType === dictType)
    if(dict) {
        const dictData = dict.datalist.find((element: any) => element.dictValue === dictValue + '')
        if(dictData) {
            return dictData.labelClass
        }
    }
    return ''
}