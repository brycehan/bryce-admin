<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.id ? '新增机构' : '修改机构'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRules"
      label-width="100px"
      class="mr-4"
    >
      <el-form-item label="上级机构" prop="parentId" v-if="dataForm.parentId != 0">
          <el-tree-select
            v-model="dataForm.parentId"
            ref="orgTreeRef"
            :data="orgList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            :render-after-expand="false"
            check-on-click-node
            check-strictly
            placeholder="请选择上级机构"
            filterable
            clearable
          ></el-tree-select>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="机构名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="sort">
            <el-input-number v-model="dataForm.sort" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="dataForm.leader" placeholder="负责人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="contactNumber">
            <el-input v-model="dataForm.contactNumber" placeholder="联系电话" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dataForm.email" placeholder="邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <dict-radio-group v-model="dataForm.status" dict-type="sys_status" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, type FormRules } from 'element-plus'
import { getByIdApi, saveOrUpdateApi, postListApi } from '@/api/system/org'
import { ElTreeSelect } from 'element-plus'
const emit = defineEmits(['refreshPage'])

const visible = ref(false)
const dataFormRef = ref()
const orgList = ref([])
const orgTreeRef = ref()

const dataForm = reactive({
  id: '',
  name: '',
  code: '',
  parentId: null,
  ancestor: '',
  leader: '',
  contactNumber: '',
  email: '',
  sort: 0,
  status: 1
})

const dataRules = reactive<FormRules>({
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  parentId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

/**
 * 初始化表单
 *
 * @param row 当前行数据
 * @param isAdd 是否添加
 */
const init = (row: any, isAdd: boolean) => {
  visible.value = true
  dataForm.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 修改或有父节点添加时
  if (isAdd) {
    handleTreeDefault(row)
  } else {
    getOrg(row)
  }
}

/**
 * 获取机构信息
 *
 * @param row
 */
const getOrg = (row: any) => {
  getByIdApi(row.id).then((response) => {
    Object.assign(dataForm, response.data)

    orgTreeRef.value.setCurrentKey(dataForm.parentId)
  })
}

/**
 * 机构树列表
 */
const getOrgList = () => {
  postListApi({}).then((response) => {
    orgList.value = response.data
  })
}

/**
 * 上级机构树，设置默认值
 *
 * @param row 机构父数据
 */
const handleTreeDefault = (row: any) => {
  if (row) {
    dataForm.parentId = row.id
  }
}

/**
 * 表单提交
 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    saveOrUpdateApi(dataForm).then(() => {
      visible.value = false
      emit('refreshPage')
      ElMessage.success('操作成功')
    })
  })
}

onMounted(() => {
  // 机构树列表
  getOrgList()
})

defineExpose({
  init
})
</script>
