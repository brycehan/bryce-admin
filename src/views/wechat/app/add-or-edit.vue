<template>
  <el-dialog
      v-model="state.visible"
      :title="!state.dataForm.id ? '新增微信应用' : '修改微信应用'"
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
      <el-form-item label="名称" prop="name">
        <el-input v-model="state.dataForm.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="state.dataForm.type" >
          <el-radio label="mp">公众号</el-radio>
          <el-radio label="ma">小程序</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="appId">
        <template #label>
          <el-tooltip content="在微信公众平台（mp.weixin.qq.com）的菜单 [设置与开发 - 基本设置] 中能找到「开发者ID(AppID)」" placement="top">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
            appId
        </template>
        <el-input v-model="state.dataForm.appId" placeholder="请输入appId" />
      </el-form-item>
      <el-form-item prop="appSecret">
        <template #label>
          <el-tooltip content="在微信公众平台（mp.weixin.qq.com）的菜单 [设置与开发 - 基本设置] 中能找到「开发者密码(AppSecret)」" placement="top">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
            appSecret
        </template>
        <el-input v-model="state.dataForm.appSecret" placeholder="请输入appSecret" />
      </el-form-item>
      <el-form-item v-if="state.dataForm.type === 'mp'" label="token" prop="token">
        <el-input v-model="state.dataForm.token" placeholder="请输入令牌" />
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
import { getById, saveOrUpdate } from '@/api/wechat/app'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";
import {QuestionFilled} from "@element-plus/icons-vue";

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
    appId: '',
    appSecret: '',
    type: 'mp',
    token: '',
    redirectUrl: '',
    status: true,
    remark: ''
  }
})

const dataFormRef = ref()

const dataRules = reactive({
  name: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 50, message: '名称长度不能超过50个字符', trigger: 'blur' }
  ],
  appId: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 255, message: 'appId长度不能超过255个字符', trigger: 'blur' }
  ],
  appSecret: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 255, message: 'appSecret长度不能超过255个字符', trigger: 'blur' }
  ],
  token: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 100, message: '令牌长度不能超过100个字符', trigger: 'blur' }
  ],
  redirectUrl: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 500, message: '重定向地址长度不能超过500个字符', trigger: 'blur' }
  ],
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

<style scoped lang="scss">
.el-icon {
  margin-top: 10px;
  margin-right: 0.3em;
}
</style>
