import { ref } from "vue"

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
  root.dataset.fontScale = String(rootFontSize.value)
  root.classList.add(ROOT_FONT_SCALE_CLASS)
  document.body?.classList.add(ROOT_FONT_SCALE_CLASS)
}

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

  const previewFontSize = value => {
    const nextSize = Number(value)
    if (!Number.isFinite(nextSize) || nextSize <= 0) return
    rootFontSize.value = nextSize
    syncRootFontSize()
  }

  const revertPreview = originalValue => {
    const size = Number(originalValue)
    if (!Number.isFinite(size) || size <= 0) return
    rootFontSize.value = size
    syncRootFontSize()
  }

  return {
    rootFontSize,
    setRootFontSize,
    previewFontSize,
    revertPreview
  }
}
