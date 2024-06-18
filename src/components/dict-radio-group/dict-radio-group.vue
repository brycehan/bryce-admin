<template>
  <el-radio-group v-model="modelValue" :disabled="props.disabled">
    <el-radio v-for="data in dataList" :key="data.dictValue" :value="data.dictValue">
      {{ data.dictLabel }}
    </el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
import { dictDataList } from '@/utils/tool'
import { useAppStore } from '@/stores/modules/app'
import { computed } from 'vue'

const appStore = useAppStore()
const props = defineProps({
  dictType: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  }
})

const model = defineModel<string | number | boolean | undefined>()
const modelValue = computed({
  get: () => model.value,
  set: (value) => {
    model.value = value
  }
})

const dataList = dictDataList(appStore.dictList, props.dictType)
</script>
