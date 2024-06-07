<template>
  <el-container class="org-container">
    <el-input v-model="orgName" class="w-100" clearable placeholder="请输入关键字过滤" />
    <el-tree
      ref="orgListRef"
      :data="orgList"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :props="{ label: 'name', children: 'children' }"
      :highlight-current="true"
      node-key="id"
      :current-node-key="currentNodeKey"
      @node-click="handleNodeClick"
      accordion
    />
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { list as orgListApi } from '@/api/system/org'

const orgName = ref()
const orgList = ref()
const orgListRef = ref()
const currentNodeKey = ref()

onMounted(() => {
  getOrgList()
})

watch(orgName, (value) => {
  orgListRef.value.filter(value)
})

/**
 * 获取机构列表
 */
const getOrgList = () => {
  orgListApi({}).then((response) => {
    orgList.value = response.data || []
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
</script>

<style scoped lang="scss">
.org-container {
  flex-direction: column;
  min-height: calc(100vh - 102px - var(--theme-header-height));
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  :deep(.el-tree) {
    margin-top: 20px;
  }
}
</style>
