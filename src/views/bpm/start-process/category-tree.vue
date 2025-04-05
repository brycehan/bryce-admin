<template>
  <el-container class="category-container">
    <el-input v-model="categoryName" class="w-full" clearable placeholder="请输入关键字过滤" />
    <el-tree
      ref="categoryListRef"
      :data="categoryList"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :props="{ label: 'name', children: 'children' }"
      :highlight-current="true"
      node-key="id"
      :current-node-key="currentNodeKey"
      @node-click="handleNodeClick"
      :default-expand-all="true"
      accordion
    />
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import * as categoryApi from '@/api/bpm/category'
import { StatusEnum } from '@/enums/system.ts'

const categoryName = ref()
const categoryList = ref()
const categoryListRef = ref()
const currentNodeKey = ref()

onMounted(() => {
  getCategoryList()
})

watch(categoryName, (value) => {
  categoryListRef.value.filter(value)
})

/**
 * 获取部门列表
 */
const getCategoryList = () => {
  categoryApi.postListApi({ status: StatusEnum.ENABLE }).then((response) => {
    categoryList.value = response.data || []
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
.category-container {
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
