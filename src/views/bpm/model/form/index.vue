<template>
  <el-card shadow="never">
    <!-- 头部导航栏 -->
    <el-row>
      <!-- 左侧标题 -->
      <el-col :span="6" class="title-box">{{
        !route.params.id ? '新增流程' : '修改流程' + ' - ' + state.dataForm.name
      }}</el-col>
      <!-- 步骤条 -->
      <el-col :span="12">
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
      <el-col :span="6" class="el-container">
        <el-button type="success" v-auth:has-authority="'bpm:model:deploy'" v-if="route.params.id" @click="handleDeploy"
          >发布</el-button
        >
        <el-button type="primary" v-auth:has-any-authority="['bpm:model:save', 'bpm:model:update']" @click="handleSave"
          >保存</el-button
        >
        <el-button :type="active <= 0 ? '' : 'primary'" :disabled="active <= 0" @click="handlePrev()">上一步</el-button>
        <el-button :type="active >= 3 ? '' : 'primary'" :disabled="active >= 3" @click="handleNext()">下一步</el-button>
      </el-col>
    </el-row>
    <!-- 主体内容 -->
    <div class="form-container">
      <!-- 第一步：基本信息 -->
      <basic-info
        v-show="active === 0"
        v-model="dataForm"
        :category-list="categoryList"
        :user-list="userList"
        ref="basicInfoRef"
      />
      <!-- 第二步：设计表单 -->
      <form-design v-show="active === 1" v-model="dataForm" :form-list="formList" ref="formDesignRef" />
      <!-- 第三步：设计流程 -->
      <process-design v-show="active === 2" v-model="dataForm" ref="processDesignRef" />
      <!-- 第四步：更多设置 -->
      <extra-settings v-show="active === 3" v-model="dataForm" ref="extraSettingsRef" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { nextTick, onMounted, provide, reactive, ref, toRefs, unref, watch } from 'vue'
import * as CategoryApi from '@/api/bpm/category'
import * as FormApi from '@/api/bpm/form'
import * as UserApi from '@/api/system/user'
import modelApi from '@/api/bpm/model'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ElMessage } from 'element-plus'
import BasicInfo from '@/views/bpm/model/form/basic-info.vue'
import FormDesign from '@/views/bpm/model/form/form-design.vue'
import ProcessDesign from '@/views/bpm/model/form/process-design.vue'
import ExtraSettings from '@/views/bpm/model/form/extra-settings.vue'
import { BpmAutoApproveType, BpmFormType, BpmModelType } from '@/api/bpm/constant'
import modal from '@/utils/modal'
import _ from 'lodash'
import { useTabsStore } from '@/stores/modules/tabs.ts'
import { StatusEnum, SysShowHide } from '@/enums/system.ts'
import { useAuthStore } from '@/stores/modules/auth.ts'

const emit = defineEmits(['refreshPage'])

const state: StateOptions = reactive({
  api: {
    saveOrUpdateApi: modelApi.saveOrUpdateApi,
    getByIdApi: modelApi.getByIdApi,
    emit,
  },
  dataForm: {
    // 基本信息
    id: '',
    name: '',
    key: '',
    category: '',
    description: '',
    type: BpmModelType.BPMN,
    visible: SysShowHide.SHOW,
    startUserType: undefined,
    startUserIds: [],
    managerUserIds: [],
    // 设计表单
    formType: BpmFormType.NORMAL,
    formId: '',
    formConf: '',
    formFields: '',
    formCustomCreatePath: '',
    formCustomViewPath: '',
    // 设计流程
    bpmnXml: '',
    simpleModel: '',
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
      title: '',
    },
    summarySetting: {
      enable: false,
      summary: [],
    },
  },
})

const route = useRoute()

// 组件引用
const basicInfoRef = ref()
const formDesignRef = ref()
const processDesignRef = ref()
const extraSettingsRef = ref()

// 步骤控制
const active = ref(0)

// 流程数据
const processData = ref<any>()
const { dataForm } = toRefs(state)

provide('processData', processData)
provide('modelData', dataForm)

// 数据列表
const categoryList = ref<any[]>([])
const userList = ref([])
const formList = ref([])

const { getData } = crud(state)

const authStore = useAuthStore()

/**
 * 初始化流程数据
 */
const initProcessData = () => {
  console.log('initProcessData', state.dataForm.bpmnXml)
  if (state.dataForm.type === BpmModelType.BPMN) {
    processData.value = state.dataForm.bpmnXml
  } else {
    processData.value = state.dataForm.simpleModel
  }
  console.debug('processData', processData.value)
}

/**
 * 初始化详情数据
 */
const init = async () => {
  const id = route.params.id as string
  state.dataForm.id = ''

  // 加载用户数据
  await UserApi.postListApi({}).then((res: any) => {
    userList.value = res.data
    console.log('user data')
  })
  await nextTick()
  // id 存在则为修改
  if (id) {
    getData(id).then(() => {
      state.dataForm.startUserType = state.dataForm.startUserIds?.length > 0 ? 1 : 0
    })
  } else {
    // 新增场景
    state.dataForm.startUserType = 0 // 全体
    state.dataForm.managerUserIds.push(authStore.user.id)
  }
  // 获取分类列表
  const categoryListRes = await CategoryApi.postListApi({ status: StatusEnum.ENABLE })
  categoryList.value = categoryListRes.data
  // 获取表单列表
  const formListRes = await FormApi.postListApi({})
  formList.value = formListRes.data

  // 设置 active 切换到第一步
  active.value = 0
}

watch(
  () => state.dataForm.type,
  () => initProcessData(),
)

/**
 * 校验基本信息
 */
const validateBasicInfo = () => {
  return basicInfoRef.value?.validate()
}

/**
 * 校验设计表单
 */
const validateForm = () => {
  return formDesignRef.value?.validate()
}

/**
 * 校验设计流程
 */
const validateProcessDesign = () => {
  return processDesignRef.value?.validate()
}

/**
 * 清除设计表单校验错误消息
 */
const clearValidate = () => {
  return formDesignRef.value?.clearValidate()
}

/**
 * 校验所有步骤的数据
 */
const validateAllSteps = async () => {
  return validateBasicInfo()
    .then(() => validateForm())
    .then(() => validateProcessDesign())
}

/**
 * 校验当前步骤的数据
 */
const validateCurrentStep = async () => {
  switch (active.value) {
    case 0:
      return validateBasicInfo()
    case 1:
      return validateForm()
    case 2:
      return validateProcessDesign()
  }
}

const tabsStore = useTabsStore()
const router = useRouter()

/**
 * 表单保存
 */
const handleSave = async () => {
  Promise.resolve()
    // 验证所有步骤的数据
    .then(() => validateAllSteps())
    // 保存数据
    .then(() => modelApi.saveOrUpdateApi(state.dataForm))
    // 处理结果
    .then((res: any) => {
      // 修改场景
      if (state.dataForm.id) return

      // 新增场景
      if (_.size(res.data) != 36) {
        throw new Error('保存失败')
      }
      state.dataForm.id = res.data
    })
    // 询问是否发布流程
    .then(() => modal.confirm('保存成功，是否发布流程？'))
    // 直接发布流程
    .then(() => handleDirectDeploy())
    .then(() => {
      // 关闭当前页签
      tabsStore.deleteView(unref(router.currentRoute))
      // 跳转到流程列表页
      router.push({ path: '/bpm/model/index' })
    })
    .catch((error) => {
      if (error === 'cancel') return
      validateCurrentStep().then(() => {
        if (error.name != 'Error') ElMessage.warning('请完善所有步骤的必填信息')
      })
    })
}

/**
 * 发布操作
 */
const handleDeploy = () => {
  return (
    // 确认对话框处理
    modal
      .confirm('是否确认发布该流程？')
      // 验证所有步骤的数据
      .then(() => validateAllSteps())
      // 数据保存处理
      .then(() => modelApi.saveOrUpdateApi(state.dataForm))
      // 部署流程
      .then(() => modelApi.deployModelApi(state.dataForm.id))
      // 处理成功结果
      .then(() => ElMessage.success('发布成功'))
      .then(() => {
        // 关闭当前页签
        tabsStore.deleteView(unref(router.currentRoute))
        // 跳转到流程列表页
        router.push({ path: '/bpm/model/index' })
      })
      // 统一错误处理
      .catch((error: any) => {
        console.error(error)
      })
  )
}

/**
 * 直接发布操作
 */
const handleDirectDeploy = () => {
  return (
    Promise.resolve()
      // 部署流程
      .then(() => modelApi.deployModelApi(state.dataForm.id))
      // 处理成功结果
      .then(() => ElMessage.success('发布成功'))
      // 统一错误处理
      .catch((error: any) => {
        console.error(error)
      })
  )
}

/**
 * 下一步
 */
const handleNext = async () => {
  console.debug('active.value', active.value)
  try {
    if (active.value === 0) {
      await validateBasicInfo()
      clearValidate()
    }
    if (active.value === 1) {
      await validateForm()
    }
    if (active.value === 2) {
      await validateProcessDesign()
    }

    if (active.value++ > 3) active.value = 3
  } catch (error: any) {
    console.error('handleNext', error)
    ElMessage.warning('请完善当前步骤必填信息')
  }
}

const handlePrev = () => {
  if (active.value-- < 0) active.value = 0
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.el-container {
  justify-content: center;
}

.title-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

// 步骤条禁用背景色
.el-steps--simple {
  background: unset;
}

// 表单容器
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.el-step.is-simple {
  // 圆圈样式
  ::v-deep(.is-process) .el-step__icon {
    width: 24px;
    height: 24px;
    font-size: 12px;
    font-weight: bold;
    color: white;
    background: #1890ff;
    border: #1890ff;
    border-radius: 50%;
  }

  ::v-deep(.is-success) .el-step__icon,
  ::v-deep(.is-wait) .el-step__icon {
    width: 24px;
    height: 24px;
    font-size: 12px;
    font-weight: bold;
    color: rgb(107 114 128 / 100%);
    background: white;
    border: 2px solid rgb(209 213 219 / 100%);
    border-radius: 50%;
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
    &.is-process .el-badge__content.is-dot,
    &.is-wait .el-badge__content.is-dot {
      right: 0;
      width: 6px;
      height: 6px;
      padding: 0;
      background-color: var(--el-color-danger);
      border-radius: 50%;
    }

    // 字体样式
    &.is-success {
      color: var(--el-text-color-placeholder);
    }
  }

  // 底部横线
  &:has(.is-process)::before {
    position: absolute;
    inset-inline-start: -10%;
    bottom: -10px;
    display: inline-block;
    width: 80%;
    height: 2px;
    content: '';
    background-color: #1890ff;
    transition:
      width 0.3s,
      inset-inline-start 0.3s;
    transition-timing-function: ease-out;
  }
}
</style>
