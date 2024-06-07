<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增微信公众号粉丝' : '修改微信公众号粉丝'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="state.dataForm"
      :rules="dataRules"
      label-width="100px"
      class="mr-4"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="openid" prop="openId">
            <el-input v-model="state.dataForm.openId" placeholder="请输入openid" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="state.dataForm.phone" placeholder="请输入手机号" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="state.dataForm.nickname" placeholder="请输入昵称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="头像" prop="headImgUrl">
            <el-input v-model="state.dataForm.headImgUrl" placeholder="请输入头像" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-input v-model="state.dataForm.sex" placeholder="请输入性别" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="省份" prop="province">
            <el-input v-model="state.dataForm.province" placeholder="请输入省份" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="城市" prop="city">
            <el-input v-model="state.dataForm.city" placeholder="请输入城市" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标签ID列表" prop="tagIds">
            <el-input v-model="state.dataForm.tagIds" placeholder="请输入标签ID列表" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否关注" prop="subscribe">
            <el-input v-model="state.dataForm.subscribe" placeholder="请输入是否关注" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关注时间" prop="subscribeTime">
            <el-input
              v-model="state.dataForm.subscribeTime"
              placeholder="请输入关注时间"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="关注场景" prop="subscribeScene">
            <el-input
              v-model="state.dataForm.subscribeScene"
              placeholder="请输入关注场景"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扫码场景值" prop="qrSceneStr">
            <el-input
              v-model="state.dataForm.qrSceneStr"
              placeholder="请输入扫码场景值"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="unionid" prop="unionId">
            <el-input v-model="state.dataForm.unionId" placeholder="请输入unionid" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="语言" prop="language">
            <el-input v-model="state.dataForm.language" placeholder="请输入语言" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="state.dataForm.remark" placeholder="请输入备注" clearable />
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
import { getById, saveOrUpdate } from '@/api/mp/user'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'

const emit = defineEmits(['refreshPage'])

const state: StateOptions = reactive({
  api: {
    saveOrUpdate,
    getById,
    emit
  },
  dataForm: {
    openId: '',
    phone: '',
    nickname: '',
    headImgUrl: '',
    sex: '',
    province: '',
    city: '',
    tagIds: '',
    subscribe: '',
    subscribeTime: '',
    subscribeScene: '',
    qrSceneStr: '',
    unionId: '',
    language: '',
    remark: '',
    createdTime: '',
    updatedTime: ''
  }
})

const dataFormRef = ref()

const dataRules = reactive({
  openId: [{ min: 0, max: 50, message: 'openid长度不能超过50个字符', trigger: 'blur' }],
  phone: [{ min: 0, max: 20, message: '手机号长度不能超过20个字符', trigger: 'blur' }],
  nickname: [{ min: 0, max: 50, message: '昵称长度不能超过50个字符', trigger: 'blur' }],
  headImgUrl: [{ min: 0, max: 255, message: '头像长度不能超过255个字符', trigger: 'blur' }],
  province: [{ min: 0, max: 20, message: '省份长度不能超过20个字符', trigger: 'blur' }],
  city: [{ min: 0, max: 20, message: '城市长度不能超过20个字符', trigger: 'blur' }],
  subscribeScene: [{ min: 0, max: 50, message: '关注场景长度不能超过50个字符', trigger: 'blur' }],
  qrSceneStr: [{ min: 0, max: 64, message: '扫码场景值长度不能超过64个字符', trigger: 'blur' }],
  unionId: [{ min: 0, max: 50, message: 'unionid长度不能超过50个字符', trigger: 'blur' }],
  language: [{ min: 0, max: 10, message: '语言长度不能超过10个字符', trigger: 'blur' }],
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
