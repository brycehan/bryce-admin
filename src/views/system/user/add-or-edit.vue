<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增用户' : '修改用户'"
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
      <el-row v-if="!state.dataForm.id">
        <el-col :span="12">
          <el-form-item label="账号" prop="username">
            <el-input v-model="state.dataForm.username" placeholder="请输入账号" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input v-model="state.dataForm.password" type="password" placeholder="请输入密码" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="fullName">
            <el-input v-model="state.dataForm.fullName" placeholder="请输入姓名" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <dict-radio-group v-model="state.dataForm.gender" dict-type="sys_user_gender"/>
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
              :props="{ label: 'name', children: 'children'}"
              class="w-100"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <dict-radio-group v-model="state.dataForm.status" dict-type="sys_status"/>
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
          <el-form-item label="角色" prop="roleIds">
            <el-select v-model="state.dataForm.roleIds" multiple placeholder="请选择角色" class="w-100" clearable>
              <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位" prop="postIds">
            <el-select v-model="state.dataForm.postIds" multiple placeholder="请选择岗位" class="w-100" clearable>
              <el-option v-for="post in postList" :key="post.id" :label="post.name" :value="post.id" />
            </el-select>
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
import { getById, saveOrUpdate } from '@/api/system/user'
import { list as orgListApi } from '@/api/system/org'
import { list as roleListApi } from '@/api/system/role'
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
    username: '', 
    password: '', 
    fullName: '',
    gender: 'M',
    phone: '', 
    email: '', 
    sort: '', 
    orgId: '',
    status: true,
    remark: '',
    roleIds: [],
    postIds: []
  }
})

const dataFormRef = ref()
const orgList = ref([])
const roleList = ref([])
const postList = ref([])

const rules = reactive({
    username: [
      { required: true, message: '必填项不能为空', trigger: 'blur' },
      { min: 0, max: 50, message: '账号长度不能超过50个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '必填项不能为空', trigger: 'blur' },
      { min: 0, max: 255, message: '密码长度不能超过255个字符', trigger: 'blur' }
    ],
    fullName: [{ min: 0, max: 50, message: '姓名长度不能超过50个字符', trigger: 'blur' }],
    gender: [{ min: 0, max: 1, message: '性别（M：男, F：女）长度不能超过1个字符', trigger: 'blur' }],
    phone: [
      { required: true, message: '必填项不能为空', trigger: 'blur' },
      { min: 0, max: 20, message: '手机号码长度不能超过20个字符', trigger: 'blur' }
    ],
    email: [{ min: 0, max: 50, message: '邮箱长度不能超过50个字符', trigger: 'blur' }],
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
  getOrgList()
  getRoleList()
}

/** 获取机构列表 */
const getOrgList = () => {
  orgListApi({}).then( response => {
    orgList.value = response.data
  })
}

/** 获取角色列表 */
const getRoleList = () => {
  roleListApi().then( response => {
    roleList.value = response.data
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
