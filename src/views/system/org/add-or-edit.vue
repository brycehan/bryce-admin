<template>
  <el-dialog
      v-model="visible"
      :title="!dataForm.id ? '新增' : '修改'"
      :close-on-click-modal="false"
  >
    <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="rules"
        label-width="100px"
        @keyup.enter="handleSubmit()"
    >
      <el-form-item label="上级机构" prop="parentName" class="org-list">
        <el-popover ref="orgListPopoverRef" placement="bottom-start" trigger="click" :width="400" popper-class="popover-pop">
          <template #reference>
            <el-input v-model="dataForm.parentName" :readonly="true" placeholder="上级机构">
              <template #suffix>
                <svg-icon icon="icon-close-circle" @click.stop="handleTreeDefault()" />
              </template>
            </el-input>
          </template>
          <el-tree
            ref="orgTreeRef"
            :data="orgList"
            :props="{ label: 'name', children: 'children'}"
            node-key="id"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="handleTreeCurrentChange"
          ></el-tree>
        </el-popover>

      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="机构名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number v-model="dataForm.sort" :min="0" :max="10000" placeholder="显示顺序" />
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
        <el-radio-group v-model="dataForm.status" >
          <el-radio :label="true">正常</el-radio>
          <el-radio :label="false">停用</el-radio>
        </el-radio-group>
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
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getById, saveOrUpdate, list } from '@/api/system/org'
import SvgIcon from "@/components/svg-icon/svg-icon.vue";

const emit = defineEmits(['refreshPage'])

const visible = ref(false)
const dataFormRef = ref()
const orgList = ref([])
const orgTreeRef = ref()
const orgListPopoverRef = ref()


const dataForm = reactive({
  id: '',
  name: '',
  code: '',
  parentId: 0,
  parentName: '',
  ancestor: '',
  leader: '',
  contactNumber: '',
  email: '',
  sort: '',
  status: true,
})

const rules = reactive({
  name: [{required: true, message: '必填项不能为空', trigger: 'blur'}],
  parentName: [{required: true, message: '必填项不能为空', trigger: 'blur'}],
  sort: [{required: true, message: '必填项不能为空', trigger: 'blur'}],
})

const init = (id?: bigint) => {
  visible.value = true
  dataForm.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // id 存在则为修改
  if (id) {
    getOrg(id)
  } else {
    handleTreeDefault()
  }

  // 机构树列表
  getOrgList()
}

const getOrg = (id: bigint) => {
  getById(id).then((response) => {
    Object.assign(dataForm, response.data)

    if(dataForm.parentId === 0) {
      return handleTreeDefault()
    }

    orgTreeRef.value.setCurrentKey(dataForm.parentId)

  })
}

const getOrgList = () => {
  list({}).then(response => {
    orgList.value = response.data
  })
}

/** 上级机构树，设置默认值 */
const handleTreeDefault = () => {
  dataForm.parentId = 0
  dataForm.parentName = '顶级机构'
}

const handleTreeCurrentChange = (data: any) => {
  dataForm.parentId = data.id
  dataForm.parentName = data.name
  orgListPopoverRef.value.hide()
}

/** 表单提交 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    saveOrUpdate(dataForm).then(() => {
      ElMessage.success({
        message: '操作成功',
        duration: 500,
        onClose: () => {
          visible.value = false
          emit('refreshPage')
        }
      })
    })
  })
}

defineExpose({
  init
})
</script>

<style scoped lang="scss">
.org-list {
  ::v-deep(.el-input__inner) {
    cursor: pointer;
  }
  ::v-deep(.el-input__suffix) {
    cursor: pointer;
  }
}
</style>
