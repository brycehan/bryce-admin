<template>
  <el-dropdown @command="handleLanguageChange">
    <div class="el-dropdown-text">
      <icon icon="ion:language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="language in languages" :key="language" :command="language" :disabled="locale === language">
          {{ messages[language].langName }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import { messages } from '@/i18n'
import { useI18n } from 'vue-i18n'

const appStore = useAppStore()
const languages = Object.keys(messages)
const { locale } = useI18n()

/**
 * 设置国际化语言
 *
 * @param {string} language - 用户选择的语言
 */
const handleLanguageChange = (language: string) => {
  appStore.setLanguage(language)
  locale.value = language
}
</script>

<style lang="scss" scoped>
.el-dropdown-text {
  width: 40px;
  height: var(--theme-header-height);
  line-height: var(--theme-header-height);
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--theme-header-text-color);
  font-size: 16px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
