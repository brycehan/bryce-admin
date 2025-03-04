<template>
  <!--创建容器-->
  <div class="process-design-container">
    <div class="canvas" ref="canvasRef"></div>
    <div class="panel" id="properties-panel"></div>  <!--属性面板将通过该元素呈现到其中-->
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, reactive, type Ref, ref } from 'vue'
// 导入bpmn-js
import BpmnModeler from 'bpmn-js/lib/Modeler'
// 导入bpmn-js样式
import 'bpmn-js/dist/assets/diagram-js.css'
// import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import xmlStr from './xml'
import { ElMessage } from 'element-plus'

const state = reactive<any>({
  bpmnModeler: null,
  bpmnXmlStr: xmlStr,
})

const canvasRef = ref()

const processData = inject('processData') as Ref

/**
 * 创建新的流程图
 *
 * 注意：必须先加载一个bpmn文件，新建就是加载一个空的bpmn文件，否则不能拖拽节点
 * @param bpmn
 */
const createNewDiagram = async (bpmn: any) => {
  // 将字符串转换成图显示出来
  try {
    const result = await state.bpmnModeler.importXML(bpmn);
    // state.bpmnModeler.get('canvas').zoom('fit-viewport');
    const {warnings} = result;
    console.log(warnings);
  } catch (e) {
    ElMessage.error('打开模型出错，数据格式有误！')
    console.log('error--->', e)
  }
}

/**
 * 初始化bpmn-js
 */
const init = () => {
  // 实例化bpmn-js
  state.bpmnModeler = new BpmnModeler({
    container: canvasRef.value,
    // width: '100%',
    // height: '100%',
    propertiesPanel: {
      parent: '#properties-panel'
    }
  })
  createNewDiagram(state.bpmnXmlStr)
}

/**
 * 表单校验
 */
const validate = () => {
  if (processData.value) {
    return true
  }
  throw new Error('请设计流程')
}

onMounted(() => {
  init()
})

defineExpose({
  validate
})
</script>

<style lang="scss" scoped>
.process-design-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .canvas  {
    width: 100%;
    height: 88vh;
    overflow: hidden;
    border: 1px solid rgb(229, 230, 235);
    ::v-deep(.djs-minimap) {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 240px;
      height: 135px;
      top: unset;
    }
  }
  .panel {
    position: absolute;
    right: 0;
    top: 83px;
    min-width: 460px;
    max-width: 500px;
  }
}
</style>
