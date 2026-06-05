// src/locale/index.ts
import { createI18n } from "vue-i18n"
import zhCN from "./zh-CN.json"
import enUS from "./en-US.json"
import { Locale } from "@wot-ui/ui"
import WotEnUS from "@wot-ui/ui/locale/lang/en-US"
import { interpolateTemplate } from "./utils"

Locale.add({ "en-US": WotEnUS })

const messages = {
  "zh-CN": {
    ...zhCN
  },
  "en-US": {
    ...enUS
  }
}

// 创建i18n实例
const i18n = createI18n({
  locale: uni.getStorageSync("currentLang") || "zh-CN", // 默认语言
  fallbackLocale: "zh-CN", // 回退语言
  messages, // 语言包
  legacy: false, // 启用Composition API模式
  globalInjection: true // 全局注入 $t 等方法到模板
})

// 同步组件库语言
Locale.use(i18n.global.locale.value)
uni.setLocale(i18n.global.locale.value)

// 扩展t函数，支持数组参数插值
// 这是解决小程序和App端不支持插值方式的关键步骤
const originalT = i18n.global.t
i18n.global.t = (key, param1, param2) => {
  const result = originalT(key, param1, param2)
  // 检测是否传入了数组参数，如果是则使用我们的插值方法处理
  if (Array.isArray(param1)) {
    return interpolateTemplate(result, param1)
  }
  return result
}

export default i18n
