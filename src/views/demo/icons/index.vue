<template>
  <el-card :header="`点击图标即可复制代码，已提供的图标：${iconLength}个`" shadow="hover">
    <el-row class="iconfont-row border-t border-l border-solid border-(--app-border-color)">
      <template v-for="(coll, k) in iconCollections">
        <el-col
          v-for="(icon, key) in Object.keys(coll.icons)"
          :key="`${k}-${key}`"
          class="h-[100px] border-r border-b border-solid border-(--app-border-color)"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="3"
          :xl="2"
        >
          <div
            class="flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden hover:bg-[var(--el-border-color-extra-light)]"
            @click="handleCopy(coll.prefix, icon)"
          >
            <icon :icon="`${coll.prefix}:${icon}`" width="30" class="mb-[10px] flex" />
            <p>{{ coll.prefix }}:{{ icon }}</p>
          </div>
        </el-col>
      </template>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import BrcIconsJSON from '@/assets/js/brc-icons.json'

const { copy } = useClipboard()

const iconCollections = ref<any[]>([])

/**
 * 获取图标个数
 */
const iconLength = computed(() => {
  return iconCollections.value
    .map((item: any) => {
      return Object.keys(item.icons).length
    })
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
})

/**
 * 复制图标
 *
 * @param prefix 图标前缀
 * @param icon 图标名称
 */
const handleCopy = (prefix: string, icon: string) => {
  const iconValue = `<icon icon="${prefix}:${icon}" />`
  copy(iconValue)
  ElMessage.success('已复制')
}

onMounted(() => {
  iconCollections.value.push(BrcIconsJSON)
})
</script>
