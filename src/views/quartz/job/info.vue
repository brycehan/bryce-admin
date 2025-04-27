<template>
  <el-dialog v-model="state.visible" title="定时任务详情" :close-on-click-modal="false">
    <el-form ref="dataFormRef" :model="state.dataForm" label-width="100" class="mr-4">
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务编号：">
            {{ state.dataForm.id }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务名称：">
            {{ state.dataForm.jobName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务组名：">
            {{ state.dataForm.jobGroup }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="bean名称：">
            {{ state.dataForm.beanName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="方法名称：">
            {{ state.dataForm.method }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="方法参数：">
            {{ state.dataForm.params }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="cron 表达式：">
            {{ state.dataForm.cronExpression }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态：">
            {{ state.dataForm.status ? '恢复' : '暂停' }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否并发：">
            {{ state.dataForm.concurrent === 1 ? '是' : '否' }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间：">
            {{ state.dataForm.createdTime }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="state.visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getByIdApi } from '@/api/quartz/job'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'

const state: StateOptions = reactive({
  api: {
    getByIdApi,
  },
  dataForm: {
    id: '',
    jobId: '',
    jobName: '',
    jobGroup: '',
    beanName: '',
    method: '',
    params: '',
    cronExpression: '',
    status: '',
    concurrent: '',
    createdTime: '',
  },
})

const dataFormRef = ref()

const { getData } = crud(state)

/**
 * 初始化详情数据
 *
 * @param id 定时任务id
 */
const init = (id: string) => {
  state.visible = true
  getData(id)
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
