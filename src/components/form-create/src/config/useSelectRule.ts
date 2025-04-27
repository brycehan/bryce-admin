import { v4 as uuidv4 } from 'uuid'
import { localeProps, makeRequiredRule } from '@/components/form-create/src/utils'
import { selectRule } from '@/components/form-create/src/config/selectRule'
import { type SelectRuleOption } from '@/components/form-create/src/type'
import { cloneDeep } from 'lodash-es'

/**
 * 通用选择器规则 hook
 *
 * @param option 规则配置
 */
export const useSelectRule = (option: SelectRuleOption) => {
  const label = option.label
  const name = option.name
  const rules = cloneDeep(selectRule)
  return {
    // 图标
    icon: option.icon,
    // 名称
    label,
    // id,唯一
    name,
    rule() {
      return {
        type: name,
        field: uuidv4(),
        title: label,
        info: '',
        $required: false,
      }
    },
    props(_: any, { t }: any) {
      if (!option.props) {
        option.props = []
      }
      return localeProps(t, name + '.props', [makeRequiredRule(), ...option.props, ...rules])
    },
  }
}
