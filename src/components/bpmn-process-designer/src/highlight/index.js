// 导入 highlight.js 核心库
import hljs from 'highlight.js/lib/core'

// 导入需要的语言模块
import xmlLanguage from 'highlight.js/lib/languages/xml'
import jsonLanguage from 'highlight.js/lib/languages/json'

// 注册语言
hljs.registerLanguage('xml', xmlLanguage)
hljs.registerLanguage('json', jsonLanguage)

// 导出配置好的 hljs 实例
export default hljs
