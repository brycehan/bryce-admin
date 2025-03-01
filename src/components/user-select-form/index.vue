<template>
  <el-dialog v-model="visible" title="选择用户" :close-on-click-modal="false" :width="900" draggable>
    <el-row v-loading="loading">
      <el-col :span="6">
        <el-tree
          ref="orgTreeRef"
          :data="orgData"
          :expand-on-click-node="false"
          :props="{ label: 'name', children: 'children' }"
          highlight-current
          node-key="id"
          empty-text="加载中，请稍候..."
          default-expand-all
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="17">
        <el-transfer
          v-model="selectedUserIdList"
          :titles="['未选', '已选']"
          filterable
          filter-placeholder="搜索用户"
          :data="transferUserList"
          :props="{ label: 'nickname', key: 'id' }"
        />
      </el-col>
    </el-row>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import * as OrgApi from '@/api/system/org'
import * as UserApi from '@/api/system/user'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'SelectUserForm'
})

const emit = defineEmits<{ submit: [userList: any[]]}>()

// 弹窗是否展示
const visible = ref(false)
// 表单的加载中
const loading = ref(false)
// 机构数据
const orgData = ref<any[]>([])
// 所有用户列表
const userList = ref<any[]>([])
// 选中机构左侧过滤后的用户列表
const filteredUserList = ref<any[]>([])
// 选中的用户列表
const selectedUserIdList = ref<any[]>([])

/**
 * 所有用户列表
 */
const transferUserList = computed(() => {
  // 获取所有已选择的用户
  const selectedUsers = userList.value.filter((user: any) => {
    return selectedUserIdList.value.includes(user.id)
  })

  // 获取当前机构过滤后的未选择用户
  const filteredUnselectedUsers = filteredUserList.value.filter((user: any) => {
    return !selectedUserIdList.value.includes(user.id)
  })

  // 合并已选择用户和未选择用户
  return [
    ...selectedUsers,
    ...filteredUnselectedUsers
  ]
})

/**
 * 重复表单
 */
const resetForm = () => {
  orgData.value = []
  userList.value = []
  selectedUserIdList.value = []
}

/**
 * 获取机构列表中指定机构及所有子机构的ID列表
 *
 * @param orgId 指定机构ID
 * @param deptList 机构列表
 */
const getOrgIdAndChildOrgIds = (orgId: number, deptList: any[]) => {
  // 获取当前部门及所有子部门id列表
  const ids = [orgId]
  const children = deptList.filter((item: any) => item.parentId === orgId)
  children.forEach((item: any) => {
    ids.push(...getOrgIdAndChildOrgIds(item.id, deptList))
  })

  return ids
}

/**
 * 根据指定的机构ID过滤用户列表
 *
 * @param orgId 指定的机构ID
 */
const filterUserListByOrgId = (orgId?: any) => {
  loading.value = true
  try {
    // 如果没有选择机构，则显示所有用户
    if (!orgId) {
      filteredUserList.value = userList.value
      return
    }

    // 直接使用已保存的机构列表，获取当前机构及所有子机构的id列表
    const orgIds = getOrgIdAndChildOrgIds(orgId, orgData.value)

    // 过滤用户列表，只显示当前机构及所有子机构的用户
    filteredUserList.value = userList.value.filter((user: any) => {
      return orgIds.includes(user.orgId)
    })
  } finally {
    loading.value = false
  }
}

/**
 * 打开弹窗
 *
 * @param selectedList 已选用户列表
 */
const open = (selectedList: any[]) => {
  resetForm()
  // 加载机构数据
  OrgApi.postListApi({}).then((res) => {
    orgData.value = res.data
  })
  // 加载用户数据
  UserApi.postListApi({}).then((res) => {
    userList.value = res.data
    // 初始状态下，过滤用户列表等于所有用户列表
    filteredUserList.value = res.data
    // 设置选中
    selectedUserIdList.value = selectedList?.map((item: any) => item.id) || []
    visible.value = true
  })
}

/**
 * 机构树节点点击事件
 *
 * @param row 节点数据
 */
const handleNodeClick = (row: { [key: string]: any }) => {
  filterUserListByOrgId(row.id)
}

/**
 * 表单提交
 */
const handleSubmit = () => {
  ElMessage.success('修改成功')
  visible.value = false
  // 从所有用户列表中筛选出已选择的用户
  const selectedUsers = userList.value.filter((user: any) => {
    return selectedUserIdList.value.includes(user.id)
  })
  debugger
  // 发送提交事件
  emit('submit', selectedUsers)
}

defineExpose({
  open
})
</script>
