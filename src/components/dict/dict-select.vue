<template>
  <el-select v-model="modelValue" :placeholder="placeholder" :clearable="clearable">
    <el-option
      v-for="data in dataList"
      :key="convertInteger(data.dictValue)"
      :label="data.dictLabel"
      :value="convertInteger(data.dictValue)"
    />
  </el-select>
</template>

<script setup lang="ts">
import { convertInteger } from '@/utils/tool.ts'
import { computed } from 'vue'
import { useDictStore } from '@/stores/modules/dict.ts'

const dictStore = useDictStore()
const props = defineProps({
  dictType: {
    type: String,
    required: true,
  },
  clearable: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  placeholder: {
    type: String,
    required: false,
    default: () => '',
  },
})

const model = defineModel<number | string>()
const modelValue = computed({
  get: () => model.value,
  set: (value) => {
    model.value = value
  },
})

const dataList = dictStore.getDictDataList(props.dictType)
</script>
