import constant from '@/utils/constant'

/**
 * 是否外链
 *
 * @param url 资源地址
 */
export const isExternalLink = (url: string): boolean => {
  return /^(https?:\/\/|^{{\s?apiUrl\s?}})/.test(url)
}

export const replaceLinkParam = (url: string): string => {
  return url.replace('{{apiUrl}}', constant.apiUrl)
}

/**
 * 替换英文逗号
 *
 * @param str 需要替换的字符串
 * @param replaceValue 将英文逗号替换成的字符串
 */
export const replaceComma = (str: string, replaceValue: string) => {
  if (!str) {
    return str
  }

  return str.replace(',', replaceValue)
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
  if (rangeItem.length === 2) {
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
    if (!Object.getOwnPropertyDescriptor(options, key)) {
      options[key] = defaultOptions[key]
    }
  }
  return options
}

/**
 * 转换文件大小样式
 *
 * @param size 文件大小字节数
 */
export const convertSizeFormat = (size: number): string => {
  const unit = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const index = Math.floor(Math.log(size) / Math.log(1024))
  const normalSize = size / Math.pow(1024, index)
  // 保留2位小数位数
  return normalSize.toFixed(2) + ' ' + unit[index]
}

/**
 * 获取svg图标（id）列表
 */
export const getIconList = (): string[] => {
  const list: string[] = []
  const icons = document.querySelectorAll('svg symbol[id^="icon-"]')
  for (let i = 0; i < icons.length; i++) {
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
  if (dict) {
    return dict.datalist
  } else {
    return []
  }
}

/**
 * 获取字典Label
 */
export const getDictLabel = (dictList: any[], dictType: string, dictValue: string) => {
  const dict = dictList.find((element: any) => element.dictType === dictType)
  if (dict) {
    const dictData = dict.datalist.find((element: any) => element.dictValue === dictValue + '')
    if (dictData) {
      return dictData.dictLabel
    }
  }
  return dictValue
}

/**
 * 获取字典Label样式
 */
export const getDictLabelClass = (dictList: any[], dictType: string, dictValue: string) => {
  const dict = dictList.find((element: any) => element.dictType === dictType)
  if (dict) {
    const dictData = dict.datalist.find((element: any) => element.dictValue === dictValue + '')
    if (dictData) {
      return dictData.labelClass
    }
  }
  return ''
}

/**
 * 判断是否为数字
 *
 * @param value 待判断的字符串
 */
export const isNumeric = (value: string) => {
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
}

/**
 * 转换为整数
 *
 * @param value 待转换的值
 */
export const convertInteger = (value: string) => {
  return isNumeric(value) ? parseInt(value) : value
}

/**
 * 手机号正则表达式
 */
export const phoneRegExp = /^1[3-9]\d{9}$/

/**
 * 邮箱正则表达式
 */
export const emailRegExp = /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/
