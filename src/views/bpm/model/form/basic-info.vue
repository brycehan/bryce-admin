<template>
  <div>
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" class="w-xl" label-width="100">
      <el-form-item label="流程名称" prop="name">
        <el-input v-model="dataForm.name" :disabled="!!dataForm.id" clearable placeholder="请输入流程名称" />
      </el-form-item>
      <el-form-item label="流程标识" prop="key">
        <div class="flex w-full items-center">
          <el-input
            v-model="dataForm.key"
            :disabled="!!dataForm.id"
            class="mr-2 shrink-0"
            clearable
            placeholder="请输入流程标识，以字母或下划线开头"
          />
          <el-tooltip
            :content="dataForm.id ? '流程标识不可修改！' : '新建后，流程标识不可修改！'"
            effect="dark"
            placement="top"
          >
            <icon icon="ep:question-filled" />
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item label="流程分类" prop="category">
        <el-select v-model="dataForm.category" class="w-full" clearable placeholder="请选择岗位">
          <el-option v-for="category in categoryList" :key="category.id" :label="category.name" :value="category.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="流程描述" prop="description">
        <el-input v-model="dataForm.description" clearable placeholder="请输入流程描述" type="textarea" />
      </el-form-item>
      <el-form-item label="是否可见" prop="visible">
        <dict-radio-group v-model="dataForm.visible" dict-type="sys_show_hide" />
      </el-form-item>
      <el-form-item class="mb-20px" label="谁可以发起" prop="startUserType">
        <el-select v-model="dataForm.startUserType" placeholder="请选择谁可以发起" @change="handleStartUserTypeChange">
          <el-option :value="0" label="全员" />
          <el-option :value="1" label="指定人员" />
        </el-select>
        <div v-if="dataForm.startUserType === 1" class="mt-2 flex flex-wrap gap-2">
          <div
            v-for="user in selectedStartUsers"
            :key="user.id"
            class="dark:color-gray-600 position-relative flex h-[35px] items-center rounded-3xl bg-gray-100 pr-[8px]"
          >
            <el-avatar v-if="user.avatar" :size="28" :src="user.avatar" class="!m-[5px]" />
            <el-avatar v-else :size="28" class="!m-[5px]">
              {{ user.nickname.substring(0, 1) }}
            </el-avatar>
            {{ user.nickname }}
            <icon class="ml-2 cursor-pointer hover:text-red-500" icon="ep:close" @click="handleRemoveStartUser(user)" />
          </div>
          <el-button link type="primary" @click="openStartUserSelect">
            <icon icon="ep:plus" />
            选择人员
          </el-button>
        </div>
      </el-form-item>
      <el-form-item class="mb-20px" label="流程管理员" prop="managerUserIds">
        <div class="flex flex-wrap gap-2">
          <div
            v-for="user in selectedManagerUsers"
            :key="user.id"
            class="dark:color-gray-600 position-relative flex h-[35px] items-center rounded-3xl bg-gray-100 pr-[8px]"
          >
            <el-avatar v-if="user.avatar" :size="28" :src="user.avatar" class="!m-[5px]" />
            <el-avatar v-else :size="28" class="!m-[5px]">
              {{ user.nickname.substring(0, 1) }}
            </el-avatar>
            {{ user.nickname }}
            <icon
              class="ml-2 cursor-pointer hover:text-red-500"
              icon="ep:close"
              @click="handleRemoveManagerUser(user)"
            />
          </div>
          <el-button link type="primary" @click="openManagerUserSelect">
            <icon icon="ep:plus" />
            选择人员
          </el-button>
        </div>
      </el-form-item>
    </el-form>

    <!-- 用户选择弹窗 -->
    <user-select-form ref="userSelectFormRef" @confirm="handleUserSelectConfirm" />
  </div>
</template>

<script lang="ts" setup>
import { type PropType, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getCheckKeyUniqueApi } from '@/api/bpm/model.ts'

const props = defineProps({
  categoryList: {
    type: Array as PropType<any[]>,
    required: true,
  },
  userList: {
    type: Array,
    required: true,
  },
})

// 创建本地数据副本
const dataForm = defineModel<any>()

const dataFormRef = ref<FormInstance>()
const selectedStartUsers = ref<any[]>([])
const selectedManagerUsers = ref<any[]>([])
const userSelectFormRef = ref()
const currentSelectType = ref<'start' | 'manager'>('start')

const { required, remote } = useValidator()

const dataRules = reactive<FormRules>({
  name: [required(), { min: 2, max: 50, message: '长度为2~50个字符', trigger: 'blur' }],
  key: [
    required(),
    { min: 2, max: 30, message: '长度为2~30个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z_][-_.0-9a-zA-Z]*$/, message: '有效英文字母或下划线' },
    remote({ api: getCheckKeyUniqueApi, message: '此流程标识已使用', params: toRef(dataForm.value, 'id') }),
  ],
  category: [required('change')],
  type: [required()],
  managerUserIds: [required()],
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
      selectedManagerUsers.value = props.userList.filter((user: any) => newValue.managerUserIds.includes(user.id))
    } else {
      selectedManagerUsers.value = []
    }
  },
  { immediate: true },
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
  if (currentSelectType.value === 'start') {
    dataForm.value = {
      ...dataForm.value,
      startUserIds: users.map((u) => u.id),
    }
  } else {
    dataForm.value = {
      ...dataForm.value,
      managerUserIds: users.map((u) => u.id),
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
      startUserIds: [],
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
    startUserIds: dataForm.value.startUserIds.filter((id: string) => id !== user.id),
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
    managerUserIds: dataForm.value.managerUserIds.filter((id: any) => id !== user.id),
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
  resetFields,
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
