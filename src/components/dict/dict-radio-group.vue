<template>
  <el-radio-group v-model="modelValue" :disabled="props.disabled">
    <el-radio v-for="data in dataList" :key="data.dictValue" :value="convertInteger(data.dictValue)">
      {{ data.dictLabel }}
    </el-radio>
  </el-radio-group>
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
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  },
})

const model = defineModel<string | number | boolean | undefined>()
const modelValue = computed({
  get: () => model.value,
  set: (value) => {
    model.value = value
  },
})

const dataList = dictStore.getDictDataList(props.dictType)
</script>
