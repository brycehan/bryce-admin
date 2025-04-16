<!-- 数据字典 Select 选择器 -->
<template>
  <el-select v-if="selectType === 'select'" class="w-1/1" v-bind="attrs">
    <el-option
      v-for="(dict, index) in getDictOptions"
      :key="index"
      :label="dict.label"
      :value="dict.value"
    />
  </el-select>
  <el-radio-group v-if="selectType === 'radio'" class="w-1/1" v-bind="attrs">
    <el-radio v-for="(dict, index) in getDictOptions" :key="index" :value="dict.value" :label="dict.label" />
  </el-radio-group>
  <el-checkbox-group v-if="selectType === 'checkbox'" class="w-1/1" v-bind="attrs">
    <el-checkbox
      v-for="(dict, index) in getDictOptions"
      :key="index"
      :label="dict.label"
      :value="dict.value"
    />
  </el-checkbox-group>
</template>

<script lang="ts" setup>
import { useDictStore } from '@/stores/modules/dict.ts'

defineOptions({ name: 'FormDictSelect' })

const attrs = useAttrs()
const dictStore = useDictStore()

// 接受父组件参数
interface Props {
  dictType: string // 字典类型
  valueType?: 'string' | 'int' | 'boolean' // 字典值类型
  selectType?: 'select' | 'radio' | 'checkbox' // 选择器类型，下拉框 select、多选框 checkbox、单选框 radio
  formCreateInject?: any
}

const props = withDefaults(defineProps<Props>(), {
  valueType: 'string',
  selectType: 'select'
})

// 获得字典配置
const getDictOptions = computed(() => {
  switch (props.valueType) {
    case 'string':
      return dictStore.getStringDictOptions(props.dictType)
    case 'int':
      return dictStore.getIntDictOptions(props.dictType)
    case 'boolean':
      return dictStore.getBooleanDictOptions(props.dictType)
    default:
      return []
  }
})
</script>
