<template>
  <vue-markdown-editor v-model="model" :height="height" />
</template>

<script setup lang="ts">
import VueMarkdownEditor from '@kangc/v-md-editor'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import '@kangc/v-md-editor/lib/theme/style/github.css'
// highlight
import hljs from 'highlight.js'

VueMarkdownEditor.use(githubTheme, {
  Hljs: hljs
})

const model = defineModel()

const props = defineProps({
  height: {
    type: String,
    default: '400px'
  }
})
</script>
