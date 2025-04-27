import { v4 as uuidv4 } from 'uuid'
import { localeProps, makeRequiredRule } from '@/components/form-create/src/utils'

export const useEditorRule = () => {
  const label = '富文本框'
  const name = 'WangEditor'
  return {
    icon: 'icon-editor',
    label,
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
    props(_: any, { t }: { t: (key: string) => string }) {
      return localeProps(t, name + '.props', [
        makeRequiredRule(),
        {
          type: 'input',
          field: 'height',
          title: '高度',
        },
        { type: 'switch', field: 'disabled', title: '是否只读' },
      ])
    },
  }
}
