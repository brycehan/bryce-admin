<template>
  <el-form ref="dataFormRef" :model="state.dataForm" :rules="dataRules" label-width="60" class="mr-4">
    <el-form-item label="标题" prop="title">
      <el-input v-model="state.dataForm.title" placeholder="请输入标题" />
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="类型" prop="type">
          <dict-radio-group v-model="state.dataForm.type" dict-type="sys_notice_type" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="状态" prop="status">
          <dict-radio-group v-model="state.dataForm.status" dict-type="sys_status" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="内容" prop="content">
      <wang-editor v-model="state.dataForm.content" placeholder="请输入内容" />
    </el-form-item>
  </el-form>
  <el-button @click="state.visible = false">取消</el-button>
  <el-button type="primary" @click="handleSubmit()">确定</el-button>
</template>

<script setup lang="ts">
import { getByIdApi, saveOrUpdateApi } from '@/api/system/notice'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ElMessage, type FormRules } from 'element-plus'

const emit = defineEmits(['refreshPage'])

const props = defineProps({
  noticeId: {
    type: String,
  },
})

const model = defineModel()

const state: StateOptions = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
    emit,
  },
  dataForm: {
    id: '',
    title: '',
    content: '',
    type: 0,
    status: 1,
  },
})

const dataFormRef = ref()

const dataRules = reactive<FormRules>({
  title: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2~50个字符', trigger: 'blur' },
  ],
  type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  remark: [{ min: 0, max: 500, message: '长度不能超过500个字符', trigger: 'blur' }],
})

const { getData } = crud(state)

/**
 * 初始化详情数据
 *
 * @param id ID
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
    getData(id)
  }
}

onMounted(() => {
  if (props.noticeId) {
    init(props.noticeId)
  }
})

/**
 * 表单提交
 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    handleSaveOrUpdate()
  })
}

/**
 * 表单提交
 */
const handleSaveOrUpdate = () => {
  saveOrUpdateApi(state.dataForm).then(() => {
    model.value = false
    emit('refreshPage')
    ElMessage.success('操作成功')
  })
}
</script>
