<template>
  <div>
    <div class="upload-box" v-if="!disabled">
      <el-upload
        v-model:file-list="fileList"
        :accept="fileType.join(',')"
        :action="`${constant.uploadUrl}?accessType=0`"
        :headers="headers"
        :before-upload="beforeUpload"
        :class="['upload', drag ? 'no-border' : '']"
        :disabled="disabled"
        :drag="drag"
        :limit="limit"
        :multiple="true"
        :on-error="uploadError"
        :on-exceed="handleExceed"
        :on-success="uploadSuccess"
        list-type="picture-card"
      >

        <div class="upload-empty">
          <slot name="empty">
            <icon icon="ep:plus" />
          </slot>
        </div>
        <template #file="{ file, index }">
          <img :src="file.url" class="upload-image" alt="图片" />
          <div class="upload-handle" @click.stop>
            <div class="handle-icon" @click="imagePreview(file.url!, index)">
              <icon icon="ep:zoom-in" />
              <span>查看</span>
            </div>
            <div v-if="!disabled" class="handle-icon" @click="handleRemove(file)">
              <icon icon="ep:delete" />
              <span>删除</span>
            </div>
          </div>
        </template>
      </el-upload>
      <div class="el-upload__tip">
        <slot name="tip"></slot>
      </div>
    </div>
    <template v-if="disabled && modelValue">
      <div class="upload-box">
        <div class="upload no-border flex">
          <div v-for="(file, index) in modelValue" :key="index" class="el-upload-list el-upload-list--picture-card">
            <div class="el-upload-list__item is-success">
              <img :src="file" class="upload-image" alt="图片" />
              <div class="upload-handle" @click.stop>
                <div class="handle-icon" @click="imagePreview({ url: file } as any, index)">
                  <icon icon="ep:zoom-in" />
                  <span>查看</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="disabled && !modelValue">
      <div class="upload-box">
        <el-upload
          v-model:file-list="fileList"
          :accept="fileType.join(',')"
          :action="`${constant.uploadUrl}?accessType=0`"
          :headers="headers"
          :before-upload="beforeUpload"
          :class="['upload', drag ? 'no-border' : '']"
          :disabled="disabled"
          :drag="drag"
          :limit="limit"
          :multiple="true"
          :on-error="uploadError"
          :on-exceed="handleExceed"
          :on-success="uploadSuccess"
          list-type="picture-card"
        >
          <div class="upload-empty">
            <slot name="empty">
              <icon icon="ep:plus" />
            </slot>
          </div>
        </el-upload>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import {
  ElMessage,
  ElNotification,
  type UploadFile,
  type UploadProps,
  type UploadUserFile
} from 'element-plus'
import { createImageViewer } from '@/components/image-viewer/utils.ts'
import fileExtension from 'file-extension'
import constant from '@/utils/constant.ts'
import { useAuthStore } from '@/stores/modules/auth.ts'

defineOptions({ name: 'UploadImgs' })

// 查看图片
const imagePreview = (imgUrl: string, index: number) => {
  if (props.disabled && model.value) {
    fileList.value = model.value.map((url: any) => {
      return {
        url,
        name: getFilename(url)
      }
    })
  }

  console.log('imagePreview', imgUrl, [...fileList.value.map((file) => file.url!)])
  createImageViewer({
    zIndex: 9999,
    initialIndex: index,
    urlList: [...fileList.value.map((file) => file.url!)]
  })
}

type FileTypes =
  | 'image/apng'
  | 'image/bmp'
  | 'image/gif'
  | 'image/jpg'
  | 'image/jpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'image/tiff'
  | 'image/webp'
  | 'image/x-icon'

const props = defineProps({
  drag: {
    type: Boolean,
    default: () => true
  }, // 是否支持拖拽上传 ==> 非必传（默认为 true）
  disabled: {
    type: Boolean,
    default: () => false
  }, // 是否禁用上传组件 ==> 非必传（默认为 false）
  limit: {
    type: Number,
    default: () => 5
  }, // 最大图片上传数 ==> 非必传（默认为 5张）
  fileSize: {
    type: Number,
    default: () => 5
  }, // 图片大小限制 ==> 非必传（默认为 5M）
  fileType: {
    type: Array,
    default: () => ['image/jpeg', 'image/png', 'image/gif']
  }, // 图片类型限制 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
  height: {
    type: String,
    default: () => '150px'
  }, // 组件高度 ==> 非必传（默认为 150px）
  width: {
    type: String,
    default: () => '150px'
  }, // 组件宽度 ==> 非必传（默认为 150px）
  borderradius: {
    type: String,
    default: () => '8px'
  } // 组件边框圆角 ==> 非必传（默认为 8px）
})

const model = defineModel<string[]>()

const authStore = useAuthStore()

/**
 * 上传文件请求头
 */
const headers = {
  Authorization: authStore.accessToken,
  'X-Source-Client': 'pc'
}

const fileList = ref<UploadUserFile[]>([])

/**
 * @description 文件上传之前判断
 * @param rawFile 上传的文件
 * */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize
  const imgType = props.fileType
  if (!imgType.includes(rawFile.type as FileTypes))
    ElNotification({
      title: '温馨提示',
      message: '上传图片不符合所需的格式！',
      type: 'warning'
    })
  if (!imgSize)
    ElNotification({
      title: '温馨提示',
      message: `上传图片大小不能超过 ${props.fileSize}M！`,
      type: 'warning'
    })
  return imgType.includes(rawFile.type as FileTypes) && imgSize
}

const uploadSuccess: UploadProps['onSuccess'] = (response, uploadFile): void => {
  if (response?.code !== 200) {
    ElNotification({
      title: '温馨提示',
      message: '图片上传失败，请您重新上传！',
      type: 'error'
    })
    fileList.value = fileList.value.filter((item) => item.url !== uploadFile.url || item.name !== uploadFile.name)
    model.value = fileList.value.map((file) => file.url!)
    return
  }
  ElMessage.success('上传成功')
  emitUpdateModelValue()
}

// 发送图片链接列表更新
const emitUpdateModelValue = () => {
  model.value = fileList.value.map((file: UploadUserFile) => {
    if (file.response) return (file.response as any).data.url
  })
}

// 删除图片
const handleRemove = (uploadFile: UploadFile) => {
  fileList.value = fileList.value.filter((item) => item.url !== uploadFile.url || item.name !== uploadFile.name)
  model.value = fileList.value.map((file) => file.url!)
}

// 图片上传错误提示
const uploadError = () => {
  ElNotification({
    title: '温馨提示',
    message: '图片上传失败，请您重新上传！',
    type: 'error'
  })
}

// 文件数超出提示
const handleExceed = () => {
  ElNotification({
    title: '温馨提示',
    message: `当前最多只能上传 ${props.limit} 张图片，请移除后上传！`,
    type: 'warning'
  })
}

/**
 * 获取文件名
 * @param path 文件路径
 */
const getFilename = (path: string) => {
  debugger
  const fullFilename = path.substring(path.lastIndexOf('/') + 1)
  const extension = fileExtension(fullFilename)
  const filename = fullFilename.substring(0, fullFilename.lastIndexOf(extension) - 16)
  return filename + '.' + extension
}
</script>

<style lang="scss" scoped>
.is-error {
  .upload {
    :deep(.el-upload--picture-card),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;

      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}

:deep(.disabled) {
  .el-upload--picture-card,
  .el-upload-dragger {
    cursor: not-allowed;
    background: var(--el-disabled-bg-color) !important;
    border: 1px dashed var(--el-border-color-darker);

    &:hover {
      border-color: var(--el-border-color-darker) !important;
    }
  }
}

.upload-box {
  .no-border {
    :deep(.el-upload--picture-card) {
      border: none !important;
    }
  }

  :deep(.upload) {
    .el-upload-dragger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 0;
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderradius);

      &:hover {
        border: 1px dashed var(--el-color-primary);
      }
    }

    .el-upload-dragger.is-dragover {
      background-color: var(--el-color-primary-light-9);
      border: 2px dashed var(--el-color-primary) !important;
    }

    .el-upload-list__item,
    .el-upload--picture-card {
      width: v-bind(width);
      height: v-bind(height);
      background-color: transparent;
      border-radius: v-bind(borderradius);
    }

    .upload-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .upload-handle {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 60%);
      opacity: 0;
      box-sizing: border-box;
      transition: var(--el-transition-duration-fast);
      align-items: center;
      justify-content: center;

      .handle-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 6%;
        color: aliceblue;

        .el-icon {
          margin-bottom: 15%;
          font-size: 140%;
        }

        span {
          font-size: 100%;
        }
      }
    }

    .el-upload-list__item {
      &:hover {
        .upload-handle {
          opacity: 1;
        }
      }
    }

    .upload-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 28px;
      line-height: 30px;
      color: var(--el-color-info);

      .el-icon {
        font-size: 28px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .el-upload__tip {
    line-height: 15px;
    text-align: center;
  }
}
</style>
