<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增角色' : '修改角色'"
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
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="state.dataForm.name" placeholder="请输入角色名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色编码" prop="code">
            <el-input v-model="state.dataForm.code" placeholder="请输入角色编码" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="sort">
            <el-input-number v-model="state.dataForm.sort" :min="0" />
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
          <el-input
            v-model="state.dataForm.remark"
            type="textarea"
            placeholder="请输入备注"
            clearable
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="菜单权限">
          <el-tree
            ref="menuTreeRef"
            :data="menuTree"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            accordion
            show-checkbox
          />
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
import { getByIdApi, saveOrUpdateApi, getMenuApi, getCheckCodeUniqueApi } from '@/api/system/role'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import type { FormRules } from 'element-plus'

const emit = defineEmits(['refreshPage'])

const state: StateOptions = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
    emit
  },
  dataForm: {
    id: undefined,
    name: '',
    code: '',
    dataScope: '',
    sort: '0',
    status: 1,
    remark: ''
  }
})

const dataFormRef = ref()
const menuTreeRef = ref()
const menuTree = ref([])

/**
 * 角色编码是否唯一
 *
 * @param rule 校验规则
 * @param value 校验值
 * @param callback 回调
 */
const checkCodeUnique = (rule: any, value: any, callback: any) => {
  getCheckCodeUniqueApi(value, state.dataForm.id).then((res) => {
    if (res.data) {
      callback()
    } else {
      callback(new Error('角色编码已存在'))
    }
  })
}

const dataRules = reactive<FormRules>({
  name: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '长度为2~50个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '长度为2~50个字符', trigger: 'blur' },
    { validator: checkCodeUnique, trigger: 'blur' }
  ],
  sort: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  remark: [{ min: 0, max: 500, message: '长度不能超过500个字符', trigger: 'blur' }]
})

const { handleSaveOrUpdate } = crud(state)

/**
 * 初始化详情数据
 *
 * @param id 角色ID
 */
const init = (id?: bigint) => {
  state.visible = true
  state.dataForm.id = undefined

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }
  if (menuTreeRef.value) {
    menuTreeRef.value.setCheckedKeys([])
  }

  // id 存在则为修改
  if (id) {
    getData(id)
  }

  // 菜单列表
  getMenuTree()
}

/** 获取详情数据 */
const getData = (id: bigint) => {
  getByIdApi(id).then((res: any) => {
    Object.assign(state.dataForm, res.data)
    state.dataForm.menuIds.forEach((menuId: bigint) => menuTreeRef.value.setChecked(menuId, true))
  })
}

const getMenuTree = () => {
  return getMenuApi().then((res: any) => {
    menuTree.value = res.data
  })
}
/** 表单提交 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    state.dataForm.menuIds = [
      ...menuTreeRef.value.getHalfCheckedKeys(),
      ...menuTreeRef.value.getCheckedKeys()
    ]

    handleSaveOrUpdate()
  })
}

defineExpose({
  init
})
</script>
