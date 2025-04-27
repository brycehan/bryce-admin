<template>
  <div class="upload-box">
    <el-upload
      :id="uuid"
      :accept="fileType.join(',')"
      :action="`${constant.uploadUrl}?accessType=0`"
      :headers="headers"
      :before-upload="beforeUpload"
      :class="['upload', drag ? 'no-border' : '']"
      :disabled="disabled"
      :drag="drag"
      :multiple="false"
      :on-error="uploadError"
      :on-success="uploadSuccess"
      :show-file-list="false"
    >
      <template v-if="modelValue">
        <img :src="modelValue" class="upload-image" alt="图片" />
        <div class="upload-handle" @click.stop>
          <div v-if="!disabled" class="handle-icon" @click="editImg">
            <icon icon="ep:edit" />
            <span v-if="showBtnText">{{ t('button.edit') }}</span>
          </div>
          <div class="handle-icon" @click="imagePreview(modelValue)">
            <icon icon="ep:zoom-in" />
            <span v-if="showBtnText">{{ t('button.detail') }}</span>
          </div>
          <div v-if="showDelete && !disabled" class="handle-icon" @click="deleteImg">
            <icon icon="ep:delete" />
            <span v-if="showBtnText">{{ t('button.delete') }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="upload-empty">
          <slot name="empty">
            <icon icon="ep:plus" />
          </slot>
        </div>
      </template>
    </el-upload>
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElNotification, type UploadProps } from 'element-plus'

import { v4 as uuidv4 } from 'uuid'
import { createImageViewer } from '@/components/image-viewer/utils.ts'
import constant from '@/utils/constant.ts'
import { useAuthStore } from '@/stores/modules/auth.ts'

defineOptions({ name: 'UploadImg' })

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

// 接受父组件参数
const props = defineProps({
  drag: {
    type: Boolean,
    default: () => true,
  }, // 是否支持拖拽上传 ==> 非必传（默认为 true）
  disabled: {
    type: Boolean,
    default: () => false,
  }, // 是否禁用上传组件 ==> 非必传（默认为 false）
  fileSize: {
    type: Number,
    default: () => 5,
  }, // 图片大小限制 ==> 非必传（默认为 5M）
  fileType: {
    type: Array,
    default: () => ['image/jpeg', 'image/png', 'image/gif'],
  }, // 图片类型限制 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
  height: {
    type: String,
    default: () => '150px',
  }, // 组件高度 ==> 非必传（默认为 150px）
  width: {
    type: String,
    default: () => '150px',
  }, // 组件宽度 ==> 非必传（默认为 150px）
  borderradius: {
    type: String,
    default: () => '8px',
  }, // 组件边框圆角 ==> 非必传（默认为 8px）
  showDelete: {
    type: Boolean,
    default: () => true,
  }, // 是否显示删除按钮
  showBtnText: {
    type: Boolean,
    default: () => true,
  }, // 是否显示按钮文字
})

const model = defineModel()
const authStore = useAuthStore()

/**
 * 上传文件请求头
 */
const headers = {
  Authorization: authStore.accessToken,
  'X-Source-Client': 'pc',
}

const { t } = useI18n() // 国际化
// 生成组件唯一id
const uuid = ref('id-' + uuidv4())
// 查看图片
const imagePreview = (imgUrl: string) => {
  createImageViewer({
    zIndex: 9999999,
    urlList: [imgUrl],
  })
}

const deleteImg = () => {
  model.value = ''
}

const editImg = () => {
  const dom = document.querySelector(`#${uuid.value} .el-upload__input`)
  dom?.dispatchEvent(new MouseEvent('click'))
}

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize
  const imgType = props.fileType
  if (!imgType.includes(rawFile.type as FileTypes)) ElNotification.warning('上传图片不符合所需的格式！')
  if (!imgSize) ElNotification.warning(`上传图片大小不能超过 ${props.fileSize}M！`)
  return imgType.includes(rawFile.type as FileTypes) && imgSize
}

// 图片上传成功提示
const uploadSuccess: UploadProps['onSuccess'] = (response): void => {
  if (response?.code !== 200) {
    ElNotification({
      title: '温馨提示',
      message: '图片上传失败，请您重新上传！',
      type: 'error',
    })
    model.value = ''
    return
  }
  ElMessage.success('上传成功')
  model.value = response.data.url
}

// 图片上传错误提示
const uploadError = () => {
  ElNotification.error('图片上传失败，请您重新上传！')
}
</script>
<style lang="scss" scoped>
.is-error {
  .upload {
    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;

      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}

:deep(.disabled) {
  .el-upload,
  .el-upload-dragger {
    cursor: not-allowed !important;
    background: var(--el-disabled-bg-color);
    border: 1px dashed var(--el-border-color-darker) !important;

    &:hover {
      border: 1px dashed var(--el-border-color-darker) !important;
    }
  }
}

.upload-box {
  .no-border {
    :deep(.el-upload) {
      border: none !important;
    }
  }

  :deep(.upload) {
    .el-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: v-bind(width);
      height: v-bind(height);
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderradius);
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);

        .upload-handle {
          opacity: 1;
        }
      }

      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        background-color: transparent;
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

      .upload-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .upload-empty {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        line-height: 30px;
        color: var(--el-color-info);

        .el-icon {
          font-size: 28px;
          color: var(--el-text-color-secondary);
        }
      }

      .upload-handle {
        position: absolute;
        top: 0;
        right: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: rgb(0 0 0 / 60%);
        opacity: 0;
        transition: var(--el-transition-duration-fast);

        .handle-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 6%;
          color: aliceblue;

          .el-icon {
            margin-bottom: 40%;
            font-size: 130%;
            line-height: 130%;
          }

          span {
            font-size: 85%;
            line-height: 85%;
          }
        }
      }
    }
  }

  .el-upload__tip {
    line-height: 18px;
    text-align: center;
  }
}
</style>
