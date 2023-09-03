<template>
  <el-card shadow="hover">
    <el-form :inline="true" :model="state.queryForm" @keyup.enter="getList()" @submit.prevent>
      <el-form-item>
        <el-input v-model="state.queryForm.name" placeholder="请输入机构名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-select v-model="state.queryForm.status" clearable placeholder="机构状态" style="width: 100%">
          <el-option label="正常" :value="true" />
          <el-option label="停用" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getList()">查询</el-button>
        <el-button type="primary" @click="handleAddOrEdit()">新增</el-button>
      </el-form-item>
    </el-form>
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
          <el-button type="primary" link @click="handleAddOrEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" link @click="handleDeleteBatch(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗，新增 / 修改 -->
    <AddOrEdit ref="addOrEditRef" @refresh-page="getList" />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddOrEdit from './add-or-edit.vue'
import { list, deleteByIds } from '@/api/system/org'
import { ElMessage, ElMessageBox } from 'element-plus'

const state = reactive({
    queryForm: {
          status: '',
          tenantId: '',
          name: ''
    },
    data: [],
    loading: false,
})

const addOrEditRef = ref()

onMounted(() => {
    getList()
})

const getList = () => {
    state.loading = true

    list(state.queryForm).then((response: any) => {debugger
        state.data = response.data
    })
    state.loading = false
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
