<template>
  <el-select
    v-model="modelValue"
    :placeholder="placeholder"
    :clearable="clearable"
  >
    <el-option
      v-for="data in dataList"
      :key="data.dictValue"
      :label="data.dictLabel"
      :value="convertInteger(data.dictValue)"
    />
  </el-select>
</template>

<script setup lang="ts">
import { convertInteger, dictDataList } from '@/utils/tool'
import { useAppStore } from '@/stores/modules/app'
import { computed } from 'vue'

const appStore = useAppStore()
const props = defineProps({
  dictType: {
    type: String,
    required: true
  },
  clearable: {
    type: Boolean,
    required: false,
    default: () => false
  },
  placeholder: {
    type: String,
    required: false,
    default: () => ''
  }
})

const model = defineModel<number | string>()
const modelValue = computed({
  get: () => model.value ? model.value : '',
  set: (value) => {
    model.value = value
  }
})

const dataList = dictDataList(appStore.dictList, props.dictType)
</script>

<style scoped></style>
