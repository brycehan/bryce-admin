<template>
  <el-card shadow="never">
    <el-form ref="queryFormRef" :model="state.queryForm" :inline="true" @keyup.enter="getList()" @submit.prevent>
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入机构名称" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-select v-model="state.queryForm.status" dict-type="sys_status" placeholder="机构状态" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getList()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth="'system:org:save'" type="primary" icon="Plus" @click="handleAddOrEdit()">新增</el-button>
    </el-row>
    <el-table
      v-loading="state.loading"
      :data="state.data"
      row-key="id"
      :border="true"
      style="width: 100%"
    >
      <el-table-column label="名称" prop="name" header-align="center" align="center" />
      <el-table-column label="排序" prop="sort" header-align="center" align="center" />
      <el-table-column label="状态" prop="status" header-align="center" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status === true" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status === false" type="info">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template #default="scope">
          <el-button v-auth="'system:org:update'" type="primary" link @click="handleAddOrEdit(scope.row.id)">修改</el-button>
          <el-button v-auth="'system:org:delete'" type="danger" link @click="handleDeleteBatch(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗，新增 / 修改 -->
    <AddOrEdit ref="addOrEditRef" @refresh-page="getList" />
  </el-card>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import AddOrEdit from './add-or-edit.vue'
import {deleteByIds, list} from '@/api/system/org'
import {ElMessage, ElMessageBox} from 'element-plus'
import type {StateOptions} from "@/utils/state";
import {crud} from "@/utils/state";

const state: StateOptions = reactive({
  api: {
    list
  },
  queryForm: {
        status: '',
        tenantId: '',
        name: ''
  },
  data: [],
  loading: false,
})

const queryFormRef = ref()
const addOrEditRef = ref()

onMounted(() => {
    getList()
})

const { getList } = crud(state)

/** 重置按钮操作 */
const handleResetQuery = () => {
  if(queryFormRef.value) {
    queryFormRef.value.resetFields()
  }

  getList()
}

const handleAddOrEdit = (id?: string) => {
    addOrEditRef.value.init(id)
}

const handleDeleteBatch = (id: string) => {
    let data: any[] = [id]
    ElMessageBox.confirm('确定进行删除操作？', '提示', {
        type: 'warning'
    })
        .then(() => {
            deleteByIds(data).then(() => {
                ElMessage.success('删除成功')
                getList()
            })
        })
        .catch((error) => {
            console.error(error)
        })
}

</script>
