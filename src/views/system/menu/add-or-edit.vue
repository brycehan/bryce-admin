<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增菜单' : '修改菜单'"
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
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="state.dataForm.name" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="类型（M：菜单，B：按钮，I：接口）" prop="type">
        <el-input v-model="state.dataForm.type" placeholder="请输入类型（M：菜单，B：按钮，I：接口）" />
      </el-form-item>
      <el-form-item label="父菜单ID，一级菜单为0" prop="parentId">
        <el-input v-model="state.dataForm.parentId" placeholder="请输入父菜单ID，一级菜单为0" />
      </el-form-item>
      <el-form-item label="组件路径" prop="url">
        <el-input v-model="state.dataForm.url" placeholder="请输入组件路径" />
      </el-form-item>
      <el-form-item label="权限标识" prop="authority">
        <el-input v-model="state.dataForm.authority" placeholder="请输入权限标识" />
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-input v-model="state.dataForm.icon" placeholder="请输入菜单图标" />
      </el-form-item>
      <el-form-item label="打开方式（0：内部，1：外部）" prop="openStyle">
        <el-input v-model="state.dataForm.openStyle" placeholder="请输入打开方式（0：内部，1：外部）" />
      </el-form-item>
      <el-form-item label="显示顺序" prop="sort">
        <el-input v-model="state.dataForm.sort" placeholder="请输入显示顺序" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="state.dataForm.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="状态（0：停用，1：正常）" prop="status">
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
import { getById, saveOrUpdate } from '@/api/system/menu'
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
    type: '', 
    parentId: '', 
    url: '', 
    authority: '', 
    icon: '', 
    openStyle: '', 
    sort: '', 
    remark: '', 
    status: ''
  }
})

const dataFormRef = ref()

const rules = reactive({
    name: [
      { required: true, message: '必填项不能为空', trigger: 'blur' },
      { min: 0, max: 50, message: '菜单名称长度不能超过50个字符', trigger: 'blur' }
    ],
    type: [{ min: 0, max: 1, message: '类型（M：菜单，B：按钮，I：接口）长度不能超过1个字符', trigger: 'blur' }],
    url: [{ min: 0, max: 255, message: '组件路径长度不能超过255个字符', trigger: 'blur' }],
    authority: [{ min: 0, max: 100, message: '权限标识长度不能超过100个字符', trigger: 'blur' }],
    icon: [{ min: 0, max: 100, message: '菜单图标长度不能超过100个字符', trigger: 'blur' }],
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
