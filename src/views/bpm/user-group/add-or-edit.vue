<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增用户组' : '修改用户组'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="state.dataForm"
      :rules="dataRules"
      label-width="120"
      class="mr-4"
    >
        <el-form-item label="组名" prop="name">
          <el-input v-model="state.dataForm.name" placeholder="请输入组名" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="state.dataForm.description" type="textarea" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="成员编号数组" prop="userIds">
          <el-select v-model="state.dataForm.userIds" multiple clearable placeholder="请选择成员">
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="user.nickname"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <dict-radio-group v-model="state.dataForm.status" dict-type="sys_status" />
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
import { getByIdApi, saveOrUpdateApi } from '@/api/bpm/userGroup.ts'
import * as userApi from '@/api/system/user'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";
import type { FormRules } from 'element-plus'

const emit = defineEmits(['refreshPage'])

const state: StateOptions  = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
    emit
  },
  dataForm: {
    id: '',
    name: '',
    description: '',
    userIds: '',
    status: 1
  }
})

const dataFormRef = ref()
// 用户列表
const userList = ref<any[]>([])

const dataRules = reactive<FormRules>({
    name: [
      { required: true, message: '必填项不能为空', trigger: 'blur' },
      { min: 2, max: 30, message: '长度为2~30个字符', trigger: 'blur' }
    ],
    description: [{ min: 0, max: 255, message: '长度不能超过255个字符', trigger: 'blur' }],
    userIds: [
      { required: true, message: '必填项不能为空', trigger: 'blur' },
    ]
})

const { getData, handleSaveOrUpdate } = crud(state)

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
    getData(id)
  }
  userApi.postListApi({})
    .then((res) => {
      userList.value = res.data
    })
}

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

defineExpose({
    init
})
</script>
