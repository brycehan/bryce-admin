import type { App } from 'vue'
// 👇使用 form-create 需额外全局引入 element plus 组件，使用@form-create/element-ui/auto-import 自动引入后，还需要引入下面组件
import {
  ElAlert,
  ElTransfer,
  ElAside,
  ElContainer,
  ElDivider,
  ElHeader,
  ElMain,
  ElPopconfirm,
  ElTable,
  ElTableColumn,
  ElTabPane,
  ElTabs,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElBadge,
  ElTag,
  ElText,
  ElMenu,
  ElMenuItem,
  ElFooter,
  ElMessage,
  ElCollapse,
  ElCollapseItem,
  ElCard,
} from 'element-plus'
import FcDesigner from '@form-create/designer'
import formCreate from '@form-create/element-ui'
import install from '@form-create/element-ui/auto-import'
import WangEditor from '@/components/wang-editor/index.vue'
import { UploadFile, UploadImg, UploadImgs } from '@/components/upload-file'
import FormDictSelect from '@/components/form-create/src/components/FormDictSelect.vue'
import { useApiSelect } from '@/components/form-create'

const UserSelect = useApiSelect({
  name: 'UserSelect',
  labelField: 'nickname',
  valueField: 'id',
  url: '/system/user/simple-list',
})
const DeptSelect = useApiSelect({
  name: 'DeptSelect',
  labelField: 'name',
  valueField: 'id',
  url: '/system/dept/simple-list',
})
const ApiSelect = useApiSelect({
  name: 'ApiSelect',
})

const components: any[] = [
  ElAlert,
  ElTransfer,
  ElAside,
  ElContainer,
  ElDivider,
  ElHeader,
  ElMain,
  ElPopconfirm,
  ElTable,
  ElTableColumn,
  ElTabPane,
  ElTabs,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElBadge,
  ElTag,
  ElText,
  ElMenu,
  ElMenuItem,
  ElFooter,
  ElMessage,
  ElCollapse,
  ElCollapseItem,
  ElCard,
  UploadImg,
  UploadImgs,
  UploadFile,
  WangEditor,
  UserSelect,
  DeptSelect,
  FormDictSelect,
  ApiSelect,
]

// 参考 http://www.form-create.com/v3/element-ui/auto-import.html 文档
export const setupFormCreate = (app: App<Element>) => {
  components.forEach((component) => {
    app.component(component.name as string, component)
  })
  formCreate.use(install)
  app.use(formCreate)
  app.use(FcDesigner)
}
