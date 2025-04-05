<template>
  <el-dialog
    v-model="visible"
    title="分配数据权限"
    :close-on-click-modal="false"
    width="600"
    draggable
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRules"
      label-width="100"
      class="mr-4"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" disabled />
      </el-form-item>
      <el-form-item label="数据范围" prop="dataScope">
        <dict-select v-model="dataForm.dataScopeType" dict-type="sys_data_scope" placeholder="请选择数据范围" class="w-full" clearable/>
      </el-form-item>
      <el-form-item v-if="dataForm.dataScopeType == 1" label="数据权限">
        <el-checkbox v-model="deptExpandAll" @change="handleTreeExpand($event)">{{deptExpandAll ? '全部收起' : '全部展开'}}</el-checkbox>
        <el-checkbox v-model="deptCheckAll" @change="handleTreeCheckAll($event)">全选/全不选</el-checkbox>
        <el-checkbox v-model="deptCheckStrictly" @change="handleTreeCheckStrictly($event)">父子联动</el-checkbox>
      </el-form-item>
      <el-form-item v-if="dataForm.dataScopeType == 1">
       <el-card shadow="never" class="w-full">
         <el-tree
           ref="deptTreeRef"
           :data="deptData"
           :props="{ label: 'name', children: 'children' }"
           node-key="id"
           :check-strictly="!deptCheckStrictly"
           empty-text="加载中，请稍候..."
           show-checkbox
           default-expand-all
         />
       </el-card>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { getByIdApi, putDataScopeApi } from '@/api/system/role'
import { postListApi as deptListApi } from '@/api/system/dept'
import { type CheckboxValueType, ElMessage, type FormRules } from 'element-plus'

const visible = ref(false)
const dataForm = reactive({
  id: '',
  name: '',
  dataScopeType: 0,
  deptIds: [] as any[],
})

const dataFormRef = ref()
const deptTreeRef = ref()
const deptData = ref([] as any[])
const deptExpandAll = ref(true)
const deptCheckAll = ref(false)
const deptCheckStrictly = ref(false)

const dataRules = reactive<FormRules>({})

/**
 * 初始化详情数据
 *
 * @param id id
 */
const init = (id?: string) => {
  visible.value = true
  dataForm.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  if (deptTreeRef.value) {
    deptTreeRef.value.setCheckedKeys([])
  }
  deptExpandAll.value = true
  deptCheckAll.value = false
  deptCheckStrictly.value = false

  // id 存在则为修改
  if (id) {
    getData(id)
  }

  // 部门列表
  getDeptList()
}

/**
 * 获取详情数据
 */
const getData = (id: string) => {
  getByIdApi(id).then((res: any) => {
    Object.assign(dataForm, res.data)

    // 初始化部门树
    deptTreeRef.value.setCheckedKeys(dataForm.deptIds)
  })
}

/**
 * 获取部门列表
 */
const getDeptList = () => {
  deptListApi({}).then((response) => {
    deptData.value = response.data || []
  })
}

/**
 * 表单提交
 */
const handleSubmit = () => {
  dataForm.deptIds = deptTreeRef.value?.getCheckedKeys()

  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) return false

    if (dataForm.dataScopeType === 1 && dataForm.deptIds.length === 0) {
      ElMessage.error('请至少选择一个部门')
      return false
    }

    putDataScopeApi(dataForm).then(() => {
      visible.value = false
      ElMessage.success('操作成功')
    })
  })
}

/**
 * 展开/折叠部门树
 *
 * @param val true 展开 false 折叠
 */
const handleTreeExpand = (val: any) => {
  for (let i = 0; i < deptData.value.length; i++) {
    deptTreeRef.value.store.nodesMap[deptData.value[i].id].expanded = val
  }
}

/**
 * 全选/全不选部门树
 *
 * @param val true 全选 false 全不选
 */
const handleTreeCheckAll = (val: any) => {
  deptTreeRef.value.setCheckedNodes(val ? deptData.value : [])
}

/**
 * 父子联动部门树
 *
 * @param val true 父子联动 false 不联动
 */
const handleTreeCheckStrictly = (val: CheckboxValueType) => {
  deptCheckStrictly.value = val as boolean
}

defineExpose({
  init
})
</script>
