<template>
  <el-card header="cropper 图片裁剪" shadow="hover">
    <div class="croppers-container">
      <div class="img-cropper">
        <img ref="imgRef" :src="cropperImg" alt="图片" />
      </div>
      <div class="img-preview"></div>
    </div>
    <div class="mt-6">
      <el-button type="primary" @click="handleUpload">选择图片</el-button>
      <el-button type="primary" @click="handleDownload">下载图片</el-button>
      <input ref="fileRef" style="display: none" type="file" accept="image/*" @change="handleFileChange" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
import { nextTick, ref } from 'vue'

const imgRef = ref()
const cropperImg = ref('https://img2.baidu.com/it/u=3747114911,414713113&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500')
const fileRef = ref()
const cropper = ref<any>(null)

nextTick(() => {
  initCropper()
})

const initCropper = () => {
  cropper.value = new Cropper(imgRef.value, {
    viewMode: 1,
    dragMode: 'none',
    initialAspectRatio: 1,
    background: true,
    autoCropArea: 0.8,
    aspectRatio: 1,
    preview: '.img-preview',
  })
}

const handleUpload = () => {
  fileRef.value.click()
}

const handleFileChange = (e: any) => {
  const file = e.target.files[0]
  const url = window.URL || window.webkitURL
  cropper.value.replace(url.createObjectURL(file))
}

const handleDownload = () => {
  cropper.value.getCroppedCanvas().toBlob(function (blob: any) {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', '')
    document.body.appendChild(link)

    // 模拟点击下载
    link.click()
    document.body.removeChild(link)
  })
  cropper.value.crop()
}
</script>

<style scoped lang="scss">
.croppers-container {
  display: flex;
  justify-items: center;
}

.img-cropper {
  width: 600px;
  height: 400px;
}

.img-preview {
  width: 400px;
  height: 400px;
  margin: auto;
  overflow: hidden;
}
</style>
