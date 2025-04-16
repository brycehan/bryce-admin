<template>
  <div v-if="!disabled" class="upload-file">
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :action="`${constant.uploadUrl}?accessType=0`"
      :headers="headers"
      :auto-upload="autoUpload"
      :before-upload="handleBeforeUpload"
      :disabled="disabled"
      :drag="drag"
      :limit="props.limit"
      :multiple="props.limit > 1"
      :on-error="excelUploadError"
      :on-exceed="handleExceed"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleFileSuccess"
      :show-file-list="true"
      class="upload-file-uploader"
      name="file"
    >
      <el-button type="primary">
        <Icon icon="ep:upload-filled" />
        选取文件
      </el-button>
      <template v-if="isShowTip" #tip>
        <div style="font-size: 8px">
          大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
        </div>
        <div style="font-size: 8px">
          格式为 <b style="color: #f56c6c">{{ fileType.join('/') }}</b> 的文件
        </div>
      </template>
      <template #file="row">
        <div class="flex items-center gap-4">
          <span>{{ row.file.name }}</span>
          <el-link :href="row.file.url" :underline="false" download target="_blank" type="primary">下载</el-link>
          <el-button link type="danger" @click="handleRemove(row.file)">删除</el-button>
        </div>
      </template>
    </el-upload>
  </div>

  <!-- 上传操作禁用时 -->
  <div v-if="disabled" class="upload-file">
    <div v-for="(file, index) in fileList" :key="index" class="flex items-center file-list-item">
      <span>{{ file.name }}</span>
      <div class="ml-10px">
        <el-link :href="file.url" :underline="false" download target="_blank" type="primary"> 下载 </el-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ElMessage, type UploadInstance, type UploadProps, type UploadRawFile, type UploadUserFile } from 'element-plus'
import { isString } from '@/utils/is'
import { type UploadFile } from 'element-plus/es/components/upload/src/upload'
import constant from '@/utils/constant.ts'
import { useAuthStore } from '@/stores/modules/auth.ts'

defineOptions({ name: 'UploadFile' })

const model = defineModel()

const props = defineProps({
  fileType: {
    type: Array,
    default: () => ['doc', 'xls', 'ppt', 'txt', 'pdf']
  }, // 文件类型, 例如['doc', 'xls', 'ppt', 'txt', 'pdf']
  fileSize: {
    type: Number,
    default: () => 5
  }, // 大小限制(MB)
  limit: {
    type: Number,
    default: () => 5
  }, // 数量限制
  autoUpload: {
    type: Boolean,
    default: () => true
  }, // 自动上传
  drag: {
    type: Boolean,
    default: () => false
  }, // 拖拽上传
  isShowTip: {
    type: Boolean,
    default: () => true
  }, // 是否显示提示
  disabled: {
    type: Boolean,
    default: () => false
  } // 是否禁用上传组件 ==> 非必传（默认为 false）
})

const authStore = useAuthStore()

/**
 * 上传文件请求头
 */
const headers = {
  Authorization: authStore.accessToken,
  'X-Source-Client': 'pc'
}

// ========== 上传相关 ==========
const uploadRef = ref<UploadInstance>()
const uploadList = ref<UploadUserFile[]>([])
const fileList = ref<UploadUserFile[]>([])
const uploadNumber = ref<number>(0)

/**
 * 文件上传之前判断
 *
 * @param file 要上传的文件
 */
const handleBeforeUpload: UploadProps['beforeUpload'] = (file: UploadRawFile) => {
  if (fileList.value.length >= props.limit) {
    ElMessage.error(`上传文件数量不能超过${props.limit}个!`)
    return false
  }
  let fileExtension = ''
  if (file.name.lastIndexOf('.') > -1) {
    fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
  }
  const isImg = props.fileType.some((type: any) => {
    if (file.type.indexOf(type as string) > -1) return true
    return !!(fileExtension && fileExtension.indexOf(type) > -1)
  })
  const isLimit = file.size < props.fileSize * 1024 * 1024
  if (!isImg) {
    ElMessage.error(`文件格式不正确, 请上传${props.fileType.join('/')}格式!`)
    return false
  }
  if (!isLimit) {
    ElMessage.error(`上传文件大小不能超过${props.fileSize}MB!`)
    return false
  }
  ElMessage.success('正在上传文件，请稍候...')
  uploadNumber.value++
}

/**
 * 上传文件成功
 *
 * @param res 返回的数据
 */
const handleFileSuccess: UploadProps['onSuccess'] = (res: any): void => {
  ElMessage.success('上传成功')
  // 删除自身
  const index = fileList.value.findIndex((item: any) => item.response?.data === res.data)
  fileList.value.splice(index, 1)
  uploadList.value.push({ name: res.data.name, url: res.data.url })
  if (uploadList.value.length == uploadNumber.value) {
    fileList.value.push(...uploadList.value)
    uploadList.value = []
    uploadNumber.value = 0
    emitUpdateModelValue()
  }
}

/**
 * 文件数超出提示
 */
const handleExceed: UploadProps['onExceed'] = (): void => {
  ElMessage.error(`上传文件数量不能超过${props.limit}个!`)
}

/**
 * 上传错误提示
 */
const excelUploadError: UploadProps['onError'] = (): void => {
  ElMessage.error('导入数据失败，请您重新上传！')
}

/**
 * 删除上传文件
 *
 * @param file 要删除的文件
 */
const handleRemove = (file: UploadFile) => {
  const index = fileList.value.map((f) => f.name).indexOf(file.name)
  if (index > -1) {
    fileList.value.splice(index, 1)
    emitUpdateModelValue()
  }
}

/**
 * 文件预览
 *
 * @param uploadFile 要预览的文件
 */
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}

/**
 * 发送文件链接列表更新
 */
const emitUpdateModelValue = () => {
  // 情况1：数组结果
  let result: string | string[] = fileList.value.map((file) => file.url!)
  // 情况2：逗号分隔的字符串
  if (props.limit === 1 || isString(model.value)) {
    result = result.join(',')
  }
  model.value = result
}
</script>
<style lang="scss" scoped>
.upload-file-uploader {
  margin-bottom: 5px;
}

:deep(.upload-file-list .el-upload-list__item) {
  position: relative;
  margin-bottom: 10px;
  line-height: 2;
  border: 1px solid #e4e7ed;
}

:deep(.el-upload-list__item-file-name) {
  max-width: 250px;
}

:deep(.upload-file-list .ele-upload-list__item-content) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

:deep(.ele-upload-list__item-content-action .el-link) {
  margin-right: 10px;
}

.file-list-item {
  border: 1px dashed var(--el-border-color-darker);
  border-radius: 8px;
}
</style>
