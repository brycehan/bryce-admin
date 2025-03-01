<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增表单定义' : '修改表单定义'"
    :close-on-click-modal="false"
    :append-to-body="false"
    fullscreen
  >
    <fc-designer class="form-designer" ref="designerRef" height="100vh" :config="designerConfig">
      <template #handle>
        <el-button icon="plus" type="success" size="small" plain @click="handleSave()">
          保存
        </el-button>
      </template>
    </fc-designer>
  </el-dialog>
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
import { reactive, ref } from 'vue'
import { type FormVo, getByIdApi, saveOrUpdateApi } from '@/api/bpm/form'
import { ElMessage, type FormRules } from 'element-plus'
import { encodeConf, encodeFields, setConfAndFields } from '@/utils/formCreate'

defineOptions({
  name: 'BpmFormEditor'
})

const emit = defineEmits(['refreshPage'])

const state: StateOptions  = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
  },
  dataForm: {
    name: '',
    status: 1,
    remark: ''
  }
})

const designerRef = ref()

const dialogVisible = ref(false) // 弹窗显示
const formLoading = ref(false) // 表单加载中
const dataFormRef = ref()

const designerConfig = ref({
  switchType: [], // 是否可以切换组件类型,或者可以相互切换的字段
  autoActive: true, // 是否自动选中拖入的组件
  useTemplate: false, // 是否生成vue2语法的模板组件
  formOptions: {
    form: {
      labelWidth: '100px' // 设置默认的 label 宽度为 100px
    }
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
  appendConfigData: [] // 定义渲染规则所需的formData
})

const dataRules = reactive<FormRules>({
  name: [
    { required: true, message: '表单名称不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '长度为2~50个字符', trigger: 'blur' }
  ]
})

/**
 * 初始化详情数据
 *
 * @param id 主键ID
 */
const init = (id?: string) => {
  state.visible = true
  state.dataForm.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // id 存在则为修改
  if (id) {
    getByIdApi(id).then((res) => {
      state.dataForm = res.data
      setConfAndFields(designerRef, state.dataForm.conf, JSON.parse(state.dataForm.fields))
    }).catch((reason) => {
      console.info(reason)
      setConfAndFields(designerRef, '{}', [])
    })
  } else {
    setConfAndFields(designerRef, '{}', [])
  }
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
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    formLoading.value = true // 开始提交请求
  })
  const data = state.dataForm as FormVo
  // 表单配置
  data.conf = encodeConf(designerRef)
  // 表单字段
  data.fields = JSON.stringify(encodeFields(designerRef))

  saveOrUpdateApi(data).then(() => {
    if (data.id) {
      ElMessage.success('更新成功')
    } else {
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    state.visible = false
    emit('refreshPage')
  }).finally(() => {
    formLoading.value = false
  })
}

defineExpose({
  init
})
</script>
