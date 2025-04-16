import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDictListApi } from '@/api/system/dictData.ts'

export const useDictStore = defineStore(
  'dictStore',
  () => {
    // 字典Map
    const dictMap = ref<Record<string, any>>()

    /**
     * 获取字典列表
     */
    const getDictMap = async () => {
      const { data } = await getDictListApi()
      dictMap.value = data as Record<string, any> || []
      return dictMap.value
    }

    /**
     * 获取字典数据列表
     *
     * @param dictType 字典类型
     */
    const getDictDataList = (dictType: string) => {
      return  dictMap.value?.[dictType] || []
    }

    /**
     * 获取字典数据列表（string 类型）
     *
     * @param dictType 字典类型
     */
    const getStringDictOptions = (dictType: string) => {
      // 获得对应的 DictData 列表
      const dictOptions: any[] = getDictDataList(dictType)
      // 转换成 string 类型的 DictData 类型
      const dictOption: any[] = []
      dictOptions.forEach((dict: any) => {
        dictOption.push({
          label: dict.dictLabel,
          value: dict.dictValue + ''
        })
      })
      return dictOption
    }

    /**
     * 获取字典数据列表（number 类型）
     *
     * @param dictType 字典类型
     */
    const getIntDictOptions = (dictType: string): any[] => {
      // 获得对应的 DictData 列表
      const dictOptions: any[] = getDictDataList(dictType)
      // 转换成 number 类型的 DictData 类型
      const dictOption: any[] = []
      dictOptions.forEach((dict: any) => {
        dictOption.push({
          label: dict.dictLabel,
          value: parseInt(dict.dictValue + '')
        })
      })
      return dictOption
    }

    const getBooleanDictOptions = (dictType: string) => {
      const dictOption: any[] = []
      const dictOptions: any[] = getDictDataList(dictType)
      dictOptions.forEach((dict: any) => {
        dictOption.push({
          label: dict.dictLabel,
          value: dict.dictValue + '' === 'true'
        })
      })
      return dictOption
    }

    /**
     * 获取字典Label
     *
     * @param dictType 字典类型
     * @param dictValue 字典值
     */
    const getDictLabel = (dictType: string, dictValue: string) => {
      const dict =  dictMap.value?.[dictType]
      if (dict) {
        const dictData = dict.find((element: any) => element.dictValue === dictValue + '')
        if (dictData) {
          return dictData.dictLabel
        }
      }
      return dictValue
    }

    /**
     * 获取字典Label样式
     *
     * @param dictType 字典类型
     * @param dictValue 字典值
     */
    const getDictLabelClass = (dictType: string, dictValue: string) => {
      const dict =  dictMap.value?.[dictType]
      if (dict) {
        const dictData = dict.find((element: any) => element.dictValue === dictValue + '')
        if (dictData) {
          return dictData.labelClass
        }
      }
      return ''
    }

    return {
      dictMap,
      getDictMap,
      getDictDataList,
      getStringDictOptions,
      getIntDictOptions,
      getBooleanDictOptions,
      getDictLabel,
      getDictLabelClass,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
)
