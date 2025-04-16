import request from '@/utils/request'
import { isEmpty } from '@/utils/is'
import { type ApiSelectProps } from '@/components/form-create/src/type'

export const useApiSelect = (option: ApiSelectProps) => {
  return defineComponent({
    name: option.name,
    props: {
      // 选项标签
      labelField: {
        type: String,
        default: () => option.labelField ?? 'label'
      },
      // 选项的值
      valueField: {
        type: String,
        default: () => option.valueField ?? 'value'
      },
      // api 接口
      url: {
        type: String,
        default: () => option.url ?? ''
      },
      // 请求类型
      method: {
        type: String,
        default: 'GET'
      },
      // 选项解析函数
      parseFunc: {
        type: String,
        default: ''
      },
      // 请求参数
      data: {
        type: String,
        default: ''
      },
      // 选择器类型，下拉框 select、多选框 checkbox、单选框 radio
      selectType: {
        type: String,
        default: 'select'
      },
      // 是否多选
      multiple: {
        type: Boolean,
        default: false
      },
      // 是否远程搜索
      remote: {
        type: Boolean,
        default: false
      },
      // 远程搜索时携带的参数
      remoteField: {
        type: String,
        default: 'label'
      }
    },
    setup(props) {
      const attrs = useAttrs()
      const options = ref<any[]>([]) // 下拉数据
      const loading = ref(false) // 是否正在从远程获取数据
      const queryParam = ref<any>() // 当前输入的值

      /**
       * 获取下拉数据
       */
      const getOptions = async () => {
        options.value = []
        // 接口选择器
        if (isEmpty(props.url)) {
          return
        }
        switch (props.method) {
          case 'GET':
            let url: string = props.url
            if (props.remote) {
              url = `${url}?${props.remoteField}=${queryParam.value}`
            }
            parseOptions(await request.get(url).then(res => res.data))
            break
          case 'POST':
            const data = jsonParse(props.data)
            if (props.remote) {
              data[props.remoteField] = queryParam.value
            }
            parseOptions(await request.post(props.url, data).then(res => res.data))
            break
        }
      }

      /**
       * 解析 JSON 字符串
       *
       * @param str
       */
      function jsonParse(str: string) {
        try {
          return JSON.parse(str)
        } catch (_) {
          console.error(`str[${str}] 不是一个 JSON 字符串`)
          return ''
        }
      }

      /**
       * 解析数据
       *
       * @param data 数据
       */
      function parseOptions(data: any) {
        //  情况一：如果有自定义解析函数优先使用自定义解析
        if (!isEmpty(props.parseFunc)) {
          options.value = parseFunc()?.(data)
          return
        }
        // 情况二：返回的直接是一个列表
        if (Array.isArray(data)) {
          parseOptions0(data)
          return
        }
        // 情况二：返回的是分页数据,尝试读取 list
        data = data.list
        if (!!data && Array.isArray(data)) {
          parseOptions0(data)
          return
        }
        // 情况三：不是标准返回
        console.warn(`接口[${props.url}] 返回结果不是标准返回建议采用自定义解析函数处理`)
      }

      /**
       * 解析数据
       *
       * @param data 数据
       */
      function parseOptions0(data: any[]) {
        options.value = data.map((item: any) => ({
          label: parseExpression(item, props.labelField),
          value: parseExpression(item, props.valueField)
        }))
      }

      /**
       * 解析自定义解析函数
       */
      function parseFunc() {
        let parse: any = null
        if (!!props.parseFunc) {
          // 解析字符串函数
          parse = new Function(`return ${props.parseFunc}`)()
        }
        return parse
      }

      /**
       * 解析表达式
       *
       * @param data 数据
       * @param template 模板
       */
      function parseExpression(data: any, template: string) {
        // 检测是否使用了表达式
        if (template.indexOf('${') === -1) {
          return data[template]
        }
        // 正则表达式匹配模板字符串中的 ${...}
        const pattern = /\$\{([^}]*)}/g
        // 使用replace函数配合正则表达式和回调函数来进行替换
        return template.replace(pattern, (_, expr) => {
          // expr 是匹配到的 ${} 内的表达式（这里是属性名），从 data 中获取对应的值
          const result = data[expr.trim()] // 去除前后空白，以防用户输入带空格的属性名
          if (!result) {
            console.warn(`接口选择器选项模版[${template}][${expr.trim()}] 解析值失败结果为[${result}], 请检查属性名称是否存在于接口返回值中,存在则忽略此条！`)
          }
          return result
        })
      }

      /**
       * 远程搜索
       *
       * @param query 搜索值
       */
      const remoteMethod = async (query: any) => {
        if (!query) {
          return
        }
        loading.value = true
        try {
          queryParam.value = query
          await getOptions()
        } finally {
          loading.value = false
        }
      }

      onMounted(async () => {
        await getOptions()
      })

      /**
       * 构建选择框
       */
      const buildSelect = () => {
        if (props.multiple) {
          // fix：多写此步是为了解决 multiple 属性问题
          return (
            <el-select
              class="w-1/1"
              multiple
              loading={loading.value}
              {...attrs}
              remote={props.remote}
              {...(props.remote && { remoteMethod: remoteMethod })}
            >
              {options.value.map((item, index) => (
                <el-option key={index} label={item.label} value={item.value} />
              ))}
            </el-select>
          )
        }
        return (
          <el-select
            class="w-1/1"
            loading={loading.value}
            {...attrs}
            remote={props.remote}
            {...(props.remote && { remoteMethod: remoteMethod })}
          >
            {options.value.map((item, index) => (
              <el-option key={index} label={item.label} value={item.value} />
            ))}
          </el-select>
        )
      }

      /**
       * 构建多选框
       */
      const buildCheckbox = () => {
        if (isEmpty(options.value)) {
          options.value = [
            { label: '选项1', value: '选项1' },
            { label: '选项2', value: '选项2' }
          ]
        }
        return (
          <el-checkbox-group class="w-1/1" {...attrs}>
            {options.value.map((item, index) => (
              <el-checkbox key={index} label={item.label} value={item.value} />
            ))}
          </el-checkbox-group>
        )
      }

      /**
       * 构建单选框
       */
      const buildRadio = () => {
        if (isEmpty(options.value)) {
          options.value = [
            { label: '选项1', value: '选项1' },
            { label: '选项2', value: '选项2' }
          ]
        }
        return (
          <el-radio-group class="w-1/1" {...attrs}>
            {options.value.map((item, index) => (
              <el-radio key={index} value={item.value}>
                {item.label}
              </el-radio>
            ))}
          </el-radio-group>
        )
      }

      return () => (
        <>
          {props.selectType === 'select'
            ? buildSelect()
            : props.selectType === 'radio'
              ? buildRadio()
              : props.selectType === 'checkbox'
                ? buildCheckbox()
                : buildSelect()}
        </>
      )
    }
  })
}
