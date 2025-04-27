/**
 * 对 https://github.com/xaboy/form-create-designer 封装的工具类
 */

import { isRef } from 'vue'

/**
 * 编码表单配置conf
 *
 * @param designerRef 表单设计器实例
 */
export const encodeConf = (designerRef: object) => {
  // @ts-ignore
  return JSON.stringify(designerRef.value.getOption())
}

/**
 * 编码表单字段数组fields
 *
 * @param designerRef 表单设计器实例
 */
export const encodeFields = (designerRef: object) => {
  // @ts-ignore
  const rule = designerRef.value.getRule()
  const fields: string[] = []
  rule.forEach((item: any) => {
    fields.push(JSON.stringify(item))
  })
  return fields
}

/**
 * 解码表单字段数组fields
 *
 * @param fields 字段数组
 */
export const decodeFields = (fields: string[]) => {
  const rules: object[] = []
  fields.forEach((item: string) => {
    rules.push(JSON.parse(item))
  })
  return rules
}

/**
 * 设置表单配置和字段数组
 *
 * @param designerRef 表单设计器实例
 * @param conf 表单的配置conf
 * @param fields 表单的字段数组fields
 */
export const setConfAndFields = (designerRef: object, conf: string, fields: string[]) => {
  // @ts-ignore
  designerRef.value.setOption(JSON.parse(conf))
  // @ts-ignore
  designerRef.value.setRule(decodeFields(fields))
}

/**
 * 设置表单配置和字段数组
 *
 * @param detailPreview 表单设计器实例
 * @param conf 表单的配置conf
 * @param fields 表单的字段数组fields
 * @param value 表单的值value
 */
export const setPreviewConfAndFields = (detailPreview: object, conf: string, fields: string[], value?: object) => {
  if (isRef(detailPreview)) {
    // @ts-ignore
    detailPreview = detailPreview.value
  }
  // @ts-ignore
  detailPreview.option = JSON.parse(conf)
  // @ts-ignore
  detailPreview.rule = decodeFields(fields)
  if (value) {
    // @ts-ignore
    detailPreview.value = value
  }
}
