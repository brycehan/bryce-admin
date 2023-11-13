<template>
  <div>
    <MdEditor v-model="editorValue" height="500px" />
  </div>
</template>

<script setup lang="ts">
import MdEditor from "@/components/md-editor/index.vue";
import {ref} from "vue";

const editorValue = ref('bryce')
</script>
