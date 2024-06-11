<template>
  <el-card shadow="never">
    <el-tabs v-model="state.activeTab">
      <el-tab-pane :label="'图片素材（' + state.materialCount.imageCount + '）'" lazy>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddOrEdit from './add-or-edit.vue'
import { postPageApi, deleteMessageApi } from '@/api/mp/message'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'

const state = reactive({
  api: {},
  activeTab: 'image',
  materialCount: {
    imageCount: '..',
    videoCount: '..',
    voiceCount: '..',
    newsCount: '..'
  }
})

const queryFormRef = ref()
const addOrEditRef = ref()

onMounted(() => {
  getPage()
})

const { getPage, handleSizeChange, handleCurrentChange, handleDeleteBatch, handleSelectionChange } =
  crud(state)

/** 重置按钮操作 */
const handleResetQuery = () => {
  // for (const key in state.range) {
  //   state.range[key] = []
  // }

  if (queryFormRef.value) {
    queryFormRef.value.resetFields()
  }

  getPage()
}

/** 新增/修改 弹窗 */
const handleAddOrEdit = (id?: bigint) => {
  addOrEditRef.value.init(id)
}
</script>
