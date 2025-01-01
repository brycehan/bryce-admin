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
        <dict-select v-model="dataForm.dataScopeType" dict-type="sys_data_scope" placeholder="请选择数据范围" class="w-100" clearable/>
      </el-form-item>
      <el-form-item v-show="dataForm.dataScopeType == 1" label="数据权限">
        <el-checkbox v-model="orgExpandAll" @change="handleTreeExpand($event)">{{orgExpandAll ? '全部收起' : '全部展开'}}</el-checkbox>
        <el-checkbox v-model="orgCheckAll" @change="handleTreeCheckAll($event)">全选/全不选</el-checkbox>
        <el-checkbox v-model="orgCheckStrictly" @change="handleTreeCheckStrictly($event)">父子联动</el-checkbox>
      </el-form-item>
      <el-form-item v-show="dataForm.dataScopeType == 1">
       <el-card shadow="never" class="w-100">
         <el-tree
           ref="orgTreeRef"
           :data="orgData"
           :props="{ label: 'name', children: 'children' }"
           node-key="id"
           :check-strictly="!orgCheckStrictly"
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
import { postListApi as orgListApi } from '@/api/system/org'
import { ElMessage, type FormRules } from 'element-plus'

const visible = ref(false)
const dataForm = reactive({
  id: '',
  name: '',
  dataScopeType: 0,
  orgIds: [] as any[],
})

const dataFormRef = ref()
const orgTreeRef = ref()
const orgData = ref([] as any[])
const orgExpandAll = ref(true)
const orgCheckAll = ref(false)
const orgCheckStrictly = ref(false)

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

  if (orgTreeRef.value) {
    orgTreeRef.value.setCheckedKeys([])
  }
  orgExpandAll.value = true
  orgCheckAll.value = false
  orgCheckStrictly.value = false

  // id 存在则为修改
  if (id) {
    getData(id)
  }

  // 机构列表
  getOrgList()
}

/**
 * 获取详情数据
 */
const getData = (id: string) => {
  getByIdApi(id).then((res: any) => {
    Object.assign(dataForm, res.data)

    // 初始化机构树
    orgTreeRef.value.setCheckedKeys(dataForm.orgIds)
  })
}

/**
 * 获取机构列表
 */
const getOrgList = () => {
  orgListApi({}).then((response) => {
    orgData.value = response.data || []
  })
}

/**
 * 表单提交
 */
const handleSubmit = () => {
  dataForm.orgIds = orgTreeRef.value.getCheckedKeys()

  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    if (dataForm.orgIds.length === 0) {
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
 * 展开/折叠机构树
 *
 * @param val true 展开 false 折叠
 */
const handleTreeExpand = (val: any) => {
  for (let i = 0; i < orgData.value.length; i++) {
    orgTreeRef.value.store.nodesMap[orgData.value[i].id].expanded = val
  }
}

/**
 * 全选/全不选机构树
 *
 * @param val true 全选 false 全不选
 */
const handleTreeCheckAll = (val: any) => {
  orgTreeRef.value.setCheckedNodes(val ? orgData.value : [])
}

/**
 * 父子联动机构树
 *
 * @param val true 父子联动 false 不联动
 */
const handleTreeCheckStrictly = (val: boolean) => {
  orgCheckStrictly.value = val
}

defineExpose({
  init
})
</script>
