<template>
  <div>
    <!-- 侧边栏 -->
    <el-space>
      <el-tooltip effect="dark" :content="t('settings.sidebar.dark')" placement="top">
        <div
          class="settings-box-item item-left-dark"
          :class="theme.sidebarStyle === 'dark' ? 'active' : ''"
          @click="handleSidebarTheme('dark')"
        ></div>
      </el-tooltip>
      <el-tooltip effect="dark" :content="t('settings.sidebar.light')" placement="top">
        <div
          class="settings-box-item item-left-light"
          :class="theme.sidebarStyle === 'light' ? 'active' : ''"
          @click="handleSidebarTheme('light')"
        ></div>
      </el-tooltip>
    </el-space>
    <!-- 侧边栏背景色按钮 -->
    <el-space class="my-4" :size="2" wrap>
      <div v-for="color in sidebarColors" :key="color">
        <span
          class="theme-primary-color"
          :class="{ active: theme?.sidebarColor === color }"
          :style="{ backgroundColor: color }"
          @click="handleSidebarColor(color)"
        ></span>
      </div>
    </el-space>

    <!-- 顶栏 -->
    <el-space class="mt-4" direction="horizontal">
      <el-tooltip effect="dark" :content="t('settings.header.light')" placement="top">
        <div
          class="settings-box-item item-top-light"
          :class="{ active: theme?.headerStyle === 'light' }"
          @click="handleHeaderTheme('light')"
        ></div>
      </el-tooltip>
      <el-tooltip effect="dark" :content="t('settings.header.primary')" placement="top">
        <div
          class="settings-box-item item-top-primary"
          :class="{ active: theme?.headerStyle === 'primary' }"
          @click="handleHeaderTheme('primary')"
        ></div>
      </el-tooltip>
    </el-space>
    <!-- 主题色按钮 -->
    <el-space class="my-4" :size="2" wrap>
      <div v-for="color in colors" :key="color">
        <span
          class="theme-primary-color"
          :class="{ active: theme?.primaryColor === color }"
          :style="{ backgroundColor: color }"
          @click="handleThemeColor(color)"
        ></span>
      </div>
    </el-space>
  </div>
</template>

<script setup lang="ts">
// 是否显示
import emitter from '@/utils/emitter'
import storage from '@/utils/storage'
import { handleThemePrimary } from '@/utils/theme'

const visible = ref(false)
emitter.on('openThemeSetting', () => {
  visible.value = true
})

const appStore = useAppStore()
const { t } = useI18n()

const theme = computed(() => appStore.theme)

/**
 * 侧边栏背景色
 */
const sidebarColors = [
  '#263544',
  '#253238',
  '#2D4A3E',
  '#3A2E4A',
  '#2F2F2F',
  '#4A2C2A',
  '#0A1F3D',
  '#4A3A1E',
  '#37475A',
  '#405A4E',
  '#4E425A',
  '#3D3D3D',
  '#634341',
  '#1F3A5F',
  '#66553A',
]

/**
 * 主题色
 */
const colors = [
  '#409eff',
  '#0BB2D4',
  '#3E8EF7',
  '#11C26D',
  '#17B3A3',
  '#667AFA',
  '#997B71',
  '#9463F7',
  '#757575',
  '#EB6709',
  '#F74584',
  '#FCB900',
  '#FF4C52',
  '#43A047',
  '#FF7F50',
]

/**
 * 切换侧边栏主题
 *
 * @param style 侧边栏主题
 */
const handleSidebarTheme = (style: string) => {
  theme.value.sidebarStyle = style
}

/**
 * 切换顶栏主题
 *
 * @param style 顶栏主题
 */
const handleHeaderTheme = (style: string) => {
  theme.value.headerStyle = style
}

/**
 * 切换主题色
 *
 * @param color 主题色
 */
const handleThemeColor = (color: string) => {
  theme.value.primaryColor = color
  handleThemePrimary(theme.value)
}

/**
 * 切换侧边栏背景色
 *
 * @param color 背景色
 */
const handleSidebarColor = (color: string) => {
  theme.value.sidebarColor = color
  // 设置 CSS 变量值
  document.documentElement.style.setProperty('--app-aside-bg-dark', color)
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
  box-shadow: 0 0.125rem 0.25rem rgb(0 0 0 / 15%);

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
   * 侧边栏dark样式
   */
.item-left-dark {
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 33%;
    height: 100%;
    content: '';
    background-color: black;
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
  }
}

/**
   * 侧边栏light样式
   */
.item-left-light {
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 33%;
    height: 100%;
    content: '';
    background-color: white;
    border-top: 1px solid #eee;
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
  }
}

/**
   * 头栏light样式
   */
.item-top-light {
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 33%;
    content: '';
    background-color: white;
    border-top: 1px solid #eee;
    border-left: 1px solid #eee;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }
}

/**
   * 头栏primary样式
   */
.item-top-primary {
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 33%;
    content: '';
    background-color: var(--el-color-primary);
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }
}

/**
   * 主题色
   */
.theme-primary-color {
  position: relative;
  display: inline-block;
  width: 1.4rem;
  height: 1.4rem;
  margin: 0.5rem 0.5rem 0 0;
  vertical-align: top;
  cursor: pointer;
  border-radius: 0.25rem;

  &.active {
    &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -0.5rem 0 0 -0.5rem;
      font-size: 1rem;
      color: white;

      // 选中样式
      content: url('data:image/svg+xml;charset=utf-8,<svg width="14" height="14" color="rgb(255 255 255)" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-042ca774=""><path fill="currentColor" d="M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z"></path></svg>');
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }
}

.dark {
  .settings-box-item {
    background-color: #aaa;
  }

  .item-left-dark {
    &::before {
      background-color: #333;
    }
  }
}
</style>
