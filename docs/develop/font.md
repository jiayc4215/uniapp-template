# uniapp 动态字体大小

### 一、当前项目方案

项目已经内置动态字体大小能力，主要用于在 **标准版** 和 **关怀版** 之间切换字号。

当前实现不是单独提供一个滑块配置页，而是在 `我的 -> 切换版本` 中弹出 `version-switch-popup`，由用户选择：

- 标准版：`16px`
- 关怀版：`20px`

整体链路如下：

1. `vite.config.js` 通过 `PageRootInsertElement` 给页面自动插入 `page-meta`。
2. `src/main.js` 挂载 `$getRootFontSize()`，供 `page-meta` 读取当前根字号。
3. `src/composables/useFont.js` 维护根字号状态，并持久化到本地缓存。
4. `src/components/version-switch-popup/version-switch-popup.vue` 提供标准版/关怀版切换弹窗。
5. `src/pages/admin-profile/index.vue` 在「我的」页面触发切换。

### 二、核心原理

微信小程序从基础库 `2.9.0` 开始支持 `page-meta` 组件。项目给每个页面注入：

```vue
<page-meta :root-font-size="$getRootFontSize()"></page-meta>
```

页面中的 `rem` 会跟随 `root-font-size` 变化，因此只要把需要动态缩放的 `px` / `rpx` 转成 `rem`，就可以通过修改根字号完成整体字体缩放。

### 三、相关文件

#### 1. `scripts/pxtorem-plugin.js`

项目封装了一个 Vite 插件，用 `postcss-pxtorem` 把指定属性转成 `rem`：

```js
import pxtorem from "postcss-pxtorem"

export default function pxtoremPlugin(options = {}) {
  const defaultOptions = {
    rootValue: 16,
    unitPrecision: 5,
    propList: ["font", "font-size", "line-height", "letter-spacing", "--wot-n-*"],
    selectorBlackList: [],
    replace: true,
    mediaQuery: false,
    minPixelValue: 0,
    exclude: null,
    unit: "px"
  }

  const mergedOptions = { ...defaultOptions, ...options }

  return {
    name: "vite-pxtorem-plugin",
    enforce: "post",
    config: () => ({
      css: {
        postcss: {
          plugins: [pxtorem(mergedOptions)]
        }
      }
    })
  }
}
```

这里的 `propList` 只处理字体相关属性和 Wot UI 的部分字号变量，避免把布局尺寸也跟着关怀版放大。

#### 2. `scripts/page-root-insert-element.js`

该插件负责给页面组件自动插入 `page-meta`：

```js
import { parse } from "@vue/compiler-dom"

export default function pageRootinsertElementPlugin(content = "") {
  return {
    name: "vite-pageRootInsertElement-plugin",
    enforce: "pre",

    transform(code, id) {
      if (id.includes("node_modules")) return

      const pathRegex = /(pages|[\w-]+-modules)\//
      if (!pathRegex.test(id)) return

      if (id.includes("components/")) return
      if (!id.endsWith(".vue")) return

      try {
        const parsed = parse(code, { comments: true })
        const templateNode = parsed.children.find(node => node.tag === "template")
        if (!templateNode) return

        const templateContent = code.slice(templateNode.loc.start.offset, templateNode.loc.end.offset)
        const insertPosition = templateContent.indexOf(">") + 1
        const beforeInsert = templateContent.slice(0, insertPosition)
        const afterInsert = templateContent.slice(insertPosition)

        return code.replace(templateContent, beforeInsert + content + afterInsert)
      } catch (e) {
        console.warn("page-root-insert-element插件处理失败:", e.message)
        return code
      }
    }
  }
}
```

注意：当前匹配范围包含 `src/pages` 和 `src/*-modules` 下的页面，排除了组件目录。

#### 3. `src/composables/useFont.js`

字体大小状态统一由 `useFont` 管理：

```js
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

  return {
    rootFontSize,
    setRootFontSize
  }
}
```

`wot-font-scale-vars` 会同步加到根节点和 `body`，弹窗内也通过 `custom-class` / `wd-config-provider` 使用同一个类，保证 Wot UI 组件的字体变量能跟随当前字号。

### 四、Vite 配置

当前项目在 `vite.config.js` 中同时处理两类转换：

```js
import postcssRemToResponsivePixel from "postcss-rem-to-responsive-pixel"
import pxtoremPlugin from "./scripts/pxtorem-plugin"
import PageRootInsertElement from "./scripts/page-root-insert-element"

const isH5 = process.env.UNI_PLATFORM === "h5"
const isApp = process.env.UNI_PLATFORM === "app"
const WeappTailwindcssDisabled = isH5 || isApp

export default defineConfig(() => ({
  plugins: [
    // 处理 text-[22rpx] 这类 rpx 字号
    pxtoremPlugin({
      rootValue: 32,
      unit: "rpx"
    }),

    // 处理 Wot UI 等依赖里的 px 字号
    pxtoremPlugin({
      rootValue: 16,
      unit: "px"
    }),

    UnifiedViteWeappTailwindcssPlugin({
      rem2rpx: false,
      disabled: WeappTailwindcssDisabled,
      cssEntries: [path.resolve(__dirname, "src/main.css")]
    }),

    PageRootInsertElement(`\n  <page-meta :root-font-size="$getRootFontSize()"></page-meta>`)
  ],

  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        postcssLogical(),
        postcssOKLabFunction(),
        postcssRemToResponsivePixel({
          rootValue: 32,
          propList: ["*", "!font", "!font-size", "!line-height", "!letter-spacing"],
          transformUnit: "rpx",
          disabled: WeappTailwindcssDisabled
        })
      ]
    }
  }
}))
```

这里需要注意执行目的：

- `pxtoremPlugin`：把字体相关的 `px` / `rpx` 转成 `rem`，让字体能随根字号变化。
- `postcss-rem-to-responsive-pixel`：把 Tailwind 生成的布局类从 `rem` 转回 `rpx`，但排除字体相关属性。
- `UnifiedViteWeappTailwindcssPlugin.rem2rpx`：当前关闭，由外置 PostCSS 插件接管转换规则。

### 五、应用初始化

`src/main.js` 中初始化字体，并挂载全局方法：

```js
import { initRootFontSize, useFont } from "./composables/useFont"

export function createApp() {
  const app = createSSRApp(App)

  initRootFontSize()

  const { rootFontSize } = useFont()
  app.config.globalProperties.$getRootFontSize = () => `${rootFontSize.value}px`

  return {
    app
  }
}
```

### 六、页面切换入口

当前切换入口在 `src/pages/admin-profile/index.vue`：

```vue
<wd-cell title="切换版本" center size="large" border is-link @click="versionPopupVisible = true">
  <text class="text-text-auxiliary text-[24rpx]">{{ versionLabel }}</text>
</wd-cell>

<version-switch-popup v-model="versionPopupVisible" :value="rootFontSize" @confirm="handleVersionConfirm" />
```

```js
const { rootFontSize, setRootFontSize } = useFont()

const versionMap = {
  16: "标准版",
  20: "关怀版"
}

const versionLabel = computed(() => versionMap[rootFontSize.value] || `${rootFontSize.value}px`)

const handleVersionConfirm = value => {
  setRootFontSize(value)
  uni.toast({
    title: `已切换为${versionMap[value] || `${value}px`}`,
    icon: "none"
  })
}
```

弹窗默认选项定义在 `src/components/version-switch-popup/version-switch-popup.vue`：

```js
options: {
  type: Array,
  default: () => [
    {
      label: "标准版",
      description: "常规字体大小，适合日常使用",
      value: 16,
      iconText: "A"
    },
    {
      label: "关怀版",
      description: "大字体设计，视觉更清晰",
      value: 20,
      iconText: "Aa"
    }
  ]
}
```

### 七、扩展建议

如果后续要增加更多字号档位，只需要同步调整两处：

1. `version-switch-popup.vue` 的 `options`。
2. 使用页面里的 `versionMap` 展示文案。

如果某个页面不需要动态字号，可以在 `PageRootInsertElement` 的匹配规则中排除该页面，或者在具体样式中避免使用会被转成 `rem` 的字体属性。
