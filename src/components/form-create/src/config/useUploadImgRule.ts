import { v4 as uuidv4 } from 'uuid'
import { localeProps, makeRequiredRule } from '@/components/form-create/src/utils'

export const useUploadImgRule = () => {
  const label = '单图上传'
  const name = 'UploadImg'
  return {
    icon: 'icon-upload',
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
          type: 'switch',
          field: 'drag',
          title: '拖拽上传',
          value: false,
        },
        {
          type: 'select',
          field: 'fileType',
          title: '图片类型限制',
          value: ['image/jpeg', 'image/png', 'image/gif'],
          options: [
            { label: 'image/apng', value: 'image/apng' },
            { label: 'image/bmp', value: 'image/bmp' },
            { label: 'image/gif', value: 'image/gif' },
            { label: 'image/jpeg', value: 'image/jpeg' },
            { label: 'image/pjpeg', value: 'image/pjpeg' },
            { label: 'image/svg+xml', value: 'image/svg+xml' },
            { label: 'image/tiff', value: 'image/tiff' },
            { label: 'image/webp', value: 'image/webp' },
            { label: 'image/x-icon', value: 'image/x-icon' },
          ],
          props: {
            multiple: true,
          },
        },
        {
          type: 'inputNumber',
          field: 'fileSize',
          title: '大小限制(MB)',
          value: 5,
          props: { min: 0 },
        },
        {
          type: 'input',
          field: 'height',
          title: '组件高度',
          value: '150px',
        },
        {
          type: 'input',
          field: 'width',
          title: '组件宽度',
          value: '150px',
        },
        {
          type: 'input',
          field: 'borderradius',
          title: '组件边框圆角',
          value: '8px',
        },
        {
          type: 'switch',
          field: 'disabled',
          title: '是否显示删除按钮',
          value: true,
        },
        {
          type: 'switch',
          field: 'showBtnText',
          title: '是否显示按钮文字',
          value: true,
        },
      ])
    },
  }
}
