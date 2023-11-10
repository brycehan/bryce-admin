<template>
  <el-dialog
      v-model="state.visible"
      :title="!state.dataForm.id ? '新增租户' : '修改租户'"
      :close-on-click-modal="false"
  >
    <el-form
        ref="dataFormRef"
        :model="state.dataForm"
        :rules="dataRules"
        label-width="100px"
        @keyup.enter="handleSubmit()"
        class="mr-4"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="租户名称" prop="name">
            <el-input v-model="state.dataForm.name" placeholder="请输入租户名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="站点域名" prop="siteDomain">
            <el-input v-model="state.dataForm.siteDomain" placeholder="请输入站点域名" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="访问网址" prop="siteUrl">
            <el-input v-model="state.dataForm.siteUrl" placeholder="请输入访问网址" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="logo" prop="siteLogo">
            <el-input v-model="state.dataForm.siteLogo" placeholder="请输入logo" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="过期时间" prop="expiresTime">
            <el-date-picker type="date" v-model="state.dataForm.expiresTime" placeholder="过期时间" value-format="YYYY-MM-DD" class="w-100" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <dict-radio-group v-model="state.dataForm.status" dict-type="sys_status" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="系统配置" prop="config">
            <el-input type="textarea" v-model="state.dataForm.config" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="state.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { getById, saveOrUpdate } from '@/api/system/tenant'
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
    siteDomain: '',
    siteUrl: '',
    siteLogo: '',
    config: '',
    expiresTime: '',
    status: true
  }
})

const dataFormRef = ref()

const dataRules = reactive({
  name: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 100, message: '租户名称长度不能超过100个字符', trigger: 'blur' }
  ],
  siteDomain: [{ min: 0, max: 200, message: '站点域名长度不能超过200个字符', trigger: 'blur' }],
  siteUrl: [{ min: 0, max: 100, message: '访问网址长度不能超过100个字符', trigger: 'blur' }],
  siteLogo: [{ min: 0, max: 200, message: 'logo长度不能超过200个字符', trigger: 'blur' }],
  config: [{ min: 0, max: 65535, message: '系统配置长度不能超过65535个字符', trigger: 'blur' }]
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
