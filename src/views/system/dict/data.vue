<template>
  <el-row class="mb-2">
    <el-button v-auth:has-authority="'system:dictData:save'" type="primary" plain icon="Plus" @click="handleAddOrEdit()"
      >新增
    </el-button>
    <el-button
      v-auth:has-authority="'system:dictData:delete'"
      type="danger"
      plain
      icon="Delete"
      @click="handleDeleteBatch('dictLabel', '字典标签')"
      >删除
    </el-button>
  </el-row>
  <el-table
    v-loading="state.loading as boolean"
    :data="state.data"
    :border="true"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" header-align="center" align="center" width="50" />
    <el-table-column label="字典标签" prop="dictLabel" header-align="center" align="center">
      <template #default="scope">
        <el-tag v-if="scope.row.labelClass" :type="scope.row.labelClass" size="small">
          {{ scope.row.dictLabel }}
        </el-tag>
        <el-tag v-else type="primary" size="small">{{ scope.row.dictLabel }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="字典值" prop="dictValue" header-align="center" align="center" />
    <el-table-column label="显示顺序" prop="sort" sortable="custom" header-align="center" align="center" width="120" />
    <dict-table-column label="状态" prop="status" dict-type="sys_status" min-width="80" />
    <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" />
    <el-table-column label="操作" fixed="right" header-align="center" align="center" width="180">
      <template #default="scope">
        <el-space :spacer="spacer" class="!gap-0">
          <el-button
            v-auth:has-authority="'system:dictData:update'"
            type="primary"
            class="!px-0"
            icon="edit"
            text
            @click="handleAddOrEdit(scope.row.id)"
            >修改
          </el-button>
          <el-button
            v-auth:has-authority="'system:dictData:delete'"
            type="danger"
            class="!px-0"
            icon="delete"
            text
            @click="handleDeleteBatch('dictLabel', '字典标签', scope.row)"
            >删除
          </el-button>
        </el-space>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    :current-page="state.current"
    :page-size="state.size"
    :total="state.total"
    :page-sizes="state.pageSizes"
    :layout="state.layout"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />

  <!-- 弹窗，新增 / 修改 -->
  <add-or-edit ref="addOrEditRef" @refresh-page="getPage" />
</template>

<script setup lang="ts">
import AddOrEdit from './data-add-or-edit.vue'
import { postPageApi, deleteByIdsApi } from '@/api/system/dictData'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { ElDivider } from 'element-plus'

const props = defineProps({
  dictTypeId: {
    type: Number,
    required: true,
  },
})
const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi,
  },
  queryForm: {
    dictTypeId: props.dictTypeId,
  },
  orderItems: [
    {
      column: 'sort',
      asc: true,
    },
  ],
})

const addOrEditRef = ref()
const authStore = useAuthStore()
const spacer = h(ElDivider, { direction: 'vertical' })

const { getPage, handleSizeChange, handleCurrentChange, handleDeleteBatch, handleSelectionChange } = crud(state)

/**
 * 新增/修改 弹窗
 *
 * @param id 数据ID
 */
const handleAddOrEdit = (id?: string) => {
  if (!authStore.permitAccess()) return
  addOrEditRef.value.dataForm.dictTypeId = props.dictTypeId
  addOrEditRef.value.init(id)
}

onMounted(() => {
  getPage()
})
</script>
