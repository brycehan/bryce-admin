<template>
  <div class="refresh" @click="refresh">
    <icon icon="ep:refresh-right" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()

const refresh = () => {
  if (!useAuthStore().permitAccess()) return

  tabsStore.deleteCachedView(route).then(() => {
    nextTick(() => {
      router.replace({ path: '/redirect' + route.path }).catch((error) => {
        console.warn(error)
      })
    })
  })
}
</script>

<style lang="scss" scoped>
.refresh {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: var(--app-header-height);
  font-size: 16px;
  line-height: var(--app-header-height);
  color: var(--app-header-text-color);
  cursor: pointer;

  &:hover {
    background-color: rgb(0 0 0 / 10%);
  }
}

.dark .refresh:hover {
  background-color: rgb(255 255 255 / 10%);
}
</style>
