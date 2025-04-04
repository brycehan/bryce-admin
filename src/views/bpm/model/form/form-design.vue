<template>
  <el-form
    ref="dataFormRef"
    :model="dataForm"
    :rules="dataRules"
    label-width="100"
    class="w-xl"
  >
    <div>
      <div class="form-group">
        <div class="form-group-icon"></div>
        <span class="form-group-title">表单信息</span>
      </div>
    </div>
<!--    <el-form-item label="表单类型" prop="formType">-->
<!--      <el-input v-model="dataForm.formType" :disabled="dataForm.id" clearable placeholder="表单类型" />-->
<!--    </el-form-item>-->

    <el-form-item label="流程表单" prop="formId">
      <el-select
        v-model="dataForm.formId"
        placeholder="请选择流程表单"
        class="w-full"
        clearable
      >
        <el-option
          v-for="form in formList"
          :key="form.id"
          :label="form.name"
          :value="form.id"
        />
      </el-select>
    </el-form-item>
<!--    <el-form-item label="表单提交路由" prop="formCustomCreatePath">-->
<!--      <div style="display: flex; align-items: center;">-->
<!--        <el-input v-model="dataForm.formCustomCreatePath" style="flex-shrink: 0; margin-right: 10px;" clearable placeholder="请输入表单提交路由"/>-->
<!--        <el-tooltip effect="dark" content="自定义表单的提交路径，使用 Vue 的路由地址，例如：bpm/oa/leave/create.vue" placement="top">-->
<!--          <icon icon="ep:question-filled"/> -->
<!--        </el-tooltip>-->
<!--      </div>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="表单查看地址" prop="formCustomViewPath">-->
<!--      <div style="display: flex; align-items: center;">-->
<!--        <el-input v-model="dataForm.formCustomViewPath" style="flex-shrink: 0; margin-right: 10px;" clearable placeholder="请输入表单查看的组件地址"/>-->
<!--        <el-tooltip effect="dark" content="自定义表单的查看组件地址，使用 Vue 的组件地址，例如：bpm/oa/leave/detail.vue" placement="top">-->
<!--          <icon icon="ep:question-filled"/> -->
<!--        </el-tooltip>-->
<!--      </div>-->
<!--    </el-form-item>-->
    <!-- 表单预览 -->
    <div v-if="dataForm.formId">
     <div class="form-group">
       <div class="form-group-icon"></div>
       <span class="form-group-title">表单预览</span>
     </div>
      <form-create :option="formPreview.option" :rule="formPreview.rule" />
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { onMounted, type PropType, reactive, ref, watch } from 'vue'
import type { FormRules } from 'element-plus'
import FormApi from '@/api/bpm/form'
import { setPreviewConfAndFields } from '@/utils/formCreate'
import FormCreate from '@form-create/element-ui'

defineProps({
  formList: {
    type: Array as PropType<any[]>,
    required: true
  }
})

// 创建本地数据副本
const dataForm = defineModel<any>()
// 表单预览数据
const formPreview = reactive({
  rule: [],
  option: {
    submitBtn: false,
    resetBtn: false,
    formData: {}
  }
})

const dataFormRef = ref()

const dataRules = reactive<FormRules>({
  formId: [
    { required: true, message: '必填项不能为空', trigger: 'change' },
  ],
})

/**
 * 清除表单校验错误消息
 */
const clearValidate = () => {
  dataFormRef.value!.clearValidate()
}

/**
 * 表单校验
 */
const validate = () => {
  return dataFormRef.value!.validate()
}

/**
 * 初始化表单预览
 *
 * @param formId 表单ID
 */
const initPreview = async (formId: string) => {
  if (formId) {
    const form = await FormApi.getByIdApi(formId)
    setPreviewConfAndFields(formPreview, form.data.conf, form.data.fields)
    // 设置只读
    formPreview.rule.forEach((item: any) => {
      item.props = { ...item.props, disabled: true }
    })
  } else {
    formPreview.rule = []
  }
}

watch(() => dataForm.value.formId, async (newFormId) => {
  await initPreview(newFormId)
})

onMounted(() => {
  initPreview(dataForm.value.formId)
})

defineExpose({
  validate,
  clearValidate
})
</script>

<style lang="scss" scoped>
.form-group {
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 15px;
  .form-group-icon {
    width: 4px;
    height: 15px;
    background: #409EFF;
    display: flex;
    margin-right: 10px;
  }
  .form-group-title {
    font-size: 14px;
    font-weight: 900;
    line-height: 20px;
  }
}
</style>
