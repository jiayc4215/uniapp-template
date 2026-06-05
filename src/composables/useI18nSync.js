// src/hooks/useI18nSync.ts
import { computed, onBeforeMount } from "vue"
import { Locale } from "@wot-ui/ui"
import i18n from "../locale"

const SUPPORTED_LOCALES = ["zh-CN", "en-US"]

function setLocale(locale, syncComponentLib = true) {
  if (!SUPPORTED_LOCALES.includes(locale)) {
    console.warn(`不支持的语言: ${locale}，将使用默认语言 zh-CN`)
    locale = "zh-CN"
  }
  uni.setLocale(locale)
  i18n.global.locale.value = locale
  uni.setStorageSync("currentLang", locale)
  if (syncComponentLib) {
    Locale.use(locale)
  }
  return locale
}

function initLocale(defaultLocale, syncComponentLib) {
  const storedLocale = uni.getStorageSync("currentLang") || defaultLocale
  setLocale(storedLocale, syncComponentLib)
}

/**
 * 国际化同步hook
 * @param {Object} options 配置选项
 * @param {boolean} options.syncComponentLib - 是否同步组件库语言
 * @param {string} options.defaultLocale - 默认语言
 * @returns {Object} 国际化相关方法和状态
 */
export function useI18nSync(options) {
  const { syncComponentLib = true, defaultLocale = "zh-CN" } = options || {}
  const currentLang = computed(() => i18n.global.locale.value)
  onBeforeMount(() => {
    initLocale(defaultLocale, syncComponentLib)
  })

  return {
    currentLang,
    setLocale: locale => setLocale(locale, syncComponentLib),
    supportedLocales: SUPPORTED_LOCALES
  }
}
