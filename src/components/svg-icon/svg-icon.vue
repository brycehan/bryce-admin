<template>
  <div v-if="icon" class="svg-icon">
    <svg
      :class="`${className}`"
      :style="`color: ${color}; width: ${size}; height: ${size}`"
      aria-hidden="true"
    >
      <use :xlink:href="`${iconName}`" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// https://www.iconfont.cn/
const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  }
})
const iconName = computed(() => `#${props.icon}`)
</script>

<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
  svg {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    flex-shrink: 0;
  }
}
</style>
