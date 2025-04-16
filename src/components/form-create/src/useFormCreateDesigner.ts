import {
  useDictSelectRule,
  useEditorRule,
  useSelectRule,
  useUploadFileRule,
  useUploadImgRule,
  useUploadImgsRule
} from './config'
import { type Ref } from 'vue'
import { type Menu } from '@/components/form-create/src/type'
import { apiSelectRule } from '@/components/form-create/src/config/selectRule'
import { onMounted } from 'vue'

/**
 * 表单设计器增强 hook
 * 新增
 * - 富文本框
 * - 文件上传
 * - 单图上传
 * - 多图上传
 * - 用户选择器
 * - 部门选择器
 * - 字典选择器
 * - 接口选择器
 */
export const useFormCreateDesigner = async (designer: Ref) => {
  const editorRule = useEditorRule()
  const uploadFileRule = useUploadFileRule()
  const uploadImgRule = useUploadImgRule()
  const uploadImgsRule = useUploadImgsRule()

  /**
   * 构建表单组件
   */
  const buildFormComponents = () => {
    // 移除自带的上传组件规则，使用 uploadFileRule、uploadImgRule、uploadImgsRule 替代
    designer.value?.removeMenuItem('upload')
    // 移除自带的富文本组件规则，使用 editorRule 替代
    designer.value?.removeMenuItem('fcEditor')
    const components = [editorRule, uploadFileRule, uploadImgRule, uploadImgsRule]
    components.forEach((component) => {
      // 插入组件规则
      designer.value?.addComponent(component)
      // 插入拖拽按钮到 `main` 分类下
      designer.value?.appendMenuItem('main', {
        icon: component.icon,
        name: component.name,
        label: component.label
      })
    })
  }

  const userSelectRule = useSelectRule({
    name: 'UserSelect',
    label: '用户选择器',
    icon: 'icon-[ion--person-outline]'
  })
  const deptSelectRule = useSelectRule({
    name: 'DeptSelect',
    label: '部门选择器',
    icon: 'icon-[ion--people-outline]'
  })
  const dictSelectRule = useDictSelectRule()
  const apiSelectRule0 = useSelectRule({
    name: 'ApiSelect',
    label: '接口选择器',
    icon: 'icon-[ion--copy-outline]',
    props: [...apiSelectRule]
  })

  /**
   * 构建系统字段菜单
   */
  const buildSystemMenu = () => {
    const components = [userSelectRule, deptSelectRule, dictSelectRule, apiSelectRule0]
    const menu: Menu = {
      name: 'system',
      title: '系统字段',
      list: components.map((component) => {
        // 插入组件规则
        designer.value?.addComponent(component)
        // 插入拖拽按钮到 `system` 分类下
        return {
          icon: component.icon,
          name: component.name,
          label: component.label
        }
      })
    }
    designer.value?.addMenu(menu)
  }

  onMounted(async () => {
    await nextTick()
    buildFormComponents()
    buildSystemMenu()
  })
}
