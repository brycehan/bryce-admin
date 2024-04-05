<template>
  <el-select :model-value="modelValue + ''" :placeholder="placeholder" :clearable="clearable" @change="$emit('update:modelValue', $event)">
    <el-option v-for="data in dataList" :key="data.dictValue" :label="data.dictLabel" :value="data.dictValue" />
  </el-select>
</template>

<script setup lang="ts">
import { dictDataList } from "@/utils/tool";
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()

const props = defineProps({
  modelValue: {
    type: [Number, String],
    required: true
  },
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

const dataList = dictDataList(appStore.dictList, props.dictType)
</script>

<style scoped>

</style>
