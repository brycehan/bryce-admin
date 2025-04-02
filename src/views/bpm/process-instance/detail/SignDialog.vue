<template>
  <el-dialog v-model="signDialogVisible" title="签名" width="935">
    <div class="position-relative">
      <Vue3Signature class="b b-solid b-gray" ref="signature" w="900px" h="400px" />
      <el-button
        class="pos-absolute bottom-[20px] right-[10px]"
        type="primary"
        text
        size="small"
        @click="signature.clear()"
      >
        <icon icon="ep:delete" class="mr-[5px]" />
        清除
      </el-button>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="signDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import Vue3Signature from 'vue3-signature'
import uploadFileApi from '@/api/storage/uploadFile'
import download from '@/utils/download'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const signDialogVisible = ref(false)
const signature = ref()

const open = async () => {
  signDialogVisible.value = true
}
defineExpose({ open })

const emits = defineEmits(['success'])
const submit = async () => {
  ElMessage.success('签名上传中请稍等。。。')
  const res = await uploadFileApi.uploadFile({
    file: download.base64ToFile(signature.value.save('image/png'), '签名'),
    accessType: 0,
  })
  emits('success', res.data)
  signDialogVisible.value = false
}
</script>

<style scoped></style>
