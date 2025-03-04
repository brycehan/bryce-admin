<template>
  <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100" class="w-2xl">
    <el-form-item prop="allowCancelRunningProcess">
      <template #label>
        <el-tooltip effect="dark" content="第一个审批节点通过后，提交人仍可撤销申请" placement="top">
          <el-icon class="tooltip-icon">
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
        <span>提交人权限</span>
      </template>
      <el-checkbox v-model="dataForm.allowCancelRunningProcess">允许撤销审批中的申请</el-checkbox>
    </el-form-item>
    <el-form-item label="流程编码" prop="processIdRule">
      <el-row gutter="10" style="line-height: normal">
        <el-col :span="7">
          <el-input v-model="dataForm.processIdRule.prefix" clearable placeholder="前缀" :disabled="!dataForm.processIdRule.enable">
            <template #prepend>
              <el-checkbox v-model="dataForm.processIdRule.enable" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="dataForm.processIdRule.infix"
            placeholder="中缀"
            class=""
            clearable
            :disabled="!dataForm.processIdRule.enable"
          >
            <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input
            v-model="dataForm.processIdRule.postfix"
            clearable
            placeholder="后缀"
            :disabled="!dataForm.processIdRule.enable"
          />
        </el-col>
        <el-col :span="6">
        <el-input-number
          v-model="dataForm.processIdRule.length"
          style="width: unset"
          :min="5"
          :disabled="!dataForm.processIdRule.enable"
        />
        </el-col>
      </el-row>
      <el-row v-if="dataForm.processIdRule.enable">
        <el-text type="info">编码示例：{{ processIdExample }}</el-text>
      </el-row>
    </el-form-item>
    <el-form-item prop="autoApprovalType">
      <template #label>
        <el-tooltip effect="dark" content="同一审批人在流程中重复出现时的情况" placement="top">
          <el-icon class="tooltip-icon">
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
        <span>自动去重</span>
      </template>
      <el-radio-group v-model="dataForm.autoApprovalType" class="el-radio-group-column">
        <el-radio :value="0">不自动通过</el-radio>
        <el-radio :value="1">仅审批一次，后续重复的审批节点均自动通过</el-radio>
        <el-radio :value="2">仅针对连续审批的节点自动通过</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="标题设置">
      <el-radio-group v-model="dataForm.titleSetting.enable" class="el-radio-group-column">
        <el-radio :value="false">系统默认 <el-text type="info" class="ml-1">展示流程名称</el-text></el-radio>
        <el-radio :value="true">
          自定义标题
          <el-tooltip effect="dark" content="输入字符 '{' 即可插入表单字段" placement="top">
            <el-icon class="tooltip-icon">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </el-radio>
      </el-radio-group>
      <el-mention
        v-if="dataForm.titleSetting.enable"
        v-model="dataForm.titleSetting.title"
        type="textarea"
        prefix="{"
        split="}"
        whole
        :options="formFieldOptions4Title"
        placeholder="请插入表单字段（输入 '{' 可以选择表单字段）或输入文本"
      />
    </el-form-item>
    <el-form-item label="摘要设置">
      <el-radio-group v-model="dataForm.summarySetting.enable" class="el-radio-group-column">
        <el-radio :value="false">系统默认 <el-text type="info" class="ml-1">展示表单前 3 个字段</el-text> </el-radio>
        <el-radio :value="true">自定义摘要</el-radio>
      </el-radio-group>
      <el-select v-if="dataForm.summarySetting.enable" v-model="dataForm.summarySetting.summary" multiple placeholder="请选择要展示的表单字段" clearable>
        <el-option v-for="item in formFieldOptions4Summary" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { dayjs, type FormRules } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import { BpmProcessVariableEnum } from '@/api/bpm/constant'

// 创建本地数据副本
const dataForm = defineModel<any>()

const dataFormRef = ref()

/**
 * 表单时间选项，用于生成自定义流程编码
 */
const timeOptions = ref([
  {
    label: '无',
    value: ''
  },
  {
    label: '精确到日',
    value: 'DAY'
  },
  {
    label: '精确到时',
    value: 'HOUR'
  },
  {
    label: '精确到分',
    value: 'MINUTE'
  },
  {
    label: '精确到秒',
    value: 'SECOND'
  }
])

/**
 * 流程编码示例
 */
const processIdExample = computed(() => {
  if (dataForm.value.processIdRule.enable) {
    let infix = ''
    switch (dataForm.value.processIdRule.infix) {
      case 'DAY':
        infix = dayjs().format('YYYYMMDD')
        break
      case 'HOUR':
        infix = dayjs().format('YYYYMMDDHH')
        break
      case 'MINUTE':
        infix = dayjs().format('YYYYMMDDHHmm')
        break
      case 'SECOND':
        infix = dayjs().format('YYYYMMDDHHmmss')
        break
      default:
        break
    }
    return dataForm.value.processIdRule.prefix + infix + dataForm.value.processIdRule.postfix + ('1'.padStart(dataForm.value.processIdRule.length, '0'))
  }
  return ''
})

/**
 * 表单字段
 */
const formField = ref<Array<{ field: string; title: string }>>([])

/**
 * 自定义标题表单字段选项
 */
const formFieldOptions4Title = computed(() => {
  let formFieldCopy = formField.value.map((item: any) => {
    return {
      label: item.title,
      value: item.field,
    }
  })

  // 固定添加发起人 ID 字段
  formFieldCopy.unshift({
    label: '流程名称',
    value: BpmProcessVariableEnum.PROCESS_DEFINITION_NAME
  })
  formFieldCopy.unshift({
    label: '发起人',
    value: BpmProcessVariableEnum.START_USER_ID
  })
  formFieldCopy.unshift({
    label: '发起时间',
    value: BpmProcessVariableEnum.START_TIME
  })

  return formFieldCopy
})

/**
 * 自定义摘要表单字段选项
 */
const formFieldOptions4Summary = computed(() => {
  return formField.value.map((item: any) => {
    return {
      label: item.title,
      value: item.field,
    }
  })
})

/**
 * 表单校验规则
 */
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
  visible: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  managerUserIds: [{ required: false, message: '必填项不能为空', trigger: 'blur' }]
})
</script>

<style lang="scss" scoped>
// 修复表单数字输入框宽度不居中问题
::v-deep(.el-input-number) {
  .el-input__wrapper .el-input__inner {
    padding-right: unset;
  }
}
</style>
