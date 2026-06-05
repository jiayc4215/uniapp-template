// src/locale/index.ts
import { createI18n } from "vue-i18n"
import zhCN from "./zh-CN.json"
import enUS from "./en-US.json"
import { Locale } from "@wot-ui/ui"
import WotEnUS from "@wot-ui/ui/locale/lang/en-US"

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

export default i18n
