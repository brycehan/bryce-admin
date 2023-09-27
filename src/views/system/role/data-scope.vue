<template>
  <el-dialog
    v-model="state.visible"
    title="分配数据权限"
    :close-on-click-modal="false"
    width="600"
    draggable
  >
    <el-form
      ref="dataFormRef"
      :model="state.dataForm"
      :rules="rules"
      label-width="100px"
      @keyup.enter="handleSubmit()"
      class="mr-4"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="state.dataForm.name" disabled />
      </el-form-item>
      <el-form-item label="数据范围" prop="dataScope">
        <dict-select v-model="state.dataForm.dataScope" dict-type="sys_data_scope" class="w-100"/>
      </el-form-item>
      <el-form-item v-show="state.dataForm.dataScope == 5" label="数据权限">
        <el-tree
          ref="orgListRef"
          :data="orgList"
          :props="{ label: 'name', children: 'children'}"
          node-key="id"
          accordion
          show-checkbox
          class="w-100"
        />
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
import { getById, saveOrUpdate } from '@/api/system/role'
import { list as orgListApi } from '@/api/system/org'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";

const emit = defineEmits(['refreshPage'])

const state: StateOptions  = reactive({
  api: {
    saveOrUpdate,
    emit
  },
  dataForm: {
    id: undefined,
    name: '', 
    dataScope: 1,
    orgIds: [],
    remark: ''
  }
})

const dataFormRef = ref()
const orgListRef = ref()
const orgList = ref([])

const rules = reactive({})

const { handleSaveOrUpdate } = crud(state)

/** 初始化详情数据 */
const init = (id?: bigint) => {
  state.visible = true
  state.dataForm.id = undefined

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  if(orgListRef.value) {
    orgListRef.value.setCheckedKeys([])
  }

  // id 存在则为修改
  if (id) {
    getData(id)
  }

  // 机构列表
  getOrgList()
}

/** 获取详情数据 */
const getData = (id: bigint) => {

  getById(id).then((res: any) => {
    Object.assign(state.dataForm, res.data)

    // 初始化机构树
    orgListRef.value.setCheckedKeys(state.dataForm.orgIds)
  })
}

/** 获取机构列表 */
const getOrgList = () => {
  orgListApi({}).then( response => {
    orgList.value = response.data || []
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