<template>
  <el-container class="dept-container">
    <el-input v-model="deptName" class="w-full" clearable placeholder="请输入关键字过滤" />
    <el-tree
      ref="deptListRef"
      :data="deptList"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :props="{ label: 'name', children: 'children' }"
      :highlight-current="true"
      node-key="id"
      :current-node-key="currentNodeKey"
      :default-expand-all="true"
      accordion
      @node-click="handleNodeClick"
    />
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { postListApi as deptListApi } from '@/api/system/dept'

const deptName = ref()
const deptList = ref()
const deptListRef = ref()
const currentNodeKey = ref()

watch(deptName, (value) => {
  deptListRef.value.filter(value)
})

/**
 * 获取部门列表
 */
const getDeptList = () => {
  deptListApi({}).then((response) => {
    deptList.value = response.data || []
  })
}

const filterNode = (name: string, data: any) => {
  if (!name) {
    return true
  }

  return data.name.includes(name)
}

const emits = defineEmits(['nodeClick'])

const handleNodeClick = (row: any) => {
  if (currentNodeKey.value === row.id) {
    currentNodeKey.value = null
  } else {
    currentNodeKey.value = row.id
  }

  emits('nodeClick', currentNodeKey.value)
}

onMounted(() => {
  getDeptList()
})
</script>

<style scoped lang="scss">
.dept-container {
  flex-direction: column;
  min-height: calc(100vh - 72px - var(--app-header-height) - var(--app-main-tabs-height) - var(--app-footer-height));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  :deep(.el-tree) {
    margin-top: 20px;
  }
}
</style>
