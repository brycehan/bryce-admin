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
      <el-input v-model="model" placeholder="请选择图标" clearable>
        <template #prefix>
          <icon :icon="model ? model : 'brc:icon-search'" />
        </template>
      </el-input>
    </template>
    <suspense>
      <template #default>
        <popover-icon-list v-model="model" @hide="handleIcon" />
      </template>
      <template #fallback>
        <div v-loading />
      </template>
    </suspense>
  </el-popover>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'

const model = defineModel()

const iconPopoverRef = ref()

const PopoverIconList = defineAsyncComponent(() => import('./popover-icon-list.vue'))

/**
 * 图标点击事件
 *
 * @param icon 图标名称
 */
const handleIcon = (icon: string) => {
  model.value = icon
  iconPopoverRef.value.hide()
}
</script>
