<template>
  <div class="z-10 w-full border border-solid border-[#ccc]">
    <!-- 工具栏 -->
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :default-config="toolbarConfig" :mode="mode" />
    <!-- 编辑器 -->
    <Editor
      v-model="model"
      :default-config="editorConfig"
      :style="style"
      :mode="mode"
      :read-only="disabledValue"
      @on-created="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { onBeforeUnmount, shallowRef } from 'vue'
import { i18nChangeLanguage, type IDomEditor, type IEditorConfig } from '@wangeditor/editor'
import constant from '@/utils/constant'

defineOptions({ name: 'WangEditor' })

const authStore = useAuthStore()
const appStore = useAppStore()

i18nChangeLanguage(appStore.language)

const model = defineModel()

const props = defineProps({
  mode: {
    type: String,
    default: 'default', // 可选值：[default | simple]
  },
  placeholder: {
    type: String,
    default: '',
  },
  style: {
    type: String,
    default: 'height: 500px; overflow-y: hidden;',
  },
  readOnly: {
    type: Boolean,
    default: () => false,
  },
  disabled: {
    type: Boolean,
    default: () => false,
  }, // 是否禁用组件 ==> 非必传（默认为 false）
})

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

type InsertFnType = (url: string, alt: string, href: string) => void

// 工具栏配置
const toolbarConfig = {}

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: props.placeholder,
  readOnly: props.readOnly || props.disabled,
  autoFocus: true,
  scroll: true,
  MENU_CONF: {
    // 上传图片的配置
    uploadImage: {
      server: `${constant.uploadUrl}?accessType=0`,
      // 单个文件的最大体积限制，默认为 2M
      maxFileSize: 5 * 1024 * 1024, // 5M
      // 最多可上传几个文件，默认为 100
      maxNumberOfFiles: 10,
      // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
      allowedFileTypes: ['image/*'],

      // 自定义增加 http  header
      headers: { Authorization: authStore.accessToken },

      // 超时时间，默认为 10 秒
      timeout: 20 * 1000, // 20秒
      // form-data fieldName，后端接口参数名称，默认值wangeditor-uploaded-image
      fieldName: 'file',

      // 上传之前触发
      onBeforeUpload(file: File) {
        return file
      },
      // 上传进度的回调函数
      onProgress(progress: number) {
        // progress 是 0-100 的数字
        console.debug('progress', progress)
      },
      onSuccess(file: File, res: any) {
        console.debug('onSuccess', file, res)
      },
      onFailed(file: File, res: any) {
        alert(res.message)
        console.debug('onFailed', file, res)
      },
      onError(file: File, err: any, res: any) {
        alert(err.message)
        console.error('onError', file, err, res)
      },
      // 自定义插入图片
      customInsert(res: any, insertFn: InsertFnType) {
        // res 即服务端的返回结果
        // 从 res 中找到 url、alt、href，然后插入图片
        insertFn(res.data.url, res.data.name || '图片', res.data.url)
      },
    },
    uploadVideo: {
      server: `${constant.uploadUrl}?accessType=0`,
      // 单个文件的最大体积限制，默认为 10M
      maxFileSize: 10 * 1024 * 1024,
      // 最多可上传几个文件，默认为 100
      maxNumberOfFiles: 10,
      // 选择文件时的类型限制，默认为 ['video/*'] 。如不想限制，则设置为 []
      allowedFileTypes: ['video/*'],

      // 自定义增加 http  header
      headers: { Authorization: authStore.accessToken },

      // 超时时间，默认为 30 秒
      timeout: 15 * 1000, // 15 秒

      // form-data fieldName，后端接口参数名称，默认值wangeditor-uploaded-image
      fieldName: 'file',

      // 上传之前触发
      onBeforeUpload(file: File) {
        return file
      },
      // 上传进度的回调函数
      onProgress(progress: number) {
        // progress 是 0-100 的数字
        console.debug('progress', progress)
      },
      onSuccess(file: File, res: any) {
        console.debug('onSuccess', file, res)
      },
      onFailed(file: File, res: any) {
        alert(res.message)
        console.log('onFailed', file, res)
      },
      onError(file: File, err: any, res: any) {
        alert(err.message)
        console.error('onError', file, err, res)
      },
      // 自定义插入 mp4
      customInsert(res: any, insertFn: InsertFnType) {
        insertFn(res.data.url, 'mp4', res.data.url)
      },
    },
  },
}

const disabledValue = computed(() => props.readOnly || props.disabled)

/**
 * 编辑器创建完毕，获取编辑器实例
 *
 * @see https://www.wangeditor.com/v5/api.html#editor-created
 * @param editor
 */
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor // 记录 editor 实例
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  // 销毁，并移除 editor
  editor?.destroy()
})

// 暴露给父组件的 getEditorRef 方法
const getEditorRef = async (): Promise<IDomEditor> => {
  await nextTick()
  return editorRef.value as IDomEditor
}

watch(
  () => props.disabled,
  (val) => {
    if (val) {
      editorRef.value?.disable()
    } else {
      editorRef.value?.enable()
    }
  },
)

defineExpose({
  getEditorRef,
})
</script>

<style lang="scss">
.w-e-text-placeholder {
  line-height: normal;
}
</style>
