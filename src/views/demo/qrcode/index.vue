<template>
  <el-card header="二维码生成" shadow="hover">
    <el-form label-position="left" label-width="100px">
      <el-form-item label="文本">
        <el-input v-model="value" />
      </el-form-item>
      <el-form-item label="大小">
        <el-slider v-model="size" :min="100" :max="500" />
      </el-form-item>
      <el-form-item label="颜色">
        <el-color-picker v-model="color" />
      </el-form-item>
      <el-form-item label="二维码">
        <qrcode-vue :value="value" :size="size" :foreground="color" level="H" />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
import {ref} from "vue";

const value = ref('https://brycehan.com')
const size = ref(200)
const color = ref('#000000')
</script>
