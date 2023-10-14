<template>
  <div class="editor-wrapper">
    <!-- 工具栏 -->
    <Toolbar
        class="toolbar-container"
        :editor="editorRef"
        :default-config="toolbarConfig"
        :mode="mode"
    />
    <!-- 编辑器 -->
    <Editor
        :style="style"
        :model-value="modelValue"
        :default-config="editorConfig"
        :mode="mode"
        :readOnly="readOnly"
        @on-created="handleCreated"
        @on-change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import  {Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {onBeforeUnmount, shallowRef} from "vue";
import type {IDomEditor, IEditorConfig} from "@wangeditor/editor";
import constant from "@/utils/constant";
import stores from "@/stores";

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    default: 'default' // 可选值：[default | simple]
  },
  placeholder: {
    type: String,
    default: ''
  },
  style: {
    type: String,
    default: 'height: 300px;'
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

type InsertFnType = (url: string, alt: string, href: string) => void

// 工具栏配置
const toolbarConfig = {}
// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: props.placeholder,
  readOnly: props.readOnly,
  MENU_CONF: {
    // 上传图片的配置
    uploadImage: {
      server: constant.uploadUrl,
      timeout: 20 * 1000, // 20s
      // form-data fieldName
      fieldName: 'file',
      headers: { Authorization: stores.authStore.token },
      // 单个文件的最大体积限制，默认为 2M
      maxFileSize: 10 * 1024 * 1024, // 10M
      // 自定义插入图片
      customInsert(res: any, insertFn: InsertFnType) {
        // res 即服务端的返回结果
        // 从 res 中找到 url、alt、href，然后插入图片
        insertFn(res.data.url, res.data.name, '')
      }
    },
  }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if(editor == null) {
    return
  }
  editor.destroy()
})

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor // 记录 editor 实例
  editorRef.value.setHtml(editor.getHtml())
}

/**
 * 编辑器change事件触发
 */
const handleChange = (editor: IDomEditor) => {
  emit('update:modelValue', editor.getHtml())
}
</script>

<style lang="scss">
.editor-wrapper {
  border: 1px solid #ccc;
  z-index: 100; // 根据需要
}

.toolbar-container {
  border-bottom: 1px solid #ccc;
}

.w-e-text-placeholder {
  line-height: normal;
}
</style>
