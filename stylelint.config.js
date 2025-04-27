/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-standard-vue/scss', 'stylelint-config-recess-order'],
  plugins: ['stylelint-scss', 'stylelint-order'],
  rules: {
    // SCSS 相关规则
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'layer', 'config', '@plugin'],
      },
    ],

    // Vue 相关规则
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global', 'slotted'], // 允许 Vue 的深度选择器
      },
    ],

    // 其他自定义规则
    'selector-class-pattern': null, // 关闭类名格式校验（CSS Modules 需要）
  },
  ignoreFiles: ['src/assets/css/index.css', 'src/components/upload-file/*.vue'],
}
