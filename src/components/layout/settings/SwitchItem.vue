<template>
  <div class="switch-container">
    <span>{{ title }}</span>
    <el-switch :model-value="modelValue" :disabled="disabled" @change="handleChange($event)"/>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
  }
})

const emit = defineEmits(['update:modelValue', 'change'])
const handleChange = (val: boolean) => {
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<style lang="scss" scoped>
.switch-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 15px;
  color: var(--el-text-color-primary);
}
</style>
