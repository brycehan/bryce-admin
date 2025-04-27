<template>
  <el-dialog v-model="state.visible" title="操作日志详情" :close-on-click-modal="false">
    <el-form ref="dataFormRef" :model="state.dataForm" label-width="100" class="mr-4">
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作模块">
            {{ state.dataForm.moduleName }} / {{ state.dataForm.operatedType }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作状态">
            {{ state.dataForm.status ? '成功' : '失败' }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="请求URI">
            {{ state.dataForm.requestUri }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求方法">
            {{ state.dataForm.requestMethod }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="请求参数">
          <span class="param-content" v-html="state.dataForm.requestParam"></span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作时间">
            {{ state.dataForm.operatedTime }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行时长"> {{ state.dataForm.duration }}毫秒 </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作IP">
            {{ state.dataForm.ip }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作地点">
            {{ state.dataForm.location }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作账号">
            {{ state.dataForm.username }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门名称">
            {{ state.dataForm.deptName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="User Agent">
          {{ state.dataForm.userAgent }}
        </el-form-item>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="state.visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getByIdApi } from '@/api/system/operateLog'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'

const state: StateOptions = reactive({
  api: {
    getByIdApi,
  },
  dataForm: {
    id: '',
    name: '',
    moduleName: '',
    requestUri: '',
    requestMethod: '',
    requestParam: '',
    resultMessage: '',
    operatedType: '',
    operatedTime: '',
    duration: '',
    status: '',
    userAgent: '',
    ip: '',
    location: '',
    userId: '',
    username: '',
    deptName: '',
    createdTime: '',
  },
})

const dataFormRef = ref()

const { getData } = crud(state)

/**
 * 初始化详情数据
 *
 * @param id 操作日志id
 */
const init = (id?: string) => {
  state.visible = true
  state.dataForm.id = undefined

  // id 存在则为修改
  if (id) {
    getData(id)
  }
}

defineExpose({
  init,
})
</script>

<style scoped lang="scss">
.param-content {
  word-break: break-word;
}
</style>
