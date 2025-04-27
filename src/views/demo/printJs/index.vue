<template>
  <div id="printJs-vue">
    <el-card header="页面打印" shadow="hover">
      <el-alert
        title="页面打印演示，使用的是 `print-js`，项目地址：https://github.com/crabbly/Print.js"
        type="success"
        :closable="false"
      />
      <p class="mt-2">
        <el-button size="default" type="primary" @click="handlePrintJs"> 点击打印 </el-button>
      </p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import printJS from 'print-js'

const handlePrintJs = () => {
  printJS({
    printable: 'printJs-vue',
    type: 'html',
    css: ['//unpkg.com/element-plus/dist/index.css'],
    scanStyles: false,
  })
}
</script>
