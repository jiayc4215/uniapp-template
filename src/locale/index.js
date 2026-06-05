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

// 这是解决小程序和App端不支持插值方式的关键步骤
const originalT = i18n.global.t

// 扩展t函数，支持数组参数插值
i18n.global.t = (key, ...args) => {
  // 处理对象参数场景: t(key, {key1: value1, key2: value2})
  if (args.length === 1 && typeof args[0] === "object" && !Array.isArray(args[0])) {
    const result = originalT(key, ...args)
    return result
  }

  // 处理数组参数场景: t(key, [arg1, arg2])
  if (args.length === 1 && Array.isArray(args[0])) {
    const result = originalT(key, args[0])
    return interpolateTemplate(result, args[0])
  }

  // 处理可变参数场景: t(key, arg1, arg2, ...)
  if (args.length > 1 && args.every(arg => typeof arg !== "object")) {
    return interpolateTemplate(originalT(key, args), args)
  }

  // 处理默认场景: t(key) 或 t(key, defaultMessage) 或 t(key, plural) 等
  const result = originalT(key, ...args)

  return result
}

export default i18n
