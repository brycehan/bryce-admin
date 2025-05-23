<template>
  <el-table-column :label="label" :prop="prop" :header-align="headerAlign" :align="align" :min-width="minWidth">
    <template #default="scope">
      <el-tag
        v-if="columnType === 'tag'"
        :type="dictStore.getDictLabelClass(props.dictType, scope.row[props.prop])"
        size="small"
      >
        {{ dictStore.getDictLabel(props.dictType, scope.row[props.prop]) }}
      </el-tag>
      <el-switch
        v-else-if="columnType === 'switch'"
        v-model="scope.row[props.prop]"
        :disabled="disabled"
        :width="40"
        :active-value="activeValue"
        :inactive-value="inactiveValue"
        :loading="loading"
        :before-change="beforeChange"
        @change="handleChangeStatus(scope.row)"
      />
      <span v-else>
        {{ dictStore.getDictLabel(props.dictType, scope.row[props.prop]) }}
      </span>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
const dictStore = useDictStore()

const emit = defineEmits(['change'])

const props = defineProps({
  dictType: {
    type: String,
    required: true,
  },
  columnType: {
    type: String,
    default: () => 'tag',
  },
  prop: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  headerAlign: {
    type: String,
    default: () => 'center',
  },
  align: {
    type: String,
    default: () => 'center',
  },
  minWidth: {
    type: String,
    default: () => '',
  },
  disabled: {
    type: Boolean,
    default: () => false,
  },
  activeValue: {
    type: [Number, String, Boolean],
    default: 1,
  },
  inactiveValue: {
    type: [Number, String, Boolean],
    default: 0,
  },
})

const loading = ref(false)

const handleChangeStatus = (row: any) => {
  emit('change', row)
}

const beforeChange = (): boolean => {
  return useAuthStore().permitAccess()
}
</script>
