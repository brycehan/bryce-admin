<template>
  <el-card :header="`点击图标即可复制代码，已提供的图标：${iconLength}个`" shadow="hover">
    <el-row class="iconfont-row border-t border-l border-solid border-(--theme-border-color-light)">
      <template v-for="(coll, k) in iconCollections">
        <el-col
          v-for="(icon, key) in Object.keys(coll.icons)"
          :key="`${k}-${key}`"
          class="h-[100px] border-r border-b border-solid border-(--theme-border-color-light)"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="3"
          :xl="2"
        >
          <div @click="handleCopy(coll.prefix, icon)" class="w-full h-full flex items-center justify-center flex-col cursor-pointer overflow-hidden hover:bg-[var(--el-border-color-extra-light)]">
            <icon :icon="`${coll.prefix}:${icon}`" width="30" class="mb-[10px] flex" />
            <p>{{ coll.prefix }}:{{ icon }}</p>
          </div>
        </el-col>
      </template>

    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import IonIconsJSON from '@iconify-json/ion/icons.json'
import ElementPlusIconsJSON from '@iconify-json/ep/icons.json'
import BrcIconsJSON from '@/assets/js/brc-icons.json'

const { copy } = useClipboard()

const iconCollections = ref<any[]>([])

/**
 * 获取图标个数
 */
const iconLength = computed(() => {
  return iconCollections.value
    .map((item: any) => { return Object.keys(item.icons).length})
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
  iconCollections.value.push(IonIconsJSON, BrcIconsJSON, ElementPlusIconsJSON)
})
</script>
