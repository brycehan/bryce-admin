<template>
  <div class="settings-container">
    <el-drawer v-model="visible" :title="t('settings.title')" :destroy-on-close="true" :size="280">
      <el-scrollbar class="settings-content">
        <el-space direction="vertical" style="align-items: flex-start">
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
          <!-- 顶栏 -->
          <el-space direction="horizontal">
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

        <el-divider content-position="left">{{ t('settings.layout.title') }}</el-divider>
        <!-- 布局切换 -->
        <el-space>
          <el-tooltip effect="dark" :content="t('settings.layout.vertical')" placement="top">
            <div
              class="settings-box-item item-vertical"
              :class="theme.layout === 'vertical' ? 'active' : ''"
              @click="handleLayoutTheme('vertical')"
            ></div>
          </el-tooltip>
          <el-tooltip effect="dark" :content="t('settings.layout.column')" placement="top">
            <div
              class="settings-box-item item-column"
              :class="theme.layout === 'column' ? 'active' : ''"
              @click="handleLayoutTheme('column')"
            >
              <div class="column-tip-box"></div>
              <div class="column-sub-menu"></div>
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" :content="t('settings.layout.horizontal')" placement="top">
            <div
              class="settings-box-item item-horizontal"
              :class="theme.layout === 'horizontal' ? 'active' : ''"
              @click="handleLayoutTheme('horizontal')"
            ></div>
          </el-tooltip>
        </el-space>

        <el-divider content-position="left">{{ t('settings.interface.title') }}</el-divider>

        <switch-item
          v-model="theme.uniqueOpened"
          :title="t('settings.interface.uniqueOpened')"
          @change="handleOtherTheme"
        />
        <switch-item v-model="theme.showLogo" :title="t('settings.interface.showLogo')" @change="handleOtherTheme" />
        <switch-item
          v-model="theme.showBreadcrumb"
          :title="t('settings.interface.showBreadcrumb')"
          @change="handleOtherTheme"
        />
        <switch-item
          v-model="theme.showTabsView"
          :title="t('settings.interface.showTagsView')"
          @change="handleOtherTheme"
        />
        <switch-item
          v-model="theme.isTabsCache"
          :title="t('settings.interface.showTagsViewCache')"
          @change="handleOtherTheme"
        />

        <el-divider />

        <el-space direction="vertical" class="config-content">
          <el-alert :title="t('settings.tips')" type="warning" :closable="false" />
          <el-button type="primary" icon="CopyDocument" @click="handleCopyConfig">{{
            t('settings.button.copyConfig')
          }}</el-button>
          <el-button type="info" icon="RefreshRight" @click="handleResetConfig">{{
            t('settings.button.reset')
          }}</el-button>
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
const { t } = useI18n()

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
  '#FF4C52',
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
  ElMessage.success(t('settings.copySuccess'))
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
  color: #444;

  .settings-box-item {
    position: relative;
    width: 50px;
    height: 35px;
    margin: 0 20px 20px 0;
    cursor: pointer;
    background-color: rgb(240 242 244);
    border-radius: 3px;
    box-shadow: 0 1px 3px rgb(0 0 0 / 15%);

    &.active {
      &::after {
        position: absolute;
        bottom: -15px;
        left: 50%;
        width: 6px;
        height: 6px;
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
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
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
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
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
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
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
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
    }
  }

  /**
   * 主题色
   */
  .theme-primary-color {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    margin: 8px 8px 0 0;
    vertical-align: top;
    cursor: pointer;
    border-radius: 2px;

    &.active {
      &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -7px 0 0 -7px;
        font-size: 14px;
        color: white;

        // 选中样式
        content: url('data:image/svg+xml;charset=utf-8,<svg width="14" height="14" color="rgb(255 255 255)" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-042ca774=""><path fill="currentColor" d="M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z"></path></svg>');
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
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
      width: 33%;
      height: 100%;
      content: '';
      background-color: black;
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
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
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }

    .column-tip-box {
      position: relative;
      top: 0;
      left: 20%;
      width: 83%;
      height: 30%;
      content: '';
      background-color: #333;
      border-top-right-radius: 3px;
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
      border-bottom-right-radius: 3px;
      transition: inherit;
    }
  }

  /**
  * 菜单横向样式
  */
  .item-horizontal {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 33%;
      content: '';
      background-color: #333;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
    }
  }

  /**
  * 配置内容样式
  */
  .config-content {
    ::v-deep(.el-space__item) {
      width: 100%;

      & .el-alert__title {
        font-size: 1rem;
        line-height: 1.71rem;
      }
    }

    button {
      width: 100%;
    }
  }
}
</style>
