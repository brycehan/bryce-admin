<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增用户' : '修改用户'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="state.dataForm"
      :rules="dataRules"
      label-width="100px"
      class="mr-4"
    >
      <el-row v-if="!state.dataForm.id">
        <el-col :span="12">
          <el-form-item label="账号" prop="username">
            <el-input v-model="state.dataForm.username" placeholder="请输入账号" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="state.dataForm.password"
              placeholder="请输入密码"
              show-password
              clearable
            />
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
          <el-form-item label="所属机构" prop="orgId">
            <el-tree-select
              v-model="state.dataForm.orgId"
              :data="orgList"
              value-key="id"
              check-strictly
              :props="{ label: 'name', children: 'children' }"
              class="w-100"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位" prop="postIds">
            <el-select
              v-model="state.dataForm.postIds"
              multiple
              placeholder="请选择岗位"
              class="w-100"
              clearable
            >
              <el-option
                v-for="post in postList"
                :key="post.id"
                :label="post.name"
                :value="post.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色" prop="roleIds">
            <el-select
              v-model="state.dataForm.roleIds"
              multiple
              placeholder="请选择角色"
              class="w-100"
              clearable
            >
              <el-option
                v-for="role in roleList"
                :key="role.id"
                :label="role.name"
                :value="role.id"
              />
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
        <el-form-item label="备注" prop="remark" class="w-100">
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
import { reactive, ref } from 'vue'
import {
  getByIdApi,
  saveOrUpdateApi,
  checkUsernameUnique,
  getCheckPhoneUniqueApi,
  getCheckEmailUniqueApi
} from '@/api/system/user'
import { postListApi as orgListApi } from '@/api/system/org'
import { getRoleListApi as roleListApi } from '@/api/system/role'
import { getListApi as postListApi } from '@/api/system/post'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { emailRegExp, phoneRegExp } from '@/utils/tool'

const emit = defineEmits(['refreshPage'])

const state: StateOptions = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
    emit
  },
  dataForm: {
    id: undefined,
    username: '',
    password: '',
    nickname: '',
    gender: 'M',
    phone: '',
    email: '',
    sort: 0,
    orgId: '',
    status: 1,
    remark: '',
    roleIds: [],
    postIds: []
  }
})

const dataFormRef = ref()
const orgList = ref([])
const roleList = ref<any[]>([])
const postList = ref<any[]>([])

/**
 * 校验手机号码是否唯一
 *
 * @param rule 校验规则
 * @param value 校验值
 * @param callback 回调
 */
const checkPhoneUnique = (rule: any, value: any, callback: any) => {
  // 校验手机号码格式
  if (!phoneRegExp.test(value)) {
    callback(new Error('手机号码格式错误'))
    return
  }
  // 后端校验唯一
  getCheckPhoneUniqueApi(value, state.dataForm.id).then((res) => {
    if (res.data) {
      callback()
    } else {
      callback(new Error('此手机号码已注册'))
    }
  })
}

/**
 * 校验邮箱
 *
 * @param rule 校验规则
 * @param value 校验值
 * @param callback 回调
 */
const checkEmail = (rule: any, value: any, callback: any) => {
  // 值为空时，也校验通过
  if (!value) {
    return callback()
  }
  // 校验邮箱格式
  if (!emailRegExp.test(value)) {
    callback(new Error('邮箱格式错误'))
    return
  }
  // 后端校验邮箱唯一
  getCheckEmailUniqueApi(value, state.dataForm.id).then((res) => {
    if (res.data) {
      callback()
    } else {
      callback(new Error('此邮箱已注册'))
    }
  })
}

const dataRules = reactive({
  username: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '账号长度不能超过50个字符', trigger: 'blur' },
    { validator: checkUsernameUnique, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 0, max: 255, message: '密码长度不能超过255个字符', trigger: 'blur' }
  ],
  nickname: [{ min: 0, max: 50, message: '姓名长度不能超过50个字符', trigger: 'blur' }],
  gender: [{ min: 0, max: 1, message: '性别长度不能超过1个字符', trigger: 'blur' }],
  phone: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 7, max: 20, message: '手机号码长度在7-20个字符', trigger: 'blur' },
    { validator: checkPhoneUnique, trigger: 'blur' }
  ],
  email: [
    { min: 0, max: 50, message: '邮箱长度不能超过50个字符', trigger: 'blur' },
    { validator: checkEmail, trigger: 'blur' }
  ],
  remark: [{ min: 0, max: 500, message: '备注长度不能超过500个字符', trigger: 'blur' }]
})

const { getData, handleSaveOrUpdate } = crud(state)

/** 初始化详情数据 */
const init = (id?: bigint) => {
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
  }
  getOrgList()
  getRoleList()
  getPostList()
}

/** 获取机构列表 */
const getOrgList = () => {
  orgListApi({}).then((response) => {
    orgList.value = response.data
  })
}

/** 获取角色列表 */
const getRoleList = () => {
  roleListApi().then((response) => {
    roleList.value = response.data
  })
}

/** 获取岗位列表 */
const getPostList = () => {
  postListApi().then((response) => {
    postList.value = response.data
  })
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
