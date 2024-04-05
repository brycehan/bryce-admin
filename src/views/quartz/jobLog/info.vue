<template>
  <el-dialog v-model="state.visible" title="定时任务日志详情" :close-on-click-modal="false">
    <el-form ref="dataFormRef" :model="state.dataForm" label-width="100px" class="mr-4">
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务ID">
            {{ state.dataForm.id }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务名称">
            {{ state.dataForm.jobName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务组名">
            {{ state.dataForm.jobGroup }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="bean名称">
            {{ state.dataForm.beanName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="方法名称">
            {{ state.dataForm.method }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="方法参数">
            {{ state.dataForm.params }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="执行时间">
            {{ state.dataForm.createdTime }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="执行时长"> {{ state.dataForm.duration }}毫秒 </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="执行状态">
            {{ state.dataForm.executeStatus ? '成功' : '失败' }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="错误信息">
          {{ state.dataForm.errorInfo == '' ? '无' : state.dataForm.errorInfo }}
        </el-form-item>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="state.visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { getById } from '@/api/quartz/jobLog'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'

const state: StateOptions = reactive({
  api: {
    getById
  },
  dataForm: {
    id: '',
    jobId: '',
    jobName: '',
    jobGroup: '',
    beanName: '',
    method: '',
    params: '',
    errorInfo: '',
    duration: '',
    createdTime: ''
  }
})

const dataFormRef = ref()

const { getData } = crud(state)

/** 初始化详情数据 */
const init = (id?: bigint) => {
  state.visible = true
  state.dataForm.id = undefined

  // id 存在则为修改
  if (id) {
    getData(id)
  }
}

defineExpose({
  init
})
</script>

<style scoped lang="scss">
.param-content {
  word-break: break-word;
}
</style>
