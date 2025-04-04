import { TaskStatusEnum } from '@/api/bpm/task'
import * as RoleApi from '@/api/system/role'
import * as DeptApi from '@/api/system/dept'
import * as PostApi from '@/api/system/post'
import * as UserApi from '@/api/system/user'
import * as UserGroupApi from '@/api/bpm/userGroup.ts'
import {
  type SimpleFlowNode,
  CandidateStrategy,
  NodeType,
  ApproveMethodType,
  RejectHandlerType,
  NODE_DEFAULT_NAME,
  AssignStartUserHandlerType,
  AssignEmptyHandlerType,
  FieldPermissionType,
  type HttpRequestParam,
  ProcessVariableEnum
} from './consts'
// import { parseFormFields } from '@/components/FormCreate/src/utils'
// import { parseFormFields } from '@form-create/designer/src/utils/index'
import { inject, ref, toRaw, unref, watch, type Ref } from 'vue'


// 解析 formCreate 所有表单字段, 并返回
const parseFormCreateFields = (formFields?: string[]) => {
  const result: Array<Record<string, any>> = []
  if (formFields) {
    formFields.forEach((fieldStr: string) => {
      // parseFormFields(JSON.parse(fieldStr), result)
      //  parseFormFields 引入问题
    })
  }
  return result
}

/**
 * @description 表单数据权限配置，用于发起人节点 、审批节点、抄送节点
 */
export function useFormFieldsPermission(defaultPermission: FieldPermissionType) {
  // 字段权限配置. 需要有 field, title,  permissioin 属性
  const fieldsPermissionConfig = ref<Array<Record<string, any>>>([])

  const formType = inject<Ref<number | undefined>>('formType', ref()) // 表单类型

  const formFields = inject<Ref<string[]>>('formFields', ref([])) // 流程表单字段

  const getNodeConfigFormFields = (nodeFormFields?: Array<Record<string, string>>) => {
    nodeFormFields = toRaw(nodeFormFields)
    if (!nodeFormFields || nodeFormFields.length === 0) {
      fieldsPermissionConfig.value = getDefaultFieldsPermission(unref(formFields))
    } else {
      fieldsPermissionConfig.value = mergeFieldsPermission(nodeFormFields, unref(formFields))
    }
  }
  // 合并已经设置的表单字段权限，当前流程表单字段 (可能新增，或删除了字段)
  const mergeFieldsPermission = (
    formFieldsPermisson: Array<Record<string, string>>,
    formFields?: string[]
  ) => {
    let mergedFieldsPermission: Array<Record<string, any>> = []
    if (formFields) {
      mergedFieldsPermission = parseFormCreateFields(formFields).map((item) => {
        const found = formFieldsPermisson.find(
          (fieldPermission) => fieldPermission.field == item.field
        )
        return {
          field: item.field,
          title: item.title,
          permission: found ? found.permission : defaultPermission
        }
      })
    }
    return mergedFieldsPermission
  }

  // 默认的表单权限： 获取表单的所有字段，设置字段默认权限为只读
  const getDefaultFieldsPermission = (formFields?: string[]) => {
    let defaultFieldsPermission: Array<Record<string, any>> = []
    if (formFields) {
      defaultFieldsPermission = parseFormCreateFields(formFields).map((item) => {
        return {
          field: item.field,
          title: item.title,
          permission: defaultPermission
        }
      })
    }
    return defaultFieldsPermission
  }

  // 获取表单的所有字段，作为下拉框选项
  const formFieldOptions = parseFormCreateFields(unref(formFields))

  return {
    formType,
    fieldsPermissionConfig,
    formFieldOptions,
    getNodeConfigFormFields
  }
}
