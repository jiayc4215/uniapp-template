import { ref } from "vue"

// 16为默认根节点字体大小，在vite.config.js中配置
const DEFAULT_ROOT_FONT_SIZE = 16
const ROOT_FONT_SIZE_STORAGE_KEY = "rootFontSize"
const ROOT_FONT_SCALE_CLASS = "wot-font-scale-vars"

const rootFontSize = ref(DEFAULT_ROOT_FONT_SIZE)
let initialized = false

function syncRootFontSize() {
  if (typeof document === "undefined") {
    return
  }

  const root = document.documentElement
  root.style.fontSize = `${rootFontSize.value}px`
  root.classList.add(ROOT_FONT_SCALE_CLASS)
  document.body?.classList.add(ROOT_FONT_SCALE_CLASS)
}

// 初始化根节点字体大小，从storage中获取，如果没有则使用默认值
export function initRootFontSize() {
  if (initialized) {
    syncRootFontSize()
    return
  }

  if (typeof uni === "undefined") {
    syncRootFontSize()
    return
  }

  const cachedSize = Number(uni.getStorageSync(ROOT_FONT_SIZE_STORAGE_KEY))
  if (Number.isFinite(cachedSize) && cachedSize > 0) {
    rootFontSize.value = cachedSize
  }

  initialized = true
  syncRootFontSize()
}

// 设置根节点字体大小
export function useFont() {
  initRootFontSize()

  const setRootFontSize = value => {
    const nextSize = Number(value)
    if (!Number.isFinite(nextSize) || nextSize <= 0) {
      return
    }

    rootFontSize.value = nextSize
    uni.setStorageSync(ROOT_FONT_SIZE_STORAGE_KEY, nextSize)
    syncRootFontSize()
  }

  return {
    rootFontSize,
    setRootFontSize
  }
}
