<template>
  <el-card v-loading="loading" shadow="never">
    <iframe :src="url" class="iframe" @load="load"></iframe>
  </el-card>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { replaceLinkParam } from '@/utils/tool'

const loading = ref(false)
const url = ref('')
const route = useRoute()

watch(
  () => route,
  (value) => {
    if (value.path === '/iframe') {
      initUrl(value)
    }
  },
  { deep: true },
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

onMounted(() => {
  initUrl(route)
})
</script>

<style scoped lang="scss">
.iframe {
  width: 100%;
  min-height: calc(100vh - 70px - 50px - var(--app-header-height));
  border: 0;
}
</style>
