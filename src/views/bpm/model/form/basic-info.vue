<template>
  <el-form
    ref="dataFormRef"
    :model="dataForm"
    :rules="dataRules"
    label-width="100"
    class="w-xl"
  >
    <el-form-item label="流程名称" prop="name">
      <el-input v-model="dataForm.name" :disabled="!!dataForm.id" clearable placeholder="请输入流程名称" />
    </el-form-item>
    <el-form-item label="流程标识" prop="key">
      <div class="flex items-center w-full">
        <el-input v-model="dataForm.key" class="shrink-0 mr-2" :disabled="!!dataForm.id" clearable placeholder="请输入流程标识，以字母或下划线开头"/>
        <el-tooltip effect="dark" :content="dataForm.id ? '流程标识不可修改！': '新建后，流程标识不可修改！'" placement="top">
          <icon icon="ep:question-filled"/>
        </el-tooltip>
      </div>
    </el-form-item>
    <el-form-item label="流程分类" prop="category">
      <el-select
        v-model="dataForm.category"
        placeholder="请选择岗位"
        class="w-full"
        clearable
      >
        <el-option
          v-for="category in categoryList"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="流程描述" prop="description">
      <el-input v-model="dataForm.description" type="textarea" clearable placeholder="请输入流程描述" />
    </el-form-item>
    <el-form-item label="是否可见" prop="visible">
      <dict-radio-group v-model="dataForm.visible" dict-type="sys_show_hide" />
    </el-form-item>
<!--    <el-form-item label="谁可以发起" prop="startUserIds">-->
<!--      <el-input v-model="dataForm.startUserIds" placeholder="请输入可发起人" />-->
<!--    </el-form-item>-->
  </el-form>

</template>

<script setup lang="ts">
import { type PropType, reactive, ref, watch } from 'vue'
import type { FormRules } from 'element-plus'

const props = defineProps({
  categoryList: {
    type: Array as PropType<any[]>,
    required: true
  },
  userList: {
    type: Array,
    required: true
  }
})

// 创建本地数据副本
const dataForm = defineModel<any>()

const dataFormRef = ref()
const userSelectFormRef = ref()

const selectedManagerUsers = ref<any[]>([])

const dataRules = reactive<FormRules>({
  name: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '长度为2~50个字符', trigger: 'blur' }
  ],
  key: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 30, message: '长度为2~30个字符', trigger: 'blur' }
  ],
  category: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  // managerUserIds: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
})

// 初始化选中的管理员
watch(() => dataForm.value, (newValue) => {
  if (newValue.managerUserIds?.length) {
    selectedManagerUsers.value = props.userList.filter((user: any) => newValue.managerUserIds.includes(user.id))
  } else {
    selectedManagerUsers.value = []
  }
}, { immediate: true })


/**
 * 移除指定管理员
 *
 * @param user 指定管理员
 */
const handleRemoveManagerUser = (user: any) => {
  dataForm.value.managerUserIds = dataForm.value.managerUserIds.filter((id: any) => id !== user.id)
}

/**
 * 打开管理员选择弹窗
 */
const openManagerUserSelect = () => {
  userSelectFormRef.value.open(0, selectedManagerUsers.value)
}

/**
 * 用户选择弹窗提交
 *
 * @param users 用户集合
 */
const handleUserSelectSubmit = (users: any[]) => {
  dataForm.value =  {
    ...dataForm.value,
    managerUserIds: users?.map((user: any) => user.id)
  }
}

/**
 * 重置表单
 */
const resetFields = () => {
  dataFormRef.value?.resetFields()
}

/**
 * 表单校验
 */
const validate = async () => {
  await dataFormRef.value.validate()
}

defineExpose({
  validate,
  resetFields
})
</script>

<style lang="scss" scoped>
.bg-gray-100 {
  background-color: #f5f7fa;
  transition: all 0.3s;

  &:hover {
    background-color: #e6e8eb;
  }

  .icon-close {
    font-size: 14px;
    color: #909399;
    transition: color 0.3s;

    &:hover {
      color: #f56c6c;
    }
  }
}
</style>
