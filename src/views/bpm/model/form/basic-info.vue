<template>
  <div>
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100" class="w-xl">
      <el-form-item label="流程名称" prop="name">
        <el-input v-model="dataForm.name" :disabled="!!dataForm.id" clearable placeholder="请输入流程名称" />
      </el-form-item>
      <el-form-item label="流程标识" prop="key">
        <div class="flex items-center w-full">
          <el-input
            v-model="dataForm.key"
            class="shrink-0 mr-2"
            :disabled="!!dataForm.id"
            clearable
            placeholder="请输入流程标识，以字母或下划线开头"
          />
          <el-tooltip
            effect="dark"
            :content="dataForm.id ? '流程标识不可修改！' : '新建后，流程标识不可修改！'"
            placement="top"
          >
            <icon icon="ep:question-filled" />
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item label="流程分类" prop="category">
        <el-select v-model="dataForm.category" placeholder="请选择岗位" class="w-full" clearable>
          <el-option v-for="category in categoryList" :key="category.id" :label="category.name" :value="category.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="流程描述" prop="description">
        <el-input v-model="dataForm.description" type="textarea" clearable placeholder="请输入流程描述" />
      </el-form-item>
      <el-form-item label="是否可见" prop="visible">
        <dict-radio-group v-model="dataForm.visible" dict-type="sys_show_hide" />
      </el-form-item>
      <el-form-item label="谁可以发起" prop="startUserType" class="mb-20px">
        <el-select
          v-model="dataForm.startUserType"
          placeholder="请选择谁可以发起"
          @change="handleStartUserTypeChange"
        >
          <el-option label="全员" :value="0" />
          <el-option label="指定人员" :value="1" />
        </el-select>
        <div v-if="dataForm.startUserType === 1" class="mt-2 flex flex-wrap gap-2">
          <div
            v-for="user in selectedStartUsers"
            :key="user.id"
            class="bg-gray-100 h-[35px] rounded-3xl flex items-center pr-[8px] dark:color-gray-600 position-relative"
          >
            <el-avatar class="!m-[5px]" :size="28" v-if="user.avatar" :src="user.avatar" />
            <el-avatar class="!m-[5px]" :size="28" v-else>
              {{ user.nickname.substring(0, 1) }}
            </el-avatar>
            {{ user.nickname }}
            <Icon
              icon="ep:close"
              class="ml-2 cursor-pointer hover:text-red-500"
              @click="handleRemoveStartUser(user)"
            />
          </div>
          <el-button type="primary" link @click="openStartUserSelect">
            <icon icon="ep:plus" /> 选择人员
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="流程管理员" prop="managerUserIds" class="mb-20px">
        <div class="flex flex-wrap gap-2">
          <div
            v-for="user in selectedManagerUsers"
            :key="user.id"
            class="bg-gray-100 h-[35px] rounded-3xl flex items-center pr-[8px] dark:color-gray-600 position-relative"
          >
            <el-avatar class="!m-[5px]" :size="28" v-if="user.avatar" :src="user.avatar" />
            <el-avatar class="!m-[5px]" :size="28" v-else>
              {{ user.nickname.substring(0, 1) }}
            </el-avatar>
            {{ user.nickname }}
            <Icon
              icon="ep:close"
              class="ml-2 cursor-pointer hover:text-red-500"
              @click="handleRemoveManagerUser(user)"
            />
          </div>
          <el-button type="primary" link @click="openManagerUserSelect">
            <icon icon="ep:plus" />选择人员
          </el-button>
        </div>
      </el-form-item>
    </el-form>

    <!-- 用户选择弹窗 -->
    <user-select-form ref="userSelectFormRef" @confirm="handleUserSelectConfirm" />
  </div>
</template>

<script setup lang="ts">
import { type PropType, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getCheckKeyUniqueApi } from '@/api/bpm/model.ts'

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

const dataFormRef = ref<FormInstance>()
const selectedStartUsers = ref<any[]>([])
const selectedManagerUsers = ref<any[]>([])
const userSelectFormRef = ref()
const currentSelectType = ref<'start' | 'manager'>('start')

/**
 * 校验手机号码是否唯一
 *
 * @param _rule 校验规则
 * @param value 校验值
 * @param callback 回调
 */
const checkKeyUnique = (_rule: any, value: any, callback: any) => {
  // 后端校验唯一
  getCheckKeyUniqueApi(value, dataForm.value?.id).then((res) => {
    if (res.data) {
      callback()
    } else {
      callback(new Error('此流程标识已使用'))
    }
  })
}

const dataRules = reactive<FormRules>({
  name: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '长度为2~50个字符', trigger: 'blur' }
  ],
  key: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { min: 2, max: 30, message: '长度为2~30个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z_][-_.0-9a-zA-Z]*$/, message: '有效英文字母或下划线' },
    { validator: checkKeyUnique, trigger: 'blur' }
  ],
  category: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
  type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  managerUserIds: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
})

// 初始化选中的用户
watch(
  () => dataForm.value,
  (newValue) => {
    if (newValue.startUserIds?.length) {
      selectedStartUsers.value = props.userList.filter((user: any) => newValue.startUserIds.includes(user.id))
    } else {
      selectedStartUsers.value = []
    }
    if (newValue.managerUserIds?.length) {
      selectedManagerUsers.value = props.userList.filter((user: any) => newValue.managerUserIds.includes(user.id ))
    } else {
      selectedManagerUsers.value = []
    }
  },
  { immediate: true }
)

/**
 * 打开发起人选择
 */
const openStartUserSelect = () => {
  currentSelectType.value = 'start'
  userSelectFormRef.value.open(0, selectedStartUsers.value)
}

/**
 * 打开管理员选择弹窗
 */
const openManagerUserSelect = () => {
  currentSelectType.value = 'manager'
  userSelectFormRef.value.open(0, selectedManagerUsers.value)
}

/**
 * 处理用户选择确认
 */
const handleUserSelectConfirm = (_: any, users: any[]) => {
  debugger
  if (currentSelectType.value === 'start') {
    dataForm.value = {
      ...dataForm.value,
      startUserIds: users.map((u) => u.id)
    }
  } else {
    dataForm.value = {
      ...dataForm.value,
      managerUserIds: users.map((u) => u.id)
    }
  }
}

/**
 * 处理发起人类型变化
 *
 * @param value 类型
 */
const handleStartUserTypeChange = (value: number) => {
  if (value !== 1) {
    dataForm.value = {
      ...dataForm.value,
      startUserIds: []
    }
  }
}

/**
 * 移除发起人
 *
 * @param user 指定发起人
 */
const handleRemoveStartUser = (user: any) => {
  dataForm.value = {
    ...dataForm.value,
    startUserIds: dataForm.value.startUserIds.filter((id: string) => id !== user.id)
  }
}

/**
 * 移除指定管理员
 *
 * @param user 指定管理员
 */
const handleRemoveManagerUser = (user: any) => {
  dataForm.value = {
    ...dataForm.value,
    managerUserIds: dataForm.value.managerUserIds.filter((id: any) => id !== user.id)
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
const validate = (): Promise<boolean> => {
  return dataFormRef.value!.validate()
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
