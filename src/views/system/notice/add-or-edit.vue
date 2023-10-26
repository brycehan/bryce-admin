<template>
    <el-form
      ref="dataFormRef"
      :model="state.dataForm"
      :rules="dataRules"
      label-width="60px"
      @keyup.enter="handleSubmit()"
      class="mr-4"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="state.dataForm.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <WangEditor v-model="state.dataForm.content" placeholder="请输入内容" />
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
    </el-form>
    <el-button @click="state.visible = false">取消</el-button>
    <el-button type="primary" @click="handleSubmit()">确定</el-button>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import { getById, saveOrUpdate } from '@/api/system/notice'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";
import WangEditor from "@/components/wang-editor/index.vue";
import {ElMessage} from "element-plus";

const emit = defineEmits(['refreshPage', 'update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  noticeId: {
    type: String,
  }
})
const state: StateOptions  = reactive({
  api: {
    saveOrUpdate,
    getById,
    emit
  },
  dataForm: {
    id: undefined,
    title: '',
    content: '',
    type: '1',
    status: true,
  }
})

const dataFormRef = ref()

const dataRules = reactive({
    title: [
      { required: true, message: '必填项不能为空', trigger: 'blur' },
      { min: 0, max: 50, message: '标题长度不能超过50个字符', trigger: 'blur' }
    ],
    type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    remark: [{ min: 0, max: 500, message: '备注长度不能超过500个字符', trigger: 'blur' }]
})

const { getData } = crud(state)

/** 初始化详情数据 */
const init = (id?: bigint) => {
  state.visible = true
  state.dataForm.id = undefined

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
  init(BigInt(props.noticeId || ''))
})

/** 表单提交 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    handleSaveOrUpdate()
  })
}

/** 表单提交 */
const handleSaveOrUpdate = () => {
  saveOrUpdate(state.dataForm).then(() => {
    emit('update:modelValue', false)
    emit('refreshPage')
    ElMessage.success('操作成功')
  })
}
</script>

