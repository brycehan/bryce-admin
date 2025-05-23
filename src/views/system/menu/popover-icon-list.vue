<template>
  <div class="icon-popover-icon-inner">
    <el-scrollbar height="250">
      <el-row class="!mx-[10px] h-[30px]">
        <el-col
          v-for="(item, index) in appStore.icons"
          :key="index"
          class="!flex cursor-pointer items-center justify-center"
          :xs="4"
          :sm="3"
          :md="3"
          :lg="2"
          :xl="2"
          :span="2"
          @click="handleIcon(item)"
        >
          <el-button :type="model === item ? 'primary' : ''" class="my-1 h-[25px]">
            <icon :icon="item" />
          </el-button>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['hide'])

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
