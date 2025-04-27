<template>
  <el-tag v-if="data" :type="data?.type">
    {{ data?.dictLabel }}
  </el-tag>
</template>

<script setup lang="ts">
import { useDictStore } from '@/stores/modules/dict.ts'

const props = defineProps({
  dictType: {
    type: String,
    required: true,
  },
  value: {
    type: Object,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  },
})

const dictStore = useDictStore()
const data = dictStore.getDictDataList(props.dictType).find((element: any) => element.dictValue == props.value + '')
</script>
