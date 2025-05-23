<template>
  <el-dropdown @command="handleLanguageChange">
    <div class="el-dropdown-text">
      <icon icon="ion:language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="language in languages"
          :key="language"
          :command="language"
          :disabled="locale === language"
        >
          {{ messages[language].langName }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { messages } from '@/i18n'

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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: var(--app-header-height);
  font-size: 16px;
  line-height: var(--app-header-height);
  color: var(--app-header-text-color);
  cursor: pointer;

  &:hover {
    background-color: rgb(0 0 0 / 10%);
  }
}
</style>
