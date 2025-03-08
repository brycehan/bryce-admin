<template>
  <el-card :header="`点击图标即可复制代码，已提供的图标：${iconList.length}个`" shadow="hover">
    <el-row class="iconfont-row">
      <el-col
        v-for="(icon, key) in iconList"
        :key="key"
        class="iconfont-item items-center"
        :xs="12"
        :sm="8"
        :md="6"
        :lg="3"
        :xl="2"
      >
        <div @click="handleCopy(icon)">
          <SvgIcon :icon="icon" class-name="svg-size" />
          <p>{{ icon }}</p>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/svg-icon/svg-icon.vue'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { getIconList } from '@/utils/tool'

const { copy } = useClipboard()

/** 获取svg图标（id）列表 */
const iconList = getIconList()

const handleCopy = (icon: string) => {
  copy(icon)
  ElMessage.success('已复制')
}
</script>

<style scoped lang="scss">
.iconfont-header {
  --el-header-padding: 0;
  border-bottom: 1px solid red;
}
.iconfont-row {
  border-top: 1px solid var(--theme-border-color-light);
  border-left: 1px solid var(--theme-border-color-light);

  & ::v-deep(.svg-size) {
    width: 30px;
    height: 30px;
    margin-bottom: 10px;
  }

  .iconfont-item {
    display: flex;
    text-align: center;
    overflow: hidden;
    justify-content: space-around;
    border-right: 1px solid var(--theme-border-color-light);
    border-bottom: 1px solid var(--theme-border-color-light);
    cursor: pointer;
    height: 100px;

    &:hover {
      background-color: var(--el-border-color-extra-light);
    }
  }
}
</style>
