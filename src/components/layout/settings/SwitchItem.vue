<template>
  <div class="switch-container">
    <span>{{ title }}</span>
    <el-switch v-model="model" :disabled="disabled" @change="handleChange($event)"/>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
  }
})

const model = defineModel()
const emit = defineEmits(['change'])
const handleChange = (val: boolean) => {
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
