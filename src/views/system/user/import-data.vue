<template>
  <el-dialog v-model="visible" title="导入用户" width="400px" :close-on-click-modal="false">
    <el-form ref="dataFormRef">
      <el-upload
        ref="uploadRef"
        v-auth:has-authority="'system:user:import'"
        :limit="1"
        accept=".xlsx,.xls,.csv"
        :headers="headers"
        :action="`${importUrl}?isUpdateSupport=${isUpdateSupport}`"
        :disabled="isUploading"
        :on-progress="handleProgress"
        :before-upload="handleBeforeUpload"
        :on-success="handleOnSuccess"
        :auto-upload="false"
        drag
      >
        <icon class="el-icon el-icon--upload" icon="ep:upload-filled" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">
            <div class="upload-tip">
              <el-checkbox v-model="isUpdateSupport"><span>是否更新已经存在的用户数据</span></el-checkbox>
            </div>
            <div class="upload-tip">
              <span>仅允许导入xlsx、xls、csv格式文件。</span>
              <el-link type="primary" :underline="false" style="font-size: 12px" @click="handleImportTemplate"
                >下载模板</el-link
              >
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
import { ref } from 'vue'
import { getImportTemplateApi, importUrl } from '@/api/system/user'
import { ElMessageBox, type UploadProps } from 'element-plus'
import { useAuthStore } from '@/stores/modules/auth'
import { handleBeforeUpload } from '@/utils/tool'

const emit = defineEmits(['refreshPage'])

const dataFormRef = ref()
const uploadRef = ref()
const visible = ref(false)
const isUpdateSupport = ref(false)
const isUploading = ref(false)

const authStore = useAuthStore()

/**
 * 上传文件请求头
 */
const headers = {
  Authorization: authStore.accessToken,
  'X-Source-Client': 'pc',
}

/**
 * 初始化详情数据
 */
const init = () => {
  visible.value = true
}

/**
 * 下载导入模板
 */
const handleImportTemplate = () => {
  getImportTemplateApi()
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
  visible.value = false
  isUploading.value = false
  isUpdateSupport.value = false
  uploadRef.value.clearFiles()
  ElMessageBox.alert(res.message, '导入结果', { dangerouslyUseHTMLString: true })
  emit('refreshPage')
}

defineExpose({
  init,
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
