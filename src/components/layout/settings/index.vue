<template>
  <div class="settings-container">
    <el-drawer v-model="visible" title="布局设置" :destroy-on-close="true" :size="280">
      <el-scrollbar class="settings-content">
        <el-space direction="vertical" style="align-items: flex-start">
          <!-- 侧边栏 -->
          <el-space>
            <el-tooltip effect="dark" content="暗色侧边栏" placement="top">
              <div
                class="settings-box-item item-left-dark"
                :class="theme.sidebarStyle === 'dark' ? 'active' : ''"
                @click="handleSidebarTheme('dark')"
              ></div>
            </el-tooltip>
            <el-tooltip effect="dark" content="亮色侧边栏" placement="top">
              <div
                class="settings-box-item item-left-light"
                :class="theme.sidebarStyle === 'light' ? 'active' : ''"
                @click="handleSidebarTheme('light')"
              ></div>
            </el-tooltip>
          </el-space>
          <!-- 顶栏 -->
          <el-space direction="horizontal">
            <el-tooltip effect="dark" content="亮色顶栏" placement="top">
              <div
                class="settings-box-item item-top-light"
                :class="{ active: theme?.headerStyle === 'light' }"
                @click="handleHeaderTheme('light')"
              ></div>
            </el-tooltip>
            <el-tooltip effect="dark" content="主题色顶栏" placement="top">
              <div
                class="settings-box-item item-top-primary"
                :class="{ active: theme?.headerStyle === 'primary' }"
                @click="handleHeaderTheme('primary')"
              ></div>
            </el-tooltip>
          </el-space>
          <!-- 主题色按钮 -->
          <el-space :size="2" wrap>
            <div v-for="color in colors" :key="color">
              <span
                class="theme-primary-color"
                :class="{ active: theme?.primaryColor === color }"
                :style="{ backgroundColor: color }"
                @click="handleThemeColor(color)"
              ></span>
            </div>
          </el-space>
        </el-space>

        <el-divider content-position="left">布局切换</el-divider>
        <!-- 布局切换 -->
        <el-space>
          <el-tooltip effect="dark" content="纵向" placement="top">
            <div
              class="settings-box-item item-vertical"
              :class="theme.layout === 'vertical' ? 'active' : ''"
              @click="handleLayoutTheme('vertical')"
            ></div>
          </el-tooltip>
          <el-tooltip effect="dark" content="分栏" placement="top">
            <div
              class="settings-box-item item-column"
              :class="theme.layout === 'column' ? 'active' : ''"
              @click="handleLayoutTheme('column')"
            >
              <div class="column-tip-box"></div>
              <div class="column-sub-menu"></div>
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="横向" placement="top">
            <div
              class="settings-box-item item-horizontal"
              :class="theme.layout === 'horizontal' ? 'active' : ''"
              @click="handleLayoutTheme('horizontal')"
            ></div>
          </el-tooltip>
        </el-space>

        <el-divider content-position="left">界面设置</el-divider>

        <switch-item v-model="theme.uniqueOpened" title="侧栏排他展开" @change="handleOtherTheme" />
        <switch-item v-model="theme.showLogo" title="开启LOGO" @change="handleOtherTheme" />
        <switch-item v-model="theme.showBreadcrumb" title="开启面包屑" @change="handleOtherTheme" />
        <switch-item v-model="theme.showTabsView" title="开启标签页" @change="handleOtherTheme" />
        <switch-item v-model="theme.isTabsCache" title="开启标签页缓存" @change="handleOtherTheme" />

        <el-divider />

        <el-space direction="vertical" class="config-content">
          <el-alert
            title='设置之后仅是临时生效，要想永久生效，需点击下方的 "复制配置" 按钮，将配置替换到 /src/store/theme/config.ts 中。'
            type="warning"
            :closable="false"
          />
          <el-button type="primary" icon="CopyDocument" @click="handleCopyConfig">复制配置</el-button>
          <el-button type="info" icon="RefreshRight" @click="handleResetConfig">恢复默认</el-button>
        </el-space>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
// 是否显示
import { computed, ref } from 'vue'
import emitter from '@/utils/emitter'
import { useAppStore } from '@/stores/modules/app'
import { useClipboard } from '@vueuse/core'
import storage from '@/utils/storage'
import { ElMessage } from 'element-plus'
import SwitchItem from '@/components/layout/settings/SwitchItem.vue'
import { handleThemePrimary } from '@/utils/theme'

const visible = ref(false)
emitter.on('openThemeSetting', () => {
  visible.value = true
})

const appStore = useAppStore()
const { copy } = useClipboard()

const theme = computed(() => appStore.theme)

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
  '#FF4C52'
]

/**
 * 切换布局
 *
 * @param layout 布局
 */
const handleLayoutTheme = (layout: string) => {
  theme.value.layout = layout
  storage.setTheme(theme.value)
}

/**
 * 切换侧边栏主题
 *
 * @param style 侧边栏主题
 */
const handleSidebarTheme = (style: string) => {
  theme.value.sidebarStyle = style
  storage.setTheme(theme.value)
}

/**
 * 切换顶栏主题
 *
 * @param style 顶栏主题
 */
const handleHeaderTheme = (style: string) => {
  theme.value.headerStyle = style
  storage.setTheme(theme.value)
}

/**
 * 切换主题色
 *
 * @param color 主题色
 */
const handleThemeColor = (color: string) => {
  theme.value.primaryColor = color
  storage.setTheme(theme.value)
  handleThemePrimary(theme.value)
}

const handleOtherTheme = () => {
  storage.setTheme(theme.value)
}

/**
 * 复制主题配置
 */
const handleCopyConfig = () => {
  const config = JSON.stringify(theme.value, null, 2)
  copy(config)
  ElMessage.success('复制成功')
}

/**
 * 重置主题配置
 */
const handleResetConfig = async () => {
  storage.removeTheme()
  window.location.reload()
}
</script>

<style lang="scss" scoped>
/**
 * drawer 去除默认边距
 */
.settings-container {
  ::v-deep(.el-drawer) {
    --el-drawer-padding-primary: unset !important;
  }
}

.settings-content {
  padding: 15px;
  color: #444444;

  .settings-box-item {
    position: relative;
    width: 50px;
    height: 35px;
    margin: 0 20px 20px 0;
    background-color: rgb(240 242 244);
    border-radius: 3px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    cursor: pointer;

    &.active {
      &:after {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: var(--el-color-primary);
        position: absolute;
        left: 50%;
        bottom: -15px;
      }
    }
  }

  /**
   * 侧边栏dark样式
   */
  .item-left-dark {
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 33%;
      height: 100%;
      background-color: black;
      content: '';
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
  }

  /**
   * 侧边栏light样式
   */
  .item-left-light {
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 33%;
      height: 100%;
      background-color: white;
      content: '';
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
  }

  /**
   * 头栏light样式
   */
  .item-top-light {
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 33%;
      background-color: white;
      content: '';
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
    }
  }

  /**
   * 头栏primary样式
   */
  .item-top-primary {
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 33%;
      background-color: var(--el-color-primary);
      content: '';
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
    }
  }

  .theme-primary-color {
    width: 20px;
    height: 20px;
    margin: 8px 8px 0 0;
    border-radius: 2px;
    display: inline-block;
    vertical-align: top;
    position: relative;
    cursor: pointer;

    &.active {
      &:after {
        // 选中样式
        content: url('data:image/svg+xml;charset=utf-8,<svg width="14" height="14" color="rgb(255 255 255)" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-042ca774=""><path fill="currentColor" d="M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z"></path></svg>');
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -7px 0 0 -7px;
        font-size: 14px;
        color: white;
      }
    }
  }

  /**
   * 菜单纵向样式
   */
  .item-vertical {
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 33%;
      height: 100%;
      background-color: black;
      content: '';
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
  }

  /**
  * 菜单分栏样式
  */
  .item-column {
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 20%;
      height: 100%;
      background-color: black;
      content: '';
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }

    .column-tip-box {
      transition: inherit;
      position: relative;
      top: 0;
      left: 20%;
      width: 83%;
      height: 30%;
      background-color: #333;
      content: '';
      border-top-right-radius: 3px;
    }

    .column-sub-menu {
      transition: inherit;
      position: relative;
      top: 0;
      left: 20%;
      width: 18%;
      height: 70%;
      background-color: #999;
      content: '';
      border-bottom-right-radius: 3px;
    }
  }

  /**
  * 菜单横向样式
  */
  .item-horizontal {
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 33%;
      background-color: #333;
      content: '';
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
    }
  }

  .config-content {
    ::v-deep(.el-space__item) {
      width: 100%;
    }
    button {
      width: 100%;
    }
  }
}
</style>
