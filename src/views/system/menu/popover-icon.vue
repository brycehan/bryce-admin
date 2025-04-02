<template>
  <el-popover
    ref="iconPopoverRef"
    placement="top-start"
    trigger="click"
    width="40%"
    popper-class="icon-popover"
    hide-after="0"
  >
    <template #reference>
      <el-input v-model="value" placeholder="请选择图标" clearable>
        <template #prefix>
          <icon :icon="value ? value : 'brc:icon-search'" />
        </template>
      </el-input>
    </template>
    <suspense>
      <template #default>
        <popover-icon-list v-model="value" @hide="handleIcon" />
      </template>
      <template #fallback>
        <div v-loading />
      </template>
    </suspense>
  </el-popover>
</template>
<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const iconPopoverRef = ref()

const PopoverIconList = defineAsyncComponent(() => import('./popover-icon-list.vue'))

// 用计算 modelValue 属性
const value = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})

/**
 * 图标点击事件
 *
 * @param icon 图标名称
 */
const handleIcon = (icon: string) => {
  value.value = icon
  iconPopoverRef.value.hide()
}
</script>
