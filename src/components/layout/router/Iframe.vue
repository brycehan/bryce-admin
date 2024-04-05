<template>
  <el-card shadow="never" v-loading="loading">
    <iframe :src="url" class="iframe" @load="load"></iframe>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { replaceLinkParam } from '@/utils/tool'
import { useRoute } from 'vue-router'

const loading = ref(false)
const url = ref('')
const route = useRoute()

onMounted(() => {
  initUrl(route)
})

watch(
  () => route,
  (value) => {
    if (value.path === '/iframe') {
      initUrl(value)
    }
  },
  { deep: true }
)

/**
 * 初始化URL
 *
 * @param route 路由
 */
const initUrl = (route: RouteLocationNormalizedLoaded): void => {
  loading.value = true

  const { meta, query } = route
  if (query.url) {
    url.value = query.url as string
  } else {
    url.value = replaceLinkParam(meta.url as string)
  }
}

const load = () => {
  loading.value = false
}
</script>

<style scoped lang="scss">
.iframe {
  min-height: calc(100vh - 70px - 50px - var(--theme-header-height));
  width: 100%;
  border: 0;
}
</style>
