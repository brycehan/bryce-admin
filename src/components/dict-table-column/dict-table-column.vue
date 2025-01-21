<template>
  <el-table-column
    :label="label"
    :prop="prop"
    :header-align="headerAlign"
    :align="align"
    :min-width="minWidth"
  >
    <template #default="scope">
      <el-tag
        v-if="getDictLabelClass(appStore.dictList, props.dictType, scope.row[props.prop])"
        :type="getDictLabelClass(appStore.dictList, props.dictType, scope.row[props.prop])"
        size="small"
      >
        {{ getDictLabel(appStore.dictList, props.dictType, scope.row[props.prop]) }}
      </el-tag>
      <span v-else>
        {{ getDictLabel(appStore.dictList, props.dictType, scope.row[props.prop]) }}
      </span>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { getDictLabel, getDictLabelClass } from '@/utils/tool'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()

const props = defineProps({
  dictType: {
    type: String,
    required: true
  },
  prop: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  headerAlign: {
    type: String,
    required: false,
    default: () => 'center'
  },
  align: {
    type: String,
    required: false,
    default: () => 'center'
  },
  minWidth: {
    type: String,
    required: false,
    default: () => ''
  }
})
</script>
