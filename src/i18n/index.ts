import { createI18n } from 'vue-i18n'
// element-plus 国际化文件
import element_zh_cn from 'element-plus/es/locale/lang/zh-cn'
import element_en from 'element-plus/es/locale/lang/en'

// 框架国际化文件
const zh_cn = import.meta.glob('./lang/**/zh-CN.ts', { eager: true })
const en_us = import.meta.glob('./lang/**/en-US.ts', { eager: true })

/**
 * 加载 lang 文件夹下的国际化
 *
 * @param modules 一个包含多个模块语言包的对象
 * @returns 返回一个语言包的对象集合
 */
export const loadLang = (modules: Record<string, any>) => {
  const messages: { [key: string]: string} = {}
  Object.keys(modules).forEach((module) => {
    Object.assign(messages, { ...modules[module].default })
  })
  return messages
}

export const messages: { [key: string]: any} = {
  'zh-CN': {
    langName: '简体中文',
    ...loadLang(zh_cn),
    el: element_zh_cn,
  },
  'en-US': {
    langName: 'English',
    ...loadLang(en_us),
    el: element_en,
  }
}

/**
 * 创建国际化(i18n)实例
 *
 * @returns 返回国际化实例
 */
 export const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  messages
})
