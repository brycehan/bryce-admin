<template>
  <el-form
    ref="dataFormRef"
    :model="state.dataForm"
    label-width="60"
    class="mr-4"
  >
    <el-form-item label="标题" prop="title">
      <el-text> {{ state.dataForm.title }}</el-text>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="类型" prop="type">
          {{ dictStore.getDictLabel('sys_notice_type', state.dataForm.type) }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="状态" prop="status">
          {{ dictStore.getDictLabel('sys_status', state.dataForm.status) }}
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="内容">
      <div v-html="state.dataForm.content" class="mt-3"></div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getByIdApi, saveOrUpdateApi } from '@/api/system/notice'
import type { StateOptions } from '@/utils/state'
import { crud } from '@/utils/state'
import { useDictStore } from '@/stores/modules/dict.ts'

const emit = defineEmits(['refreshPage'])

const props = defineProps({
  noticeId: {
    type: String
  }
})

const state: StateOptions = reactive({
  api: {
    saveOrUpdateApi,
    getByIdApi,
    emit
  },
  dataForm: {
    id: '',
    title: '',
    content: '',
    type: 0,
    status: 1
  }
})

const dataFormRef = ref()
const dictStore = useDictStore()

const { getData } = crud(state)

/**
 * 初始化详情数据
 *
 * @param id ID
 */
const init = (id?: string) => {
  state.visible = true
  state.dataForm.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // id 存在则为修改
  if (id) {
    getData(id)
  }
}

onMounted(() => {
  if (props.noticeId) {
    init(props.noticeId)
  }
})
</script>
