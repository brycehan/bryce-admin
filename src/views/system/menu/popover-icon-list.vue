<template>
    <div class="icon-popover-icon-inner">
      <el-scrollbar height="250">
        <el-row class="h-[30px] !mx-[10px]">
            <el-col
              v-for="(item, index) in appStore.icons"
              :key="index"
              class="cursor-pointer !flex justify-center items-center"
              @click="handleIcon(item)"
              :xs="4"
              :sm="3"
              :md="3"
              :lg="2"
              :xl="2"
              :span="2"
            >
              <el-button :type="model === item? 'primary': ''" class="my-1 h-[25px]">
                <icon :icon="item" />
              </el-button>
            </el-col>
        </el-row>
      </el-scrollbar>
    </div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'

const emit = defineEmits(['hide']);

const appStore = useAppStore()

const model = defineModel()

/**
 * 图标点击事件
 *
 * @param icon 图标名称
 */
const handleIcon = (icon: string) => {
  emit('hide', icon)
}
</script>

<style scoped lang="scss"></style>
