<template>
  <div class="my-process-palette">
    <div class="test-button" @click="addTask" @mousedown="addTask">测试任务</div>
    <div id="palette-container" class="test-container">1</div>
  </div>
</template>

<script lang="ts" setup>
import { assign } from 'min-dash'

defineOptions({ name: 'MyProcessPalette' })

const bpmnInstances = () => (window as any).bpmnInstances
const addTask = (event: any, options: any = {}) => {
  const ElementFactory = bpmnInstances().elementFactory
  const create = bpmnInstances().modeler.get('create')

  console.log(ElementFactory, create)

  const shape = ElementFactory.createShape(assign({ type: 'bpmn:UserTask' }, options))

  if (options) {
    shape.businessObject.di.isExpanded = options.isExpanded
  }

  console.log(event, 'event')
  console.log(shape, 'shape')
  create.start(event, shape)
}
</script>

<style scoped lang="scss">
.my-process-palette {
  box-sizing: border-box;
  padding: 80px 20px 20px;

  .test-button {
    box-sizing: border-box;
    padding: 8px 16px;
    cursor: pointer;
    border: 1px solid rgb(24 144 255 / 80%);
    border-radius: 4px;
  }
}
</style>
