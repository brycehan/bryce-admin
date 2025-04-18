<!-- 审批详情的右侧：审批流 -->
<template>
  <el-timeline class="pt-[20px] !mx-4">
    <!-- 遍历每个审批节点 -->
    <el-timeline-item
      v-for="(activity, index) in activityNodes"
      :key="index"
      size="large"
      :icon="getApprovalNodeIcon(activity.status, activity.nodeType)"
      :color="getApprovalNodeColor(activity.status)"
    >

      <div class="flex flex-col items-start gap2" :id="`activity-task-${activity.id}-${index}`">
        <!-- 第一行：节点名称、时间 -->
        <div class="flex w-full">
          <div class="font-bold"> {{ activity.name }}</div>
          <!-- 信息：时间 -->
          <div
            v-if="activity.status !== TaskStatusEnum.NOT_START"
            class="text-[#a5a5a5] text-[13px] mt-1 ml-auto"
          >
            {{ getApprovalNodeTime(activity) }}
          </div>
        </div>
        <!-- 需要自定义选择审批人 -->
        <div
          class="flex flex-wrap gap2 items-center"
          v-if="
            isEmpty(activity.tasks) &&
            isEmpty(activity.candidateUsers) &&
            CandidateStrategy.START_USER_SELECT === activity.candidateStrategy
          "
        >
          <!--  && activity.nodeType === NodeType.USER_TASK_NODE -->

          <el-tooltip content="添加用户" placement="left">
            <el-button
              class="!px-[6px]"
              @click="handleSelectUser(activity.id, customApproveUsers[activity.id])"
            >
              <img class="w-[18px] text-[#ccc]" src="@/assets/svgs/bpm/add-user.svg" alt="" />
            </el-button>
          </el-tooltip>
          <div
            v-for="(user, idx1) in customApproveUsers[activity.id]"
            :key="idx1"
            class="bg-gray-100 h-[35px] rounded-3xl flex items-center pr-[8px] dark:color-gray-600 position-relative"
          >
            <el-avatar class="!m-[5px]" :size="28" v-if="user.avatar" :src="user.avatar" />
            <el-avatar class="!m-[5px]" :size="28" v-else>
              {{ user.nickname.substring(0, 1) }}
            </el-avatar>
            {{ user.nickname }}
          </div>
        </div>
        <div v-else class="flex items-center flex-wrap mt-1 gap2">
          <!-- 情况一：遍历每个审批节点下的【进行中】task 任务 -->
          <div v-for="(task, idx) in activity.tasks" :key="idx" class="flex flex-col pr-2 gap2">
            <div
              class="position-relative flex flex-wrap gap2"
              v-if="task.assigneeUser || task.ownerUser"
            >
              <!-- 信息：头像昵称 -->
              <div
                class="bg-gray-100 h-[35px] rounded-3xl flex items-center pr-[8px] dark:color-gray-600 position-relative"
              >
                <template v-if="task.assigneeUser?.avatar || task.assigneeUser?.nickname">
                  <el-avatar
                    class="!m-[5px]"
                    :size="28"
                    v-if="task.assigneeUser?.avatar"
                    :src="task.assigneeUser?.avatar"
                  />
                  <el-avatar class="!m-[5px]" :size="28" v-else>
                    {{ task.assigneeUser?.nickname.substring(0, 1) }}
                  </el-avatar>
                  {{ task.assigneeUser?.nickname }}
                </template>
                <template v-else-if="task.ownerUser?.avatar || task.ownerUser?.nickname">
                  <el-avatar
                    class="!m-[5px]"
                    :size="28"
                    v-if="task.ownerUser?.avatar"
                    :src="task.ownerUser?.avatar"
                  />
                  <el-avatar class="!m-[5px]" :size="28" v-else>
                    {{ task.ownerUser?.nickname.substring(0, 1) }}
                  </el-avatar>
                  {{ task.ownerUser?.nickname }}
                </template>
                <!-- 信息：任务 ICON -->
                <div
                  v-if="showStatusIcon && onlyStatusIconShow.includes(task.status)"
                  class="position-absolute top-[19px] left-[23px] rounded-full flex items-center p-[1px] border-2 border-white border-solid"
                  :style="{ backgroundColor: statusIconMap2[task.status]?.color }"
                >
                  <icon :size="11" :icon="statusIconMap2[task.status]?.icon" color="#FFFFFF" />
                </div>
              </div>
            </div>
            <teleport defer :to="`#activity-task-${activity.id}-${index}`">
              <div
                v-if="
                  task.reason &&
                  [NodeType.USER_TASK_NODE, NodeType.END_EVENT_NODE].includes(activity.nodeType)
                "
                class="text-[#a5a5a5] text-[13px] mt-1 w-full bg-#f8f8fa p2 rounded-md"
              >
                审批意见：{{ task.reason }}
              </div>
              <div
                v-if="task.signPicUrl && activity.nodeType === NodeType.USER_TASK_NODE"
                class="text-[#a5a5a5] text-[13px] mt-1 w-full bg-#f8f8fa p2 rounded-md"
              >
                签名：
                <el-image
                  class="w-[90px] h-[40px] ml-[5px]"
                  :src="task.signPicUrl"
                  :preview-src-list="[task.signPicUrl]"
                />
              </div>
            </teleport>
          </div>
          <!-- 情况二：遍历每个审批节点下的【候选的】task 任务。例如说，1）依次审批，2）未来的审批任务等 -->
          <div
            v-for="(user, idx1) in activity.candidateUsers"
            :key="idx1"
            class="bg-gray-100 h-[35px] rounded-3xl flex items-center pr-[8px] dark:color-gray-600 position-relative"
          >
            <el-avatar class="!m-[5px]" :size="28" v-if="user.avatar" :src="user.avatar" />
            <el-avatar class="!m-[5px]" :size="28" v-else>
              {{ user.nickname.substring(0, 1) }}
            </el-avatar>
            {{ user.nickname }}

            <!-- 信息：任务图标 -->
            <div
              v-if="showStatusIcon"
              class="position-absolute top-[20px] left-[24px] rounded-full flex items-center p-[1px] border-2 border-white border-solid"
              :style="{ backgroundColor: statusIconMap2['-1']?.color }"
            >
              <icon :size="11" :icon="statusIconMap2['-1']?.icon" color="#FFFFFF" />
            </div>
          </div>
        </div>
      </div>
    </el-timeline-item>
  </el-timeline>

  <!-- 用户选择弹窗 -->
  <UserSelectForm ref="userSelectFormRef" @confirm="handleUserSelectConfirm" />
</template>

<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import { TaskStatusEnum } from '@/api/bpm/task'
import { NodeType, CandidateStrategy } from '@/api/bpm/consts'
import { isEmpty } from '@/utils/is'
import { Check, Close, Loading, Clock, Minus, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import type { ApprovalNodeInfo } from '@/types/modules/bpm'

defineOptions({ name: 'BpmProcessInstanceTimeline' })
withDefaults(
  defineProps<{
    activityNodes: ApprovalNodeInfo[] // 审批节点信息
    showStatusIcon?: boolean // 是否显示头像右下角状态图标
  }>(),
  {
    showStatusIcon: true // 默认值为 true
  }
)

// 审批节点
const statusIconMap2 = {
  // 未开始
  '-1': { color: '#909398', icon: 'ep:clock' },
  // 待审批
  '0': { color: '#00b32a', icon: 'ep:loading' },
  // 审批中
  '1': { color: '#448ef7', icon: 'ep:loading' },
  // 审批通过
  '2': { color: '#00b32a', icon: 'ep:circle-check-filled' },
  // 审批不通过
  '3': { color: '#f46b6c', icon: 'fa-solid:times-circle' },
  // 取消
  '4': { color: '#cccccc', icon: 'ep:delete-filled' },
  // 退回
  '5': { color: '#f46b6c', icon: 'ep:remove-filled' },
  // 委派中
  '6': { color: '#448ef7', icon: 'ep:loading' },
  // 审批通过中
  '7': { color: '#00b32a', icon: 'ep:circle-check-filled' }
} as any

const statusIconMap = {
  // 审批未开始
  '-1': { color: '#909398', icon: Clock },
  '0': { color: '#00b32a', icon: Clock },
  // 审批中
  '1': { color: '#448ef7', icon: Loading },
  // 审批通过
  '2': { color: '#00b32a', icon: Check },
  // 审批不通过
  '3': { color: '#f46b6c', icon: Close },
  // 已取消
  '4': { color: '#cccccc', icon: Delete },
  // 退回
  '5': { color: '#f46b6c', icon: Minus },
  // 委派中
  '6': { color: '#448ef7', icon: Loading },
  // 审批通过中
  '7': { color: '#00b32a', icon: Check }
} as any

// 只有只有状态是 -1、0、1 才展示头像右小角状态小icon
const onlyStatusIconShow = [-1, 0, 1]

/**
 * 审批节点图标
 *
 * @param taskStatus 审批节点状态
 * @param nodeType 节点类型
 */
const getApprovalNodeIcon = (taskStatus: number, nodeType: any) => {
  if (taskStatus == TaskStatusEnum.NOT_START) {
    return statusIconMap[taskStatus]?.icon
  }

  if (
    nodeType === NodeType.START_USER_NODE ||
    nodeType === NodeType.USER_TASK_NODE ||
    nodeType === NodeType.END_EVENT_NODE
  ) {
    return statusIconMap[taskStatus]?.icon
  }
}

/**
 * 审批节点颜色
 *
 * @param taskStatus 审批节点状态
 */
const getApprovalNodeColor = (taskStatus: number) => {
  return statusIconMap[taskStatus]?.color
}

/**
 * 审批节点时间
 *
 * @param node 审批节点信息
 */
const getApprovalNodeTime = (node: ApprovalNodeInfo) => {
  if (node.nodeType === NodeType.START_USER_NODE && node.startTime) {
    return `${formatDate(node.startTime)}`
  }
  if (node.endTime) {
    return `${formatDate(node.endTime)}`
  }
  if (node.startTime) {
    return `${formatDate(node.startTime)}`
  }
}

// 选择自定义审批人
const userSelectFormRef = ref()
const handleSelectUser = (activityId: any, selectedList: any) => {
  userSelectFormRef.value.open(activityId, selectedList)
}
const emit = defineEmits<{
  selectUserConfirm: [id: any, userList: any[]]
}>()
const customApproveUsers: any = ref({}) // key：activityId，value：用户列表
// 选择完成
const handleUserSelectConfirm = (activityId: number, userList: any[]) => {
  customApproveUsers.value[activityId] = userList || []
  emit('selectUserConfirm', activityId, userList)
}
</script>
