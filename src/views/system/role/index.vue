<template>
  <el-card shadow="never">
    <el-form
      ref="queryFormRef"
      :model="state.queryForm"
      :inline="true"
      label-width="68px"
      @keyup.enter="getPage()"
      @submit.prevent
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="state.queryForm.name" placeholder="请输入角色名称" clearable />
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input v-model="state.queryForm.code" placeholder="请输入角色编码" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-select v-model="state.queryForm.status" dict-type="sys_status" placeholder="角色状态" clearable />
      </el-form-item>
      <el-form-item label="创建时间" prop="createdTime">
        <el-date-picker
          v-model="state.range.createdTime"
          type="daterange"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getPage()">搜索</el-button>
        <el-button icon="RefreshLeft" @click="handleResetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mb-2">
      <el-button v-auth="'system:role:save'" type="primary" icon="Plus" @click="handleAddOrEdit()">新增</el-button>
      <el-button v-auth="'system:role:delete'" type="danger" icon="Delete" @click="handleDeleteBatch()"
        >批量删除
      </el-button>
    </el-row>
    <el-table
      v-loading="state.loading"
      :data="state.data"
      :border="true"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column label="角色名称" prop="name" header-align="center" align="center" />
      <el-table-column label="角色编码" prop="code" sortable="custom" header-align="center" align="center" />
      <el-table-column label="显示顺序" prop="sort" sortable="custom" header-align="center" align="center" />
      <dict-table-column label="状态" prop="status" dict-type="sys_status" />
      <el-table-column label="创建时间" prop="createdTime" header-align="center" align="center" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="300">
        <template #default="scope">
          <el-button v-auth="'system:role:update'" type="primary" text @click="handleAddOrEdit(scope.row.id)"
            >修改
          </el-button>
          <el-button v-auth="'system:role:delete'" type="danger" text @click="handleDeleteBatch(scope.row.id)"
            >删除
          </el-button>
          <el-dropdown v-auth="'system:role:update'" @command="(command: string) => handleCommand(command, scope.row)">
            <el-button type="success" class="btn-more-link" text>更多</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="dataScope">数据权限</el-dropdown-item>
                <el-dropdown-item command="user">分配用户</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
    <AddOrEdit ref="addOrEditRef" @refresh-page="getPage" />
    <!-- 数据权限 -->
    <DataScope ref="dataScopeRef" />
    <!-- 分配用户 -->
    <el-drawer v-if="userVisible" v-model="userVisible" :title="userTitle" :size="1000">
      <User :role-id="roleId" />
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddOrEdit from './add-or-edit.vue'
import { postPageApi, deleteByIdsApi } from '@/api/system/role'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import DataScope from '@/views/system/role/data-scope.vue'
import User from '@/views/system/role/user.vue'

const state: StateOptions = reactive({
  api: {
    postPageApi,
    deleteByIdsApi
  },
  queryForm: {
    name: '',
    code: '',
    status: '',
    orgId: '',
    createdTime: ''
  },
  range: {
    createdTime: ''
  }
})

const queryFormRef = ref()
const addOrEditRef = ref()
const dataScopeRef = ref()

const userVisible = ref(false)
const userTitle = ref()
const roleId = ref()

onMounted(() => {
  getPage()
})

const { getPage, handleSizeChange, handleCurrentChange, handleDeleteBatch, handleSelectionChange, handleSortChange } =
  crud(state)

/** 重置按钮操作 */
const handleResetQuery = () => {
  for (const key in state.range) {
    state.range[key] = []
  }

  if (queryFormRef.value) {
    queryFormRef.value.resetFields()
  }

  getPage()
}

/**
 * 新增/修改 弹窗
 *
 * @param id 数据ID
 */
const handleAddOrEdit = (id?: bigint) => {
  addOrEditRef.value.init(id)
}

const handleCommand = (command: string, row: any) => {
  if (command === 'dataScope') {
    dataScopeRef.value.init(row.id)
  } else if (command === 'user') {
    roleId.value = row.id
    userTitle.value = '分配用户 - ' + row.name
    userVisible.value = true
  }
}
</script>

<style scoped lang="scss">
.btn-more-link {
  display: flex;
  line-height: normal;
  margin-left: 12px;
}

/*
 * 表格操作 dropdown 样式
 */
.el-table td.el-table__cell div .el-dropdown {
  height: 12px;
  line-height: 10px;
  border-radius: 0;

  padding-left: 0;
  margin-left: 0;
  border-left: 1px solid #e4e7ec;
  top: 7px;
}
</style>
