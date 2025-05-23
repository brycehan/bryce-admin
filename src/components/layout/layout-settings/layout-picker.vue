<template>
  <div>
    <el-space>
      <el-tooltip effect="dark" :content="t('settings.layout.vertical')" placement="top">
        <div
          class="settings-box-item item-vertical"
          :class="theme.layout === 'vertical' ? 'active' : ''"
          @click="handleLayoutTheme('vertical')"
        >
          <div class="header-box"></div>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" :content="t('settings.layout.column')" placement="top">
        <div
          class="settings-box-item item-column"
          :class="theme.layout === 'column' ? 'active' : ''"
          @click="handleLayoutTheme('column')"
        >
          <div class="column-header-box"></div>
          <div class="column-sub-menu"></div>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" :content="t('settings.layout.horizontalOne')" placement="top">
        <div
          class="settings-box-item item-horizontal-one"
          :class="theme.layout === 'horizontalOne' ? 'active' : ''"
          @click="handleLayoutTheme('horizontalOne')"
        >
          <div class="aside-box"></div>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" :content="t('settings.layout.horizontalTwo')" placement="top">
        <div
          class="settings-box-item item-horizontal-two"
          :class="theme.layout === 'horizontalTwo' ? 'active' : ''"
          @click="handleLayoutTheme('horizontalTwo')"
        ></div>
      </el-tooltip>
    </el-space>
  </div>
</template>

<script setup lang="ts">
// 是否显示
import emitter from '@/utils/emitter'
import { ElMessage } from 'element-plus'

const visible = ref(false)
emitter.on('openThemeSetting', () => {
  visible.value = true
})

const appStore = useAppStore()
const { t } = useI18n()

const theme = computed(() => appStore.theme)

/**
 * 切换布局
 *
 * @param layout 布局
 */
const handleLayoutTheme = (layout: string) => {
  if (appStore.mobile && layout !== 'vertical') {
    ElMessage.warning('移动端模式下不支持切换其他布局')
    return
  }
  theme.value.layout = layout
}
</script>

<style lang="scss" scoped>
.settings-box-item {
  position: relative;
  width: 4rem;
  height: 3rem;
  margin: 0 1rem 1rem 0;
  cursor: pointer;
  background-color: rgb(240 242 244);
  border-radius: 0.25rem;
  box-shadow: 0 0.1rem 0.2rem rgb(0 0 0 / 25%);

  &.active {
    &::after {
      position: absolute;
      bottom: -1.2rem;
      left: 50%;
      width: 0.5rem;
      height: 0.5rem;
      content: '';
      background-color: var(--el-color-primary);
      border-radius: 50%;
    }
  }
}

/**
   * 菜单纵向样式
   */
.item-vertical {
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 30%;
    height: 100%;
    content: '';
    background-color: black;
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
  }

  .header-box {
    position: relative;
    top: 0;
    left: 30%;
    width: 70%;
    height: 30%;
    content: '';
    background-color: #fff;
    border-top: 1px solid #eee;
    border-top-right-radius: 0.25rem;
    transition: inherit;
  }
}

/**
  * 菜单分栏样式
  */
.item-column {
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 20%;
    height: 100%;
    content: '';
    background-color: black;
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
  }

  .column-header-box {
    position: relative;
    top: 0;
    left: 20%;
    width: 80%;
    height: 30%;
    content: '';
    background-color: white;
    border-top: 1px solid #eee;
    border-top-right-radius: 0.25rem;
    transition: inherit;
  }

  .column-sub-menu {
    position: relative;
    top: 0;
    left: 20%;
    width: 18%;
    height: 70%;
    content: '';
    background-color: #999;
    transition: inherit;
  }
}

/**
  * 菜单横向样式
  */
.item-horizontal-one {
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30%;
    content: '';
    background-color: #333;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    box-shadow: -1px 0 0 #333;
  }

  & > .aside-box {
    position: absolute;
    top: 30%;
    left: 0;
    width: 30%;
    height: 70%;
    content: '';
    background-color: white;
    border-bottom-left-radius: 0.25rem;
  }
}

/**
  * 菜单横向样式
  */
.item-horizontal-two {
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30%;
    content: '';
    background-color: #333;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    box-shadow: -1px 0 0 #333;
  }
}

.dark {
  .settings-box-item {
    background-color: #aaa;
  }

  .item-vertical {
    &::before {
      background: var(--el-color-primary);
    }
  }

  .item-column {
    &::before {
      background: var(--el-color-primary);
    }
  }

  .item-horizontal-one,
  .item-horizontal-two {
    &::before {
      background: var(--el-color-primary);
    }
  }
}
</style>
