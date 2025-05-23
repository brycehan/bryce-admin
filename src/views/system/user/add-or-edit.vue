<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增用户' : '修改用户'"
    :close-on-click-modal="false"
  >
    <el-form ref="dataFormRef" :model="state.dataForm" :rules="dataRules" label-width="100" class="mr-4">
      <el-row v-if="!state.dataForm.id">
        <el-col :span="12">
          <el-form-item label="账号" prop="username">
            <el-input v-model="state.dataForm.username" placeholder="请输入账号" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input v-model="state.dataForm.password" placeholder="请输入密码" show-password clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="nickname">
            <el-input v-model="state.dataForm.nickname" placeholder="请输入姓名" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <dict-radio-group v-model="state.dataForm.gender" dict-type="sys_gender" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="state.dataForm.phone" placeholder="手机号码" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="state.dataForm.email" placeholder="邮箱" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属部门" prop="deptId">
            <el-tree-select
              v-model="state.dataForm.deptId"
              :data="deptList"
              value-key="id"
              check-strictly
              :props="{ label: 'name', children: 'children' }"
              class="w-full"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位" prop="postIds">
            <el-select v-model="state.dataForm.postIds" multiple placeholder="请选择岗位" clearable>
              <el-option v-for="post in postList" :key="post.id" :label="post.name" :value="post.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色" prop="roleIds">
            <el-select v-model="state.dataForm.roleIds" multiple placeholder="请选择角色" class="w-full" clearable>
              <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <dict-radio-group v-model="state.dataForm.status" dict-type="sys_status" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备注" prop="remark" class="w-full">
          <el-input v-model="state.dataForm.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="state.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  getByIdApi,
  saveOrUpdateApi,
  getCheckPhoneUniqueApi,
  getCheckEmailUniqueApi,
  getCheckUsernameUniqueApi,
} from '@/api/system/user'
import deptApi from '@/api/system/dept'
import roleApi from '@/api/system/role'
import postApi from '@/api/system/post'
import { getValueByParamKeyApi } from '@/api/system/param'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { emailRegExp, phoneRegExp } from '@/utils/tool'
import constant from '@/utils/constant'
import type { FormRules } from 'element-plus'
import { StatusEnum } from '@/enums/system.ts'

const emit = defineEmits(['refreshPage'])

const state: StateOptions = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
    emit,
  },
  dataForm: {
    id: '',
    username: '',
    password: '',
    nickname: '',
    gender: 'M',
    phone: '',
    email: '',
    sort: 0,
    deptId: '',
    status: 1,
    remark: '',
    roleIds: [],
    postIds: [],
  },
})

const dataFormRef = ref()
const deptList = ref([])
const roleList = ref<any[]>([])
const postList = ref<any[]>([])

const { required, remote } = useValidator()

const dataRules = reactive<FormRules>({
  username: [
    required(),
    { min: 2, max: 50, message: '长度为2~50个字符', trigger: 'blur' },
    { pattern: /^[^\s\u4e00-\u9fa5]*$/, message: '不允许有空格、中文', trigger: 'change' },
    remote({ api: getCheckUsernameUniqueApi, message: '此用户名太受欢迎，请更换一个' }),
  ],
  password: [
    required(),
    { min: 6, max: 20, message: '长度为6~20个字符', trigger: 'blur' },
    { pattern: /^[^\s\u4e00-\u9fa5]*$/, message: '不允许有空格、中文', trigger: 'change' },
  ],
  nickname: [required(), { min: 2, max: 50, message: '长度为2~50个字符', trigger: 'blur' }],
  phone: [
    required(),
    { min: 7, max: 20, message: '长度为7~20个字符', trigger: 'blur' },
    { pattern: phoneRegExp, message: '手机号码格式错误', trigger: 'blur' },
    remote({ api: getCheckPhoneUniqueApi, message: '此手机号码已注册', params: toRef(state.dataForm, 'id') }),
  ],
  email: [
    { min: 0, max: 50, message: '长度不能超过50个字符', trigger: 'blur' },
    { pattern: emailRegExp, message: '邮箱格式错误', trigger: 'blur' },
    remote({ api: getCheckEmailUniqueApi, message: '此邮箱已注册', params: toRef(state.dataForm, 'id') }),
  ],
  remark: [{ min: 0, max: 500, message: '长度不能超过500个字符', trigger: 'blur' }],
})

const { getData, handleSaveOrUpdate } = crud(state)

/**
 * 初始化详情数据
 *
 * @param id 用户id
 */
const init = (id?: string) => {
  state.visible = true
  state.dataForm.id = undefined
  state.dataForm.username = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // id 存在则为修改
  if (id) {
    getData(id)
  } else {
    // 获取初始密码
    getValueByParamKeyApi(constant.SYSTEM_USER_INIT_PASSWORD).then((res) => {
      if (!res.data) {
        return
      }
      state.dataForm.password = res.data
    })
  }
  getDeptList()
  getRoleList()
  getPostList()
}

/**
 * 获取部门列表
 */
const getDeptList = () => {
  deptApi.postListApi({}).then((response) => {
    deptList.value = response.data
  })
}

/**
 * 获取角色列表
 */
const getRoleList = () => {
  roleApi.getSimpleList({ status: StatusEnum.ENABLE }).then((response: any) => {
    roleList.value = response.data
  })
}

/**
 * 获取岗位列表
 */
const getPostList = () => {
  postApi.getSimpleList().then((response: any) => {
    postList.value = response.data
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
  init,
})
</script>
