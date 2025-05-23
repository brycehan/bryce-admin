import constant from '@/utils/constant'
import { ElMessage, type UploadProps, type UploadRawFile } from 'element-plus'
import _ from 'lodash'

/**
 * 获取默认语言
 */
export const getDefaultLanguage = () => {
  const appStore = useAppStore()
  let locale = appStore.language
  if (!locale) {
    console.log('获取浏览器默认语言', navigator.language)
    if (navigator.language.toLowerCase().indexOf('zh') > -1) {
      locale = 'zh-CN'
    } else {
      locale = 'en-US'
    }
  }
  return locale
}

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
 * 上传文件前处理
 */
export const handleBeforeUpload: UploadProps['beforeUpload'] = (file: UploadRawFile) => {
  if (file.size / 1024 / 1024 / 1024 > 1) {
    ElMessage.error('文件大小不能超过1GB')
    return false
  }
  return true
}

/**
 * 判断是否为数字
 *
 * @param value 待判断的字符串
 */
export const isNumeric = (value: string) => {
  return !isNaN(parseFloat(value)) && isFinite(Number(value))
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
 * 权限验证
 * 用于slot下 v-auth:has-authority 无效下使用
 *
 * @param authority 权限标识 例如 'system:user:save'
 */
export const authHasAuthority = (authority: string | string[]) => {
  if (authority.length === 0) return false

  const authStore = useAuthStore()
  const roleSuperAdmin = 'ROLE_SUPER_ADMIN'

  // 判断是否是字符串时
  if (_.isString(authority)) {
    return authStore.authoritySet.some((v: string) => v === roleSuperAdmin || v === authority)
  }

  // 是数组时
  const authSet = new Set(authStore.authoritySet)
  return authority.every((v: string) => authSet.has(roleSuperAdmin) || authSet.has(v))
}

/**
 * 权限验证
 * 用于slot下 v-auth:has-any-authority 无效下使用
 *
 * @param authority 权限标识 例如 'system:user:save' 或 ['system:user:save', 'system:user:update']
 */
export const authHasAnyAuthority = (authority: string | string[]) => {
  if (authority.length === 0) return false

  const authStore = useAuthStore()
  const roleSuperAdmin = 'ROLE_SUPER_ADMIN'

  // 判断是否是字符串时
  if (_.isString(authority)) {
    return authStore.authoritySet.some((v: string) => v === roleSuperAdmin || v === authority)
  }

  // 是数组时
  return authStore.authoritySet.some((v: string) => v === roleSuperAdmin || authority.includes(v))
}

/**
 * 判断是否拥有指定的角色
 *
 * @param role 角色编码
 */
export const authHasRole = (role: string | string[]) => {
  if (role.length === 0) return false

  const authStore = useAuthStore()
  const roleSuperAdmin = 'SUPER_ADMIN'

  // 判断是否是字符串时
  if (_.isString(role)) {
    return authStore.roleSet.some((v: string) => v === roleSuperAdmin || v === role)
  }

  // 是数组时
  const authSet = new Set(authStore.roleSet)
  return role.every((v: string) => authSet.has(roleSuperAdmin) || authSet.has(v))
}

/**
 * 判断是否拥有任一指定的角色
 *
 * @param role 角色编码
 */
export const authHasAnyRole = (role: string | string[]) => {
  if (role.length === 0) return false

  const authStore = useAuthStore()
  const roleSuperAdmin = 'SUPER_ADMIN'

  // 判断是否是字符串时
  if (_.isString(role)) {
    return authStore.roleSet.some((v: string) => v === roleSuperAdmin || v === role)
  }

  // 是数组时
  return authStore.roleSet.some((v: string) => v === roleSuperAdmin || role.includes(v))
}

/**
 * 设置css变量
 *
 * @param prop css变量
 * @param value 值
 * @param dom 节点
 */
export const setCssVar = (prop: string, value: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, value)
}

/**
 * 手机号正则表达式
 */
export const phoneRegExp = /^1[3-9]\d{9}$/

/**
 * 邮箱正则表达式
 */
export const emailRegExp = /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/
