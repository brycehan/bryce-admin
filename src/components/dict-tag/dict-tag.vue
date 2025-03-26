<template>
  <el-tag v-if="data" :type="data?.type">
    {{ data?.dictLabel }}
  </el-tag>
</template>

<script setup lang="ts">
import { dictDataList, getDictLabel, getDictLabelClass } from '@/utils/tool'
import { useAppStore } from '@/stores/modules/app'

const props = defineProps({
  dictType: {
    type: String,
    required: true
  },
  value: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  }
})

const appStore = useAppStore()
const data = dictDataList(appStore.dictList, props.dictType).find((element: any) => element.dictValue == props.value + '')
</script>
