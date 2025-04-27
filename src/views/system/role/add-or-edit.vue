<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增角色' : '修改角色'"
    :close-on-click-modal="false"
  >
    <el-form ref="dataFormRef" :model="state.dataForm" :rules="dataRules" label-width="100" class="mr-4">
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
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpandAll" @change="handleTreeExpand($event)">{{
            menuExpandAll ? '全部收起' : '全部展开'
          }}</el-checkbox>
          <el-checkbox v-model="menuCheckAll" @change="handleTreeCheckAll($event)">全选/全不选</el-checkbox>
          <el-checkbox v-model="menuCheckStrictly" @change="handleTreeCheckStrictly($event)">父子联动</el-checkbox>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="w-full">
          <el-card shadow="never" class="w-full">
            <el-tree
              ref="menuTreeRef"
              :data="menuData"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              :check-strictly="!menuCheckStrictly"
              empty-text="加载中，请稍候..."
              show-checkbox
            />
          </el-card>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="备注" prop="remark" class="w-full">
          <el-input v-model="state.dataForm.remark" type="textarea" placeholder="请输入备注" clearable />
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
import { getByIdApi, saveOrUpdateApi, getMenuApi, getCheckCodeUniqueApi } from '@/api/system/role'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { type CheckboxValueType, ElMessage, type FormRules } from 'element-plus'

const emit = defineEmits(['refreshPage'])

const state: StateOptions = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
    emit,
  },
  dataForm: {
    id: '',
    name: '',
    code: '',
    dataScopeType: '',
    sort: '0',
    status: 1,
    remark: '',
  },
})

const dataFormRef = ref()
const menuTreeRef = ref()
const menuData = ref([] as any[])
const menuExpandAll = ref(false)
const menuCheckAll = ref(false)
const menuCheckStrictly = ref(true)

/**
 * 角色编码是否唯一
 *
 * @param _rule 校验规则
 * @param value 校验值
 * @param callback 回调
 */
const checkCodeUnique = (_rule: any, value: any, callback: any) => {
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
    { min: 2, max: 50, message: '长度为2~50个字符', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '长度为2~50个字符', trigger: 'blur' },
    { pattern: /^[A-Z_]+$/, message: '必须是大写字母或下划线', trigger: 'blur' },
    { validator: checkCodeUnique, trigger: 'blur' },
  ],
  sort: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  remark: [{ min: 0, max: 500, message: '长度不能超过500个字符', trigger: 'blur' }],
})

const { handleSaveOrUpdate } = crud(state)

/**
 * 初始化详情数据
 *
 * @param id 角色ID
 */
const init = (id?: string) => {
  state.visible = true
  state.dataForm.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }
  if (menuTreeRef.value) {
    menuTreeRef.value.setCheckedKeys([])
  }
  menuExpandAll.value = false
  menuCheckAll.value = false
  menuCheckStrictly.value = true

  // id 存在则为修改
  if (id) {
    getData(id)
  }

  // 菜单列表
  getMenuTree()
}

/**
 * 获取详情数据
 *
 * @param id 角色ID
 */
const getData = (id: string) => {
  getByIdApi(id).then((res: any) => {
    Object.assign(state.dataForm, res.data)
    state.dataForm.menuIds.forEach((menuId: string) => menuTreeRef.value.setChecked(menuId, true))
  })
}

/**
 * 获取菜单树
 */
const getMenuTree = () => {
  getMenuApi().then((res: any) => {
    menuData.value = res.data
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
    state.dataForm.menuIds = [...menuTreeRef.value.getHalfCheckedKeys(), ...menuTreeRef.value.getCheckedKeys()]

    if (state.dataForm.menuIds.length === 0) {
      ElMessage.error('请至少选择一个菜单')
      return
    }

    handleSaveOrUpdate()
  })
}

/**
 * 展开/折叠菜单树
 *
 * @param val true 展开 false 折叠
 */
const handleTreeExpand = (val: any) => {
  for (let i = 0; i < menuData.value.length; i++) {
    menuTreeRef.value.store.nodesMap[menuData.value[i].id].expanded = val
  }
}

/**
 * 全选/全不选菜单树
 *
 * @param val true 全选 false 全不选
 */
const handleTreeCheckAll = (val: any) => {
  menuTreeRef.value.setCheckedNodes(val ? menuData.value : [])
}

/**
 * 父子联动菜单树
 *
 * @param val true 父子联动 false 不联动
 */
const handleTreeCheckStrictly = (val: CheckboxValueType) => {
  menuCheckStrictly.value = val as boolean
}

defineExpose({
  init,
})
</script>
