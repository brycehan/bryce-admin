<template>
  <el-card shadow="never">
    <el-form ref="queryFormRef" :model="state.queryForm" :inline="true" label-width="68px" @keyup.enter="getList()" @submit.prevent>
      <el-form-item label="公众号" prop="type">
        <el-select v-model="state.queryForm.appId" @change="init" placeholder="请选择公众号" clearable>
          <el-option v-for="item in state.data" :key="item.appId" :label="item.name" :value="item.appId" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="getList()">搜索</el-button>
      </el-form-item>
      <el-form-item class="data-btn-row">
        <el-button v-auth="'wechat:app:delete'" type="danger" icon="Delete" @click="handleDeleteMenu()">清除线上菜单</el-button>
        <el-button v-auth="'wechat:app:save'" type="success" icon="Select" @click="handleSubmit()">应用</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="dataFormRef" :model="state.dataForm" :inline="true" label-width="68px" @keyup.enter="handleSubmit()" @submit.prevent>
      <el-row>
        <el-form-item class="w-100 mt-2">
          <el-input v-model="state.dataForm.list" type="textarea" rows="20" placeholder="请输入菜单" autofocus class="menu-textarea" />
        </el-form-item>
      </el-row>
    </el-form>

  </el-card>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {list} from '@/api/wechat/app'
import { saveOrUpdate, getById, deleteByAppId } from '@/api/wechat/menu'
import type {StateOptions} from "@/utils/state";
import {crud} from "@/utils/state";
import {ElMessage, ElMessageBox} from "element-plus";
import jsYaml from 'js-yaml'

const state: StateOptions = reactive({
  api: {
    list
  },
  queryForm: {
    appId: '',
  },
  dataForm: {
    list: []
  },
  data: []
})

const queryFormRef = ref()
const dataFormRef = ref()

onMounted(() => {
  getList()
})

const {
  getList
} = crud(state)

/**
 * 初始化微信菜单
 */
const init = () => {
  if(state.queryForm.appId != '') {
    getById(state.queryForm.appId).then((res: any) => {
      state.dataForm.list = jsYaml.dump(res.data);
      ElMessage.success('操作成功')
    })
  }
}
const handleDeleteMenu = () => {
    if (state.queryForm.appId === '') {
      ElMessage.warning('请先选择公众号')
      return
    }

  ElMessageBox.confirm('确定清空线上菜单吗？', '提示', {
    type: 'warning'
  })
      .then(() => {
        deleteByAppId(state.queryForm.appId).then(() => {
          ElMessage.success('清理成功')
          init()
        })
      })
      .catch((error) => {
        console.error(error)
      })
}

/** 表单提交 */
const handleSubmit = () => {
  if(state.queryForm.appId != '') {
    const data = jsYaml.load(state.dataForm.list);
    saveOrUpdate(state.queryForm.appId, data).then(() => {
      ElMessage.success('操作成功')
    })
  }
}

</script>

<style scoped lang="scss">
.menu-textarea {
  width: 100%;
}

.data-btn-row {
  float: right;
}
</style>
