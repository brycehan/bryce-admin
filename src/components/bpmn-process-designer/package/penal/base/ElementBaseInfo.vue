<template>
  <div class="panel-tab__content">
    <el-form label-width="90px" :model="needProps">
      <div v-if="needProps.type == 'bpmn:Process'">
        <!-- 如果是 Process 信息的时候，使用自定义表单 -->
        <el-form-item label="流程标识" prop="key">
          <el-input v-model="model.key" placeholder="请输入流标标识" readonly @change="handleKeyUpdate" />
        </el-form-item>
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="model.name" placeholder="请输入流程名称" clearable readonly @change="handleNameUpdate" />
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="ID">
          <el-input v-model="elementBaseInfo.id" clearable @change="updateBaseInfo('id')" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="elementBaseInfo.name" clearable @change="updateBaseInfo('name')" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, ref, toRaw, watch } from 'vue'

defineOptions({ name: 'ElementBaseInfo' })

const model = defineModel<any>()
const props = defineProps({
  businessObject: {
    type: Object,
    default: () => {},
  },
})
const needProps = ref<any>({})
const bpmnElement = ref()
const elementBaseInfo = ref<any>({})
// 流程表单的下拉框的数据
// const forms = ref([])

const bpmnInstances = () => (window as any)?.bpmnInstances

const resetBaseInfo = () => {
  console.log(window, 'window')
  console.log(bpmnElement.value, 'bpmnElement')

  bpmnElement.value = bpmnInstances()?.bpmnElement
  // console.log(bpmnElement.value, 'resetBaseInfo11111111111')
  elementBaseInfo.value = bpmnElement.value.businessObject
  needProps.value['type'] = bpmnElement.value.businessObject.$type
  // elementBaseInfo.value['typess'] = bpmnElement.value.businessObject.$type

  // elementBaseInfo.value = JSON.parse(JSON.stringify(bpmnElement.value.businessObject))
  // console.log(elementBaseInfo.value, 'elementBaseInfo22222222222')
}
const handleKeyUpdate = (value: any) => {
  // 校验 value 的值，只有 XML NCName 通过的情况下，才进行赋值。
  if (!value) {
    return
  }

  // 在 BPMN 的 XML 中，流程标识 key，其实对应的是 id 节点
  elementBaseInfo.value['id'] = value

  setTimeout(() => {
    updateBaseInfo('id')
  }, 100)
}

const handleNameUpdate = (value: any) => {
  console.log(elementBaseInfo, 'elementBaseInfo')
  if (!value) {
    return
  }
  elementBaseInfo.value['name'] = value

  setTimeout(() => {
    updateBaseInfo('name')
  }, 100)
}
// const handleDescriptionUpdate=(value)=> {
// TODO documentation 暂时无法修改，后续在看看
// this.elementBaseInfo['documentation'] = value;
// this.updateBaseInfo('documentation');
// }

const updateBaseInfo = (key: any) => {
  console.log(key, 'key')
  // 触发 elementBaseInfo 对应的字段
  const attrObj = Object.create(null)
  // console.log(attrObj, 'attrObj')
  attrObj[key] = elementBaseInfo.value[key]
  // console.log(attrObj, 'attrObj111')
  // const attrObj = {
  //   id: elementBaseInfo.value[key]
  //   // di: { id: `${elementBaseInfo.value[key]}_di` }
  // }
  // console.log(elementBaseInfo, 'elementBaseInfo11111111111')
  needProps.value = { ...elementBaseInfo.value, ...needProps.value }

  if (key === 'id') {
    console.log(window, 'window')
    console.log(bpmnElement.value, 'bpmnElement')
    console.log(toRaw(bpmnElement.value), 'bpmnElement')
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
      id: elementBaseInfo.value[key],
      di: { id: `${elementBaseInfo.value[key]}_di` },
    })
  } else {
    console.log(attrObj, 'attrObj')
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), attrObj)
  }
}

watch(
  () => props.businessObject,
  (val) => {
    // console.log(val, 'val11111111111111111111')
    if (val) {
      // nextTick(() => {
      resetBaseInfo()
      // })
    }
  },
)

watch(
  () => model.value.key,
  (val) => {
    // 针对上传的 bpmn 流程图时，保证 key 和 name 的更新
    if (val) {
      handleKeyUpdate(model.value.key)
      handleNameUpdate(model.value.name)
    }
  },
  {
    immediate: true,
  },
)

onBeforeUnmount(() => {
  bpmnElement.value = null
})
</script>
