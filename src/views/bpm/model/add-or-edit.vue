<template>
  <el-dialog
    v-model="state.visible"
    :title="!state.dataForm.id ? '新增流程定义信息' : '修改流程定义信息'"
    :close-on-click-modal="false"
    fullscreen
  >
    <!-- 头部导航栏 -->
    <template #header>
      <el-row>
        <!-- 左侧标题 -->
        <el-col :span="7" class="title-box">{{ !state.dataForm.id ? '新增流程定义信息' : '修改流程定义信息' }}</el-col>
        <!-- 步骤条 -->
        <el-col :span="10">
          <el-steps :active="active" finish-status="success" simple align-center>
            <el-step>
              <template #icon>1</template>
              <template #title><el-badge is-dot>基本信息</el-badge></template>
            </el-step>
            <el-step>
              <template #icon>2</template>
              <template #title><el-badge is-dot>设计表单</el-badge></template>
            </el-step>
            <el-step>
              <template #icon>3</template>
              <template #title><el-badge is-dot>设计流程</el-badge></template>
            </el-step>
            <el-step>
              <template #icon>4</template>
              <template #title><el-badge is-dot>更多设置</el-badge></template>
            </el-step>
          </el-steps>
        </el-col>
        <!-- 右侧按钮 -->
        <el-col :span="7" class="el-container">
          <el-button type="primary" @click="handleSave()">保存</el-button>
          <el-button :type="active <= 0 ? '' : 'primary'" :disabled="active <= 0" @click="handlePrev()">上一步</el-button>
          <el-button :type="active >= 3 ? '' : 'primary'" :disabled="active >= 3"  @click="handleNext()">下一步</el-button>
        </el-col>
      </el-row>
    </template>
    <!-- 主体内容 -->
    <div class="form-container">
      <!-- 第一步：基本信息 -->
      <basic-info v-show="active === 0" v-model="state.dataForm" :category-list="categoryList" :user-list="userList" ref="basicInfoRef"/>
      <!-- 第二步：设计表单 -->
      <form-design v-show="active === 1" v-model="state.dataForm" :form-list="formList" ref="formDesignRef"/>
      <!-- 第三步：设计流程 -->
      <process-design v-show="active === 2" v-model="state.dataForm" ref="processDesignRef" />
      <!-- 第四步：更多设置 -->
      <extra-settings v-show="active === 3" v-model="state.dataForm" ref="extraSettingsRef" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { provide, reactive, ref, watch } from 'vue'
import { getByIdApi, saveOrUpdateApi } from '@/api/bpm/model'
import * as CategoryApi from '@/api/bpm/category'
import * as FormApi from '@/api/bpm/form'
import * as UserApi from '@/api/system/user'
import * as ModelApi from '@/api/bpm/model'
import type { StateOptions } from "@/utils/state";
import { crud } from "@/utils/state";
import { ElMessage } from 'element-plus'
import BasicInfo from '@/views/bpm/model/form/basic-info.vue'
import FormDesign from '@/views/bpm/model/form/form-design.vue'
import ProcessDesign from '@/views/bpm/model/form/process-design.vue'
import ExtraSettings from '@/views/bpm/model/form/extra-settings.vue'
import { BpmAutoApproveType, BpmFormType, BpmModelType } from '@/api/bpm/constant'
import { DictSysShowHide } from '@/utils/constant'
import Modal from '@/utils/modal'
import modal from '@/utils/modal'

const emit = defineEmits(['refreshPage'])

const state: StateOptions  = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
    emit
  },
  dataForm: {
    // 基本信息
    id: '',
    name: '',
    key: '',
    category: '',
    description: '',
    type: BpmModelType.BPMN,
    visible: DictSysShowHide.SHOW,
    startUserIds: [],
    managerUserIds: [],
    // 表单信息
    formType: BpmFormType.NORMAL,
    formId: '',
    formConf: '',
    formFields: '',
    formCustomCreatePath: '',
    formCustomViewPath: '',
    // 更多设置
    icon: '',
    allowCancelRunningProcess: true,
    processIdRule: {
      enable: false,
      prefix: '',
      infix: '',
      postfix: '',
      length: 5,
    },
    autoApprovalType: BpmAutoApproveType.NONE,
    titleSetting: {
      enable: false,
      title: ''
    },
    summarySetting: {
      enable: false,
      summary: []
    }
  }
})

// 流程数据
const processData = ref<any>()

provide('processData', processData)

const active = ref(0)
const dataFormRef = ref()

// 组件引用
const basicInfoRef = ref()
const formDesignRef = ref()
const processDesignRef = ref()
const extraSettingsRef = ref()

// 数据列表
const categoryList = ref<any[]>([])
const userList = ref([])
const formList = ref([])

const { getData, handleSaveOrUpdate } = crud(state)

/**
 * 初始化详情数据
 *
 * @param id 主键ID
 */
const init = async (id?: string) => {
  state.visible = true
  state.dataForm.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // id 存在则为修改
  if (id) {
    getData(id)
  }
  // 获取分类列表
  const categoryListRes = await CategoryApi.postListApi({})
  categoryList.value = categoryListRes.data
  // 获取表单列表
  const formListRes = await FormApi.postListApi({})
  formList.value = formListRes.data
  // 加载用户数据
  UserApi.postListApi({}).then((res: any) => {
    userList.value = res.data
  })

  // 设置 active 切换到第一步
  active.value = 0
}

watch(
  async () => state.dataForm.type,
  () => {
    if (state.dataForm.type === BpmModelType.BPMN) {
      processData.value = state.dataForm.bpmnXml
    } else {
      processData.value = state.dataForm.simpleModel
    }
    console.debug('processData', processData.value)
  }
)

/**
 * 校验基本信息
 */
const validateBasicInfo = async () => {
  await basicInfoRef.value?.validate()
}

/**
 * 校验设计的表单
 */
const validateForm = async () => {
  await formDesignRef.value?.validate()
}

/**
 * 校验设计的流程
 */
const validateProcessDesign = () => {
  processDesignRef.value?.validate()
}

/**
 * 保存前校验所有步骤的数据
 */
const validateAllSteps = async () => {
  validateBasicInfo()
    .then(() => validateForm())
    .then(() => validateProcessDesign())
    .catch((error) => {
      console.error(error)
    })
}


/**
 * 表单保存
 */
const handleSave = async () => {
  try {
    // 校验所有步骤的数据
    await validateAllSteps()

    if (state.dataForm.id) {
      // 更新场景
      await ModelApi.saveOrUpdateApi(state.dataForm)
      // 询问是否发布流程
      Modal.confirm('修改流程成功，是否发布流程？').then(() => {
        return handleDeploy()
      }).catch(() => {})
    } else {
      // 新增场景
      ModelApi.saveOrUpdateApi(state.dataForm).then((res: any) => {
        // state.dataForm.id = res.data.id
        state.visible = false
        // 询问是否发布流程
        ElMessage.success('保存成功')
        emit('refreshPage')
      })
    }
  } catch (error: any) {
    console.error('保存失败', error)
    ElMessage.warning(error.message || '请完善所有步骤的必填信息')
  }
}

/**
 * 发布操作
 */
const handleDeploy = () => {
  return Promise.resolve()
    // 确认对话框处理
    .then(() => {
        if (!state.dataForm.id) {
          return modal.confirm('是否确认发布该流程？')
        } else {
          return Promise.resolve(null)
        }
      })
    // 验证所有步骤的数据
    .then(() => {
      return validateAllSteps()
    })
    // 数据保存处理
    .then(async () => {
      const data = await ModelApi.saveOrUpdateApi(state.dataForm).then((res) => res.data)
      if (!state.dataForm.id && data && data.id) { // 添加
        state.dataForm.id = data.id
      }
      if (!state.dataForm.id) {
        throw new Error('发布失败')
      }
    })
    // 部署流程
    .then(() => {
      return ModelApi.deployModelApi(state.dataForm.id)
    })
    // 处理成功结果
    .then(() => {
      ElMessage.success('发布成功')
    })
    // 统一错误处理
    .catch((error: any) => {
      console.error(error)
      const message = error.message === '用户取消发布' ? '' : error.message || '发布失败'
      if (message) {
        ElMessage.warning(message)
      }
    })
}

/**
 * 表单提交
 */
const handleSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    handleSaveOrUpdate()
  })
}

/**
 * 下一步
 */
const handleNext = async () => {
  console.log('active.value', active.value)
  try {
    if (active.value >= 0) {
      await validateBasicInfo()
    }
    if (active.value >= 1) {
      await validateForm()
    }
    if (active.value >= 2) {
      // await validateProcessDesign()
    }

    if (active.value++ > 3) active.value = 3
  } catch (error: any) {
    console.error('步骤切换失败', error)
    ElMessage.warning('请先完善当前步骤必填信息')
  }

}

const handlePrev = () => {
  if (active.value-- < 0) active.value = 0
}

defineExpose({
    init
})
</script>

<style lang="scss" scoped>
.el-container {
  justify-content: center;
}
//
.title-box {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
// 步骤条禁用背景色
.el-steps--simple {
  background: unset;
}
// 表单容器
.form-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  justify-content: center;
  align-items: center;
}
.el-step.is-simple {
  // 圆圈样式
  ::v-deep(.is-process) .el-step__icon {
    background: #1890ff;
    border: #1890ff;
    font-size: 12px;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    color: white;
    font-weight: bold;
  }

  ::v-deep(.is-success) .el-step__icon,::v-deep(.is-wait) .el-step__icon {
    background: white;
    border: 2px solid rgb(209 213 219 / 1);
    font-size: 12px;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    color: rgb(107 114 128 / 1);
    font-weight: bold;
  }

  // 标题
  ::v-deep(.el-step__title) {
    font-size: 14px;
    line-height: 20px;
    // 右上角小点默认不显示
    .el-badge__content {
      background-color: white;
    }
    // 右上角小点位置调整
    .el-badge__content.is-fixed.is-dot {
      right: -3px;
    }
    // 右上角小点显示样式
    &.is-process .el-badge__content.is-dot, &.is-wait .el-badge__content.is-dot {
      border-radius: 50%;
      height: 6px;
      padding: 0;
      right: 0;
      width: 6px;
      background-color: var(--el-color-danger);
    }
    // 字体样式
    &.is-success {
      color: var(--el-text-color-placeholder);
    }
  }
  // 底部横线
  &:has(.is-process)::before {
    position: absolute;
    bottom: -10px;
    inset-inline-start: -10%;
    display: inline-block;
    width: 80%;
    height: 2px;
    background-color: #1890ff;
    transition: width 0.3s, inset-inline-start 0.3s;
    transition-timing-function: ease-out;
    content: "";
  }
}
</style>
