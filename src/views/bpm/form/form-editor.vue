<template>
  <div
    class="h-[calc(100vh-var(--app-header-height)-var(--app-main-tabs-height)-var(--app-main-content-padding)-var(--app-main-content-padding))]"
  >
    <fc-designer
      ref="designerRef"
      class="form-designer border-b border-(--el-border-color-light)"
      :config="designerConfig"
    >
      <template #handle>
        <el-button icon="plus" type="success" size="small" plain @click="handleSave"> 保存 </el-button>
      </template>
    </fc-designer>
  </div>
  <el-dialog v-model="dialogVisible" title="保存表单" width="600">
    <el-form ref="dataFormRef" :model="state.dataForm" :rules="dataRules" label-width="80px">
      <el-form-item label="表单名称" prop="name">
        <el-input v-model="state.dataForm.name" placeholder="请输入表单名称" />
      </el-form-item>
      <el-form-item label="表单状态" prop="status">
        <dict-radio-group v-model="state.dataForm.status" dict-type="sys_status" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="state.dataForm.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="handleSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import FcDesigner from '@form-create/designer'
import type { StateOptions } from '@/utils/state'
import { reactive, ref, unref } from 'vue'
import { getByIdApi, saveOrUpdateApi } from '@/api/bpm/form'
import { ElMessage, type FormRules } from 'element-plus'
import { encodeConf, encodeFields, setConfAndFields } from '@/utils/formCreate'
import type { FormDto } from '@/types/modules/bpm'
import { useFormCreateDesigner } from '@/components/form-create'
import { StatusEnum } from '@/enums/system.ts'

defineOptions({
  name: 'BpmFormEditor',
})

const state: StateOptions = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
  },
  dataForm: {
    name: '',
    status: StatusEnum.ENABLE,
    remark: '',
  },
})

const router = useRouter() // 路由
const { query } = useRoute() // 路由信息
const { deleteView } = useTabsStore() // 视图操作

// 表单设计器配置
const designerConfig = ref({
  switchType: [], // 是否可以切换组件类型,或者可以相互切换的字段
  autoActive: true, // 是否自动选中拖入的组件
  useTemplate: false, // 是否生成vue2语法的模板组件
  formOptions: {
    form: {
      labelWidth: '100px', // 设置默认的 label 宽度为 100px
    },
  }, // 定义表单配置默认值
  fieldReadonly: false, // 配置field是否可以编辑
  hiddenDragMenu: false, // 隐藏拖拽操作按钮
  hiddenDragBtn: false, // 隐藏拖拽按钮
  hiddenMenu: [], // 隐藏部分菜单
  hiddenItem: [], // 隐藏部分组件
  hiddenItemConfig: {}, // 隐藏组件的部分配置项
  disabledItemConfig: {}, // 禁用组件的部分配置项
  showSaveBtn: false, // 是否显示保存按钮
  showConfig: true, // 是否显示右侧的配置界面
  showBaseForm: true, // 是否显示组件的基础配置表单
  showControl: true, // 是否显示组件联动
  showPropsForm: true, // 是否显示组件的属性配置表单
  showEventForm: true, // 是否显示组件的事件配置表单
  showValidateForm: true, // 是否显示组件的验证配置表单
  showFormConfig: true, // 是否显示表单配置
  showInputData: true, // 是否显示录入按钮
  showDevice: true, // 是否显示多端适配选项
  appendConfigData: [], // 定义渲染规则所需的formData
})
const designerRef = ref() // 表单设计器
useFormCreateDesigner(designerRef) // 表单设计器增强

const dialogVisible = ref(false) // 弹窗显示
const formLoading = ref(false) // 表单的加载中：提交的按钮禁用
const dataFormRef = ref()

const dataRules = reactive<FormRules>({
  name: [
    { required: true, message: '表单名称不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '长度为2~50个字符', trigger: 'blur' },
  ],
})

/**
 * 初始化详情数据
 */
const init = () => {
  // 新增表单
  const id = query.id as string
  if (!id) return

  // 修改表单
  getByIdApi(id)
    .then((res) => {
      state.dataForm = res.data
      setConfAndFields(designerRef, state.dataForm.conf, state.dataForm.fields)
    })
    .catch((reason) => {
      console.error(reason)
      setConfAndFields(designerRef, '{}', [])
    })
}

/**
 * 表单保存
 */
const handleSave = () => {
  dialogVisible.value = true
}

/**
 * 表单提交
 */
const handleSubmit = async () => {
  // 校验表单
  if (!dataFormRef.value) return
  const valid = await dataFormRef.value.validate()
  if (!valid) return

  // 开始提交请求
  formLoading.value = true
  const data = state.dataForm as FormDto
  // 表单配置
  data.conf = encodeConf(designerRef)
  // 表单字段
  data.fields = encodeFields(designerRef)

  saveOrUpdateApi(data)
    .then(() => {
      if (data.id) {
        ElMessage.success('更新成功')
      } else {
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      // 关闭当前页签
      deleteView(unref(router.currentRoute))
      // 跳转到流程列表页
      router.push({ path: '/bpm/form' })
    })
    .finally(() => {
      formLoading.value = false
    })
}

onMounted(() => {
  init()
})
</script>

<style scoped lang="scss">
::v-deep(._fc-m-con) {
  padding: 20px 20px 36px !important;
}
</style>
