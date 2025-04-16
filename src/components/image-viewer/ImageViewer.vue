<script lang="ts" setup>
import { type PropType } from 'vue'

defineOptions({ name: 'ImageViewer' })

const props = defineProps({
  urlList: {
    type: Array as PropType<string[]>,
    default: (): string[] => []
  },
  zIndex: {
    type: Number,
    default: 200
  },
  initialIndex: {
    type: Number,
    default: 0
  },
  infinite: {
    type: Boolean,
    default: true
  },
  hideOnClickModal: {
    type: Boolean,
    default: false
  },
  teleported: {
    type: Boolean,
    default: false
  },
  show: {
    type: Boolean,
    default: false
  }
})

const getBindValue = computed(() => {
  const propsData: any = { ...props }
  delete propsData.show
  return propsData
})

const show = ref(props.show)

const close = () => {
  show.value = false
}
</script>

<template>
  <ElImageViewer v-if="show" v-bind="getBindValue" @close="close" />
</template>
