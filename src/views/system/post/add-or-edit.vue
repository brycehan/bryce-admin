<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增岗位' : '修改岗位'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="state.dataForm"
      :rules="rules"
      label-width="100px"
      @keyup.enter="handleSubmit()"
      class="mr-4"
    >
      <el-form-item label="岗位名称" prop="name">
        <el-input v-model="state.dataForm.name" placeholder="请输入岗位名称" />
      </el-form-item>
      <el-form-item label="岗位编码" prop="code">
        <el-input v-model="state.dataForm.code" placeholder="请输入岗位编码" />
      </el-form-item>
      <el-form-item label="显示顺序" prop="sort">
        <el-input-number v-model="state.dataForm.sort" :min="0" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-radio-group v-model="state.dataForm.status" dict-type="sys_status" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="state.dataForm.remark" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="state.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { getById, saveOrUpdate } from '@/api/system/post'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";

const emit = defineEmits(['refreshPage'])

const state: StateOptions  = reactive({
  api: {
    saveOrUpdate,
    getById,
    emit
  },
  dataForm: {
    id: undefined,
    name: '', 
    code: '', 
    sort: '', 
    status: true,
    remark: ''
  }
})

const dataFormRef = ref()

const rules = reactive({
    name: [
      { required: true, message: '必填项不能为空', trigger: 'blur' },
      { min: 0, max: 50, message: '岗位名称长度不能超过50个字符', trigger: 'blur' }
    ],
    code: [
      { required: true, message: '必填项不能为空', trigger: 'blur' },
      { min: 0, max: 30, message: '岗位编码长度不能超过30个字符', trigger: 'blur' }
    ],
    sort: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    remark: [{ min: 0, max: 500, message: '备注长度不能超过500个字符', trigger: 'blur' }]
})

const { getData, handleSaveOrUpdate } = crud(state)

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

/** 表单提交 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    handleSaveOrUpdate()
  })
}

defineExpose({
    init
})
</script>
