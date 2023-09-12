<template>
  <el-table-column
    :label="label"
    :prop="prop"
    :header-align="headerAlign"
    :align="align"
    :width="width">
    <template #default="scope">
      <el-tag v-if="getDictLabelClass(stores.appStore.dictList, props.dictType, scope.row[props.prop])"
              :type="
                getDictLabelClass(stores.appStore.dictList, props.dictType, scope.row[props.prop]) === 'primary'
                ? ''
                : getDictLabelClass(stores.appStore.dictList, props.dictType, scope.row[props.prop])
      ">
        {{ getDictLabel(stores.appStore.dictList, props.dictType, scope.row[props.prop]) }}
      </el-tag>
      <span v-else>
        {{ getDictLabel(stores.appStore.dictList, props.dictType, scope.row[props.prop]) }}
      </span>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import {getDictLabel, getDictLabelClass} from "@/utils/tool";
import stores from "@/stores";

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  prop: {
    type: String,
    required: true
  },
  dictType: {
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
  width: {
    type: String,
    required: false,
    default: () => ''
  }
})

</script>

<style scoped>

</style>