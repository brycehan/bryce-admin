<template>
  <SvgIcon icon="icon-reload" @click="refresh"></SvgIcon>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/svg-icon/svg-icon.vue'
import { useTabsStore } from '@/stores/modules/tabs'
import { useRoute, useRouter } from 'vue-router'
import { nextTick } from 'vue'

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()

const refresh = () => {
  tabsStore.deleteCachedView(route).then(() => {
    nextTick(() => {
      router.replace({ path: '/redirect' + route.path }).catch((error) => {
        console.warn(error)
      })
    })
  })
}
</script>
