<!-- UserTask 自定义配置：
     1. 审批人与提交人为同一人时
     2. 审批人拒绝时
     3. 审批人为空时
     4. 操作按钮
     5. 字段权限
     6. 审批类型
     7. 是否需要签名
-->
<template>
  <div>
    <el-divider content-position="left">审批类型</el-divider>
    <el-form-item prop="approveType">
      <el-radio-group v-model="approveType.value">
        <el-radio v-for="(item, index) in APPROVE_TYPE" :key="index" :value="item.value" :label="item.value">
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-divider content-position="left">审批人拒绝时</el-divider>
    <el-form-item prop="rejectHandlerType">
      <el-radio-group
        v-model="rejectHandlerType"
        :disabled="returnTaskList.length === 0"
        @change="updateRejectHandlerType"
      >
        <div class="flex-col">
          <div v-for="(item, index) in REJECT_HANDLER_TYPES" :key="index">
            <el-radio :key="item.value" :value="item.value" :label="item.label" />
          </div>
        </div>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="rejectHandlerType == RejectHandlerType.RETURN_USER_TASK" label="驳回节点" prop="returnNodeId">
      <el-select v-model="returnNodeId" clearable style="width: 100%" @change="updateReturnNodeId">
        <el-option v-for="item in returnTaskList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>

    <el-divider content-position="left">审批人为空时</el-divider>
    <el-form-item prop="assignEmptyHandlerType">
      <el-radio-group v-model="assignEmptyHandlerType" @change="updateAssignEmptyHandlerType">
        <div class="flex-col">
          <div v-for="(item, index) in ASSIGN_EMPTY_HANDLER_TYPES" :key="index">
            <el-radio :key="item.value" :value="item.value" :label="item.label" />
          </div>
        </div>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      v-if="assignEmptyHandlerType == AssignEmptyHandlerType.ASSIGN_USER"
      label="指定用户"
      prop="assignEmptyHandlerUserIds"
      span="24"
    >
      <el-select v-model="assignEmptyUserIds" clearable multiple style="width: 100%" @change="updateAssignEmptyUserIds">
        <el-option v-for="item in userOptions" :key="item.id" :label="item.nickname" :value="item.id" />
      </el-select>
    </el-form-item>

    <el-divider content-position="left">审批人与提交人为同一人时</el-divider>
    <el-radio-group v-model="assignStartUserHandlerType" @change="updateAssignStartUserHandlerType">
      <div class="flex-col">
        <div v-for="(item, index) in ASSIGN_START_USER_HANDLER_TYPES" :key="index">
          <el-radio :key="item.value" :value="item.value" :label="item.label" />
        </div>
      </div>
    </el-radio-group>

    <el-divider content-position="left">操作按钮</el-divider>
    <div class="button-setting-pane">
      <div class="button-setting-title">
        <div class="button-title-label">操作按钮</div>
        <div class="button-title-label pl-4">显示名称</div>
        <div class="button-title-label">启用</div>
      </div>
      <div v-for="(item, index) in buttonsSettingEl" :key="index" class="button-setting-item">
        <div class="button-setting-item-label">{{ OPERATION_BUTTON_NAME.get(item.id) }}</div>
        <div class="button-setting-item-label">
          <input
            v-if="btnDisplayNameEdit[index]"
            v-model="item.displayName"
            v-mountedFocus
            type="text"
            class="editable-title-input"
            :placeholder="item.displayName"
            @blur="btnDisplayNameBlurEvent(index)"
          />
          <el-button v-else text @click="changeBtnDisplayName(index)"
            >{{ item.displayName }} &nbsp;<icon icon="ep:edit"
          /></el-button>
        </div>
        <div class="button-setting-item-label">
          <el-switch v-model="item.enable" />
        </div>
      </div>
    </div>

    <el-divider content-position="left">字段权限</el-divider>
    <div v-if="formType === 10" class="field-setting-pane">
      <div class="field-permit-title">
        <div class="setting-title-label first-title">字段名称</div>
        <div class="other-titles">
          <span class="setting-title-label">只读</span>
          <span class="setting-title-label">可编辑</span>
          <span class="setting-title-label">隐藏</span>
        </div>
      </div>
      <div v-for="(item, index) in fieldsPermissionEl" :key="index" class="field-setting-item">
        <div class="field-setting-item-label">{{ item.title }}</div>
        <el-radio-group v-model="item.permission" class="field-setting-item-group">
          <div class="item-radio-wrap">
            <el-radio :value="FieldPermissionType.READ" size="large" :label="FieldPermissionType.READ"
              ><span></span
            ></el-radio>
          </div>
          <div class="item-radio-wrap">
            <el-radio :value="FieldPermissionType.WRITE" size="large" :label="FieldPermissionType.WRITE"
              ><span></span
            ></el-radio>
          </div>
          <div class="item-radio-wrap">
            <el-radio :value="FieldPermissionType.NONE" size="large" :label="FieldPermissionType.NONE"
              ><span></span
            ></el-radio>
          </div>
        </el-radio-group>
      </div>
    </div>

    <el-divider content-position="left">是否需要签名</el-divider>
    <el-form-item prop="signEnable">
      <el-switch v-model="signEnable.value" active-text="是" inactive-text="否" />
    </el-form-item>

    <el-divider content-position="left">审批意见</el-divider>
    <el-form-item prop="reasonRequire">
      <el-switch v-model="reasonRequire.value" active-text="必填" inactive-text="非必填" />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, type Ref, toRaw, watch, nextTick, onMounted } from 'vue'
import {
  ASSIGN_START_USER_HANDLER_TYPES,
  RejectHandlerType,
  REJECT_HANDLER_TYPES,
  ASSIGN_EMPTY_HANDLER_TYPES,
  AssignEmptyHandlerType,
  OPERATION_BUTTON_NAME,
  DEFAULT_BUTTON_SETTING,
  FieldPermissionType,
  APPROVE_TYPE,
  ApproveType,
  type ButtonSetting,
} from '@/api/bpm/consts'
import * as UserApi from '@/api/system/user'
import { useFormFieldsPermission } from '@/api/bpm/nodeUtils.ts'
import _ from 'lodash'

defineOptions({ name: 'ElementCustomConfig4UserTask' })
const props = defineProps({
  id: String,
  type: String,
})
const prefix = inject('prefix')

// 审批人与提交人为同一人时
const assignStartUserHandlerTypeEl = ref()
const assignStartUserHandlerType = ref()

// 审批人拒绝时
const rejectHandlerTypeEl = ref()
const rejectHandlerType = ref()
const returnNodeIdEl = ref()
const returnNodeId = ref()
const returnTaskList = ref<any[]>([])

// 审批人为空时
const assignEmptyHandlerTypeEl = ref()
const assignEmptyHandlerType = ref()
const assignEmptyUserIdsEl = ref()
const assignEmptyUserIds = ref()

// 操作按钮
const buttonsSettingEl = ref()
const { btnDisplayNameEdit, changeBtnDisplayName, btnDisplayNameBlurEvent } = useButtonsSetting()

// 字段权限
const fieldsPermissionEl = ref<any[]>([])
const { formType, fieldsPermissionConfig, getNodeConfigFormFields } = useFormFieldsPermission(FieldPermissionType.READ)

// 审批类型
const approveType = ref({ value: ApproveType.USER })

// 是否需要签名
const signEnable = ref({ value: false })

// 审批意见
const reasonRequire = ref({ value: false })

const elExtensionElements = ref()
const otherExtensions = ref()
const bpmnElement = ref()
const bpmnInstances = () => (window as any)?.bpmnInstances

const resetCustomConfigList = () => {
  bpmnElement.value = bpmnInstances().bpmnElement

  // 获取可回退的列表
  returnTaskList.value = findAllPredecessorsExcludingStart(bpmnElement.value.id, bpmnInstances().modeler)

  // 获取元素扩展属性 或者 创建扩展属性
  elExtensionElements.value =
    bpmnElement.value.businessObject?.extensionElements ??
    bpmnInstances().moddle.create('bpmn:ExtensionElements', { values: [] })

  // 审批类型
  approveType.value =
    elExtensionElements.value.values?.filter((ex: any) => ex.$type === `${prefix}:ApproveType`)?.[0] ||
    bpmnInstances().moddle.create(`${prefix}:ApproveType`, { value: ApproveType.USER })

  // 审批人与提交人为同一人时
  assignStartUserHandlerTypeEl.value =
    elExtensionElements.value.values?.filter((ex: any) => ex.$type === `${prefix}:AssignStartUserHandlerType`)?.[0] ||
    bpmnInstances().moddle.create(`${prefix}:AssignStartUserHandlerType`, { value: 1 })
  assignStartUserHandlerType.value = assignStartUserHandlerTypeEl.value.value

  // 审批人拒绝时
  rejectHandlerTypeEl.value =
    elExtensionElements.value.values?.filter((ex: any) => ex.$type === `${prefix}:RejectHandlerType`)?.[0] ||
    bpmnInstances().moddle.create(`${prefix}:RejectHandlerType`, { value: 1 })
  rejectHandlerType.value = rejectHandlerTypeEl.value.value
  returnNodeIdEl.value =
    elExtensionElements.value.values?.filter((ex: any) => ex.$type === `${prefix}:RejectReturnTaskId`)?.[0] ||
    bpmnInstances().moddle.create(`${prefix}:RejectReturnTaskId`, { value: '' })
  returnNodeId.value = returnNodeIdEl.value.value

  // 审批人为空时
  assignEmptyHandlerTypeEl.value =
    elExtensionElements.value.values?.filter((ex: any) => ex.$type === `${prefix}:AssignEmptyHandlerType`)?.[0] ||
    bpmnInstances().moddle.create(`${prefix}:AssignEmptyHandlerType`, { value: 1 })
  assignEmptyHandlerType.value = assignEmptyHandlerTypeEl.value.value
  assignEmptyUserIdsEl.value =
    elExtensionElements.value.values?.filter((ex: any) => ex.$type === `${prefix}:AssignEmptyUserIds`)?.[0] ||
    bpmnInstances().moddle.create(`${prefix}:AssignEmptyUserIds`, { value: '' })
  assignEmptyUserIds.value = assignEmptyUserIdsEl.value.value?.split(',')

  // 操作按钮
  buttonsSettingEl.value = elExtensionElements.value.values?.filter(
    (ex: any) => ex.$type === `${prefix}:ButtonsSetting`,
  )
  if (buttonsSettingEl.value.length === 0) {
    DEFAULT_BUTTON_SETTING.forEach((item) => {
      buttonsSettingEl.value.push(
        bpmnInstances().moddle.create(`${prefix}:ButtonsSetting`, {
          'flowable:id': item.id,
          'flowable:displayName': item.displayName,
          'flowable:enable': item.enable,
        }),
      )
    })
  }

  // 字段权限
  if (formType.value === 10) {
    const fieldsPermissionList = elExtensionElements.value.values?.filter(
      (ex: any) => ex.$type === `${prefix}:FieldsPermission`,
    )
    fieldsPermissionEl.value = []
    getNodeConfigFormFields()
    // 由于默认添加了发起人元素，这里需要删掉
    fieldsPermissionConfig.value = fieldsPermissionConfig.value.slice(1)
    fieldsPermissionConfig.value.forEach((element) => {
      element.permission = fieldsPermissionList?.find((obj: any) => obj.field === element.field)?.permission ?? '1'
      fieldsPermissionEl.value.push(bpmnInstances().moddle.create(`${prefix}:FieldsPermission`, element))
    })
  }

  // 是否需要签名
  signEnable.value =
    elExtensionElements.value.values?.filter((ex: any) => ex.$type === `${prefix}:SignEnable`)?.[0] ||
    bpmnInstances().moddle.create(`${prefix}:SignEnable`, { value: false })

  // 审批意见
  reasonRequire.value =
    elExtensionElements.value.values?.filter((ex: any) => ex.$type === `${prefix}:ReasonRequire`)?.[0] ||
    bpmnInstances().moddle.create(`${prefix}:ReasonRequire`, { value: false })

  // 保留剩余扩展元素，便于后面更新该元素对应属性
  otherExtensions.value =
    elExtensionElements.value.values?.filter(
      (ex: any) =>
        ex.$type !== `${prefix}:AssignStartUserHandlerType` &&
        ex.$type !== `${prefix}:RejectHandlerType` &&
        ex.$type !== `${prefix}:RejectReturnTaskId` &&
        ex.$type !== `${prefix}:AssignEmptyHandlerType` &&
        ex.$type !== `${prefix}:AssignEmptyUserIds` &&
        ex.$type !== `${prefix}:ButtonsSetting` &&
        ex.$type !== `${prefix}:FieldsPermission` &&
        ex.$type !== `${prefix}:ApproveType` &&
        ex.$type !== `${prefix}:SignEnable` &&
        ex.$type !== `${prefix}:ReasonRequire`,
    ) ?? []

  // 更新元素扩展属性，避免后续报错
  updateElementExtensions()
}

const updateAssignStartUserHandlerType = () => {
  assignStartUserHandlerTypeEl.value.value = assignStartUserHandlerType.value

  updateElementExtensions()
}

const updateRejectHandlerType = () => {
  rejectHandlerTypeEl.value.value = rejectHandlerType.value

  returnNodeId.value = returnTaskList.value[0].id
  returnNodeIdEl.value.value = returnNodeId.value

  updateElementExtensions()
}

const updateReturnNodeId = () => {
  returnNodeIdEl.value.value = returnNodeId.value

  updateElementExtensions()
}

const updateAssignEmptyHandlerType = () => {
  assignEmptyHandlerTypeEl.value.value = assignEmptyHandlerType.value

  updateElementExtensions()
}

const updateAssignEmptyUserIds = () => {
  assignEmptyUserIdsEl.value.value = assignEmptyUserIds.value.toString()

  updateElementExtensions()
}

const updateElementExtensions = () => {
  const extensions = bpmnInstances().moddle.create('bpmn:ExtensionElements', {
    values: [
      ...otherExtensions.value,
      assignStartUserHandlerTypeEl.value,
      rejectHandlerTypeEl.value,
      returnNodeIdEl.value,
      assignEmptyHandlerTypeEl.value,
      assignEmptyUserIdsEl.value,
      approveType.value,
      ...buttonsSettingEl.value,
      ...fieldsPermissionEl.value,
      signEnable.value,
      reasonRequire.value,
    ],
  })
  bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
    extensionElements: extensions,
  })
}

watch(
  () => props.id,
  (val) => {
    if (_.isString(val) && val.length) nextTick(() => resetCustomConfigList())
  },
  { immediate: true },
)

function findAllPredecessorsExcludingStart(elementId: any, modeler: any) {
  const elementRegistry = modeler.get('elementRegistry')
  const allConnections = elementRegistry.filter((element: any) => element.type === 'bpmn:SequenceFlow')
  const predecessors = new Set() // 使用 Set 来避免重复节点
  const visited = new Set() // 用于记录已访问的节点

  // 检查是否是开始事件节点
  function isStartEvent(element: any) {
    return element.type === 'bpmn:StartEvent'
  }

  function findPredecessorsRecursively(element: any) {
    // 如果该节点已经访问过，直接返回，避免循环
    if (visited.has(element)) {
      return
    }

    // 标记当前节点为已访问
    visited.add(element)

    // 获取与当前节点相连的所有连接
    const incomingConnections = allConnections.filter((connection: any) => connection.target === element)

    incomingConnections.forEach((connection: any) => {
      const source = connection.source // 获取前置节点

      // 只添加不是开始事件的前置节点
      if (!isStartEvent(source)) {
        predecessors.add(source.businessObject)
        // 递归查找前置节点
        findPredecessorsRecursively(source)
      }
    })
  }

  const targetElement = elementRegistry.get(elementId)
  if (targetElement) {
    findPredecessorsRecursively(targetElement)
  }

  return Array.from(predecessors) // 返回前置节点数组
}

function useButtonsSetting() {
  const buttonsSetting = ref<ButtonSetting[]>()
  // 操作按钮显示名称可编辑
  const btnDisplayNameEdit = ref<boolean[]>([])
  const changeBtnDisplayName = (index: number) => {
    btnDisplayNameEdit.value[index] = true
  }
  const btnDisplayNameBlurEvent = (index: number) => {
    btnDisplayNameEdit.value[index] = false
    const buttonItem = buttonsSetting.value![index]
    buttonItem.displayName = buttonItem.displayName || OPERATION_BUTTON_NAME.get(buttonItem.id)!
  }
  return {
    buttonsSetting,
    btnDisplayNameEdit,
    changeBtnDisplayName,
    btnDisplayNameBlurEvent,
  }
}

const userOptions = ref<any[]>([]) // 用户列表

onMounted(async () => {
  // 获得用户列表
  userOptions.value = await UserApi.postListApi({}).then((res: any) => res.data)
})
</script>

<style lang="scss" scoped>
.button-setting-pane {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  font-size: 14px;

  .button-setting-desc {
    padding-right: 8px;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 700;
  }

  .button-setting-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 45px;
    padding-left: 12px;
    background-color: #f8fafc0a;
    border: 1px solid #1f38581a;

    & > :first-child {
      width: 100px !important;
      text-align: left !important;
    }

    & > :last-child {
      text-align: center !important;
    }

    .button-title-label {
      width: 150px;
      font-size: 13px;
      font-weight: 700;
      color: #000;
      text-align: left;
    }
  }

  .button-setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 38px;
    padding-left: 12px;
    border: 1px solid #1f38581a;
    border-top: 0;

    & > :first-child {
      width: 100px !important;
    }

    & > :last-child {
      text-align: center !important;
    }

    .button-setting-item-label {
      width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      white-space: nowrap;
    }

    .editable-title-input {
      max-width: 130px;
      height: 24px;
      margin-left: 4px;
      line-height: 24px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      transition: all 0.3s;

      &:focus {
        outline: 0;
        border-color: #40a9ff;
        box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
      }
    }
  }
}

.field-setting-pane {
  display: flex;
  flex-direction: column;
  font-size: 14px;

  .field-setting-desc {
    padding-right: 8px;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 700;
  }

  .field-permit-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 45px;
    padding-left: 12px;
    line-height: 45px;
    background-color: #f8fafc0a;
    border: 1px solid #1f38581a;

    .first-title {
      text-align: left !important;
    }

    .other-titles {
      display: flex;
      justify-content: space-between;
    }

    .setting-title-label {
      display: inline-block;
      width: 100px;
      padding: 5px 0;
      font-size: 13px;
      font-weight: 700;
      color: #000;
      text-align: center;
    }
  }

  .field-setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 38px;
    padding-left: 12px;
    border: 1px solid #1f38581a;
    border-top: 0;

    .field-setting-item-label {
      display: inline-block;
      width: 100px;
      min-height: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: text;
    }

    .field-setting-item-group {
      display: flex;
      justify-content: space-between;

      .item-radio-wrap {
        display: inline-block;
        width: 100px;
        text-align: center;
      }
    }
  }
}
</style>
