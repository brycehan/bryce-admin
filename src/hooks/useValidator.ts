import type { FormItemRule } from 'element-plus'

export const useValidator = () => {
  const { t } = useI18n()

  const required = (trigger?: string): FormItemRule => {
    return {
      required: true,
      message: t('rules.required'),
      trigger: trigger || 'blur',
    }
  }

  const remote = (options: { api: Function; message: string; trigger?: string; params?: any }): FormItemRule => {
    return {
      validator: (_rule, value, callback) => {
        options
          .api(value, options.params)
          .then((res: any) => {
            if (res.data) {
              callback()
            } else {
              callback(new Error(options.message))
            }
          })
          .catch(() => callback(new Error(options.message)))
      },
      trigger: options.trigger || 'blur',
    }
  }

  return {
    required,
    remote,
  }
}
