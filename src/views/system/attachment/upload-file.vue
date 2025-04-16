<template>
  <el-dialog
    v-model="visible"
    title="上传文件"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
    >
      <el-upload
        ref="uploadRef"
        v-auth:has-authority="'system:attachment:save'"
        :action="`${constant.uploadUrl}?accessType=${accessType}`"
        :headers="headers"
        :auto-upload="false"
        :before-upload="handleBeforeUpload"
        :disabled="isUploading"
        :on-progress="handleProgress"
        :on-exceed="handleExceed"
        :on-success="handleOnSuccess"
        :limit="9"
        multiple
        drag
        >
        <icon icon="ep:upload-filled" class="el-icon el-icon--upload"/>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              <div class="upload-tip">
                <el-tooltip effect="dark" content="非安全访问生成外部访问附件地址以`http(s)://`开头，否则不生成附件地址" placement="top">
                  <el-checkbox v-model="accessType" :true-value="1" :false-value="0">是否安全访问文件</el-checkbox>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-upload>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type UploadProps } from 'element-plus'
import { useAuthStore } from '@/stores/modules/auth'
import { handleBeforeUpload } from '@/utils/tool'
import { saveOrUpdateApi } from '@/api/system/attachment'
import constant from '@/utils/constant'

const emit = defineEmits(['refreshPage'])

const dataForm = reactive({
  name: '',
  platform: '',
  suffix: '',
  accessType: '',
  size: '',
  hash: '',
  url: ''
})
const dataFormRef = ref()
const uploadRef = ref()
const visible = ref(false)
const accessType = ref<number>(0)
const isUploading = ref(false)

const authStore = useAuthStore()

/**
 * 上传文件请求头
 */
const headers = {
  Authorization: authStore.accessToken,
  'X-Source-Client': 'pc'
}

/**
 * 初始化详情数据
 */
const init = () => {
  visible.value = true
  // 0 public 1 secure
  accessType.value = 0
}

/**
 * 表单提交
 */
const handleSubmit = () => {
  uploadRef.value.submit()
}

/**
 * 上传文件进度
 *
 */
const handleProgress: UploadProps['onProgress'] = () => {
  isUploading.value = true
}

/**
 * 上传文件成功
 *
 * @param res 返回的数据
 */
const handleOnSuccess: UploadProps['onSuccess'] = (res) => {
  if (res.code !== 200) {
    ElMessage.error('上传失败，' + res.message)
    return false
  }

  Object.assign(dataForm, res.data)
  saveOrUpdateApi(dataForm).then(() => {
    emit('refreshPage')
    ElMessage.success('上传成功')
    visible.value = false
    isUploading.value = false
    uploadRef.value.clearFiles()
  })
}

/**
 * 文件超出限制
 *
 * @param files 当前选择的文件数组
 * @param uploadFiles 之前选择的文件数组
 */
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `限制为9个，您这次选择了 ${files.length} 个文件, 总共 ${
      files.length + uploadFiles.length
    } 个文件`
  )
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.upload-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  .el-checkbox {
    padding-right: 5px;
  }
  ::v-deep(.el-checkbox__label) {
    font-size: 12px;
    font-weight: normal;
  }
}
</style>
