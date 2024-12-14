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
      label-width="100px"
      class="mr-4"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" disabled />
      </el-form-item>
      <el-form-item label="数据范围" prop="dataScope">
        <dict-select v-model="dataForm.dataScope" dict-type="sys_data_scope" placeholder="请选择数据范围" class="w-100" clearable/>
      </el-form-item>
      <el-form-item v-show="dataForm.dataScope == 4" label="数据权限">
        <el-tree
          ref="orgListRef"
          :data="orgList"
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          accordion
          show-checkbox
          class="w-100"
        />
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
  dataScope: 1,
  orgIds: [],
})

const dataFormRef = ref()
const orgListRef = ref()
const orgList = ref([])

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

  if (orgListRef.value) {
    orgListRef.value.setCheckedKeys([])
  }

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
    orgListRef.value.setCheckedKeys(dataForm.orgIds)
  })
}

/**
 * 获取机构列表
 */
const getOrgList = () => {
  orgListApi({}).then((response) => {
    orgList.value = response.data || []
  })
}

/**
 * 表单提交
 */
const handleSubmit = () => {
  dataForm.orgIds = orgListRef.value.getCheckedKeys()

  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    putDataScopeApi(dataForm).then(() => {
      visible.value = false
      ElMessage.success('操作成功')
    })
  })
}

defineExpose({
  init
})
</script>
