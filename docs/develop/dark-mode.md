# 暗黑模式

暗黑模式由 uni-app 平台主题变量、Wot UI `ConfigProvider` 和业务样式语义色三部分组成。

## 接入方式

当前暗黑模式由三层共同完成：

- uni-app 平台配置：`manifest.config.js` 开启 H5、微信小程序的 `darkmode`，并指定 `src/theme.json` 作为主题变量文件。
- 页面原生配置：`pages.config.js` 的 `globalStyle` 和 `tabBar` 通过 `@变量名` 读取 `src/theme.json`。
- Wot UI 和业务样式：`useManualTheme` 管理当前主题，`wd-config-provider` 通过 `theme` 和 `theme-vars` 下发给组件，业务页面优先使用 `src/main.css` 映射出的 Tailwind 语义色。

相关文件：

- `manifest.config.js`
- `pages.config.js`
- `src/theme.json`
- `src/App.ku.vue`
- `src/App.vue`
- `src/composables/useManualTheme.js`
- `src/store/manualThemeStore.js`
- `src/composables/theme.js`
- `src/main.css`

## uni-app 平台配置

工程使用 `@uni-helper/vite-plugin-uni-manifest`，配置源文件是 `manifest.config.js`。

```js
// manifest.config.js
export default defineManifestConfig({
  h5: {
    darkmode: true,
    themeLocation: "theme.json"
  },
  "mp-weixin": {
    darkmode: true,
    themeLocation: "theme.json"
  }
})
```

主题变量文件位于 `src/theme.json`。构建时由 uni-app 读取，供 `pages.config.js` 中的 `@变量名` 使用。

```json
{
  "light": {
    "bgColor": "#F8F8F8",
    "bgColorBottom": "#F8F8F8",
    "bgColorTop": "#F8F8F8",
    "bgTxtStyle": "dark",
    "navBgColor": "#FFF",
    "navTxtStyle": "black",
    "tabBgColor": "#ffffff",
    "tabBorderStyle": "black",
    "tabColor": "#bfbfbf",
    "tabSelectedColor": "#0165FF"
  },
  "dark": {
    "bgColor": "#000",
    "bgColorBottom": "#000",
    "bgColorTop": "#000",
    "bgTxtStyle": "light",
    "navBgColor": "#000000",
    "navTxtStyle": "white",
    "tabBgColor": "#1a1a1a",
    "tabBorderStyle": "white",
    "tabColor": "#bfbfbf",
    "tabSelectedColor": "#0165FF"
  }
}
```

`pages.config.js` 中已经引用这些变量：

```js
export default defineUniPages({
  globalStyle: {
    navigationBarBackgroundColor: "@navBgColor",
    navigationBarTextStyle: "@navTxtStyle",
    backgroundColor: "@bgColor",
    backgroundTextStyle: "@bgTxtStyle",
    backgroundColorTop: "@bgColorTop",
    backgroundColorBottom: "@bgColorBottom"
  },
  tabBar
})
```

`src/tabbar/config.js` 里还会使用 `@tabColor`、`@tabSelectedColor`、`@tabBgColor`、`@tabBorderStyle` 生成 tabBar 配置。

## 主题状态管理

`useManualTheme` 内部使用 Pinia store 管理主题状态：

- `theme`：当前主题，值为 `"light"` 或 `"dark"`。
- `isDark`：是否为暗黑模式。
- `followSystem`：是否跟随系统。
- `currentThemeColor`：当前主题色配置。
- `themeVars`：传给 Wot UI `wd-config-provider` 的主题变量。
- `toggleTheme(mode, isFollw)`：切换主题；不传 `mode` 时在 light/dark 间切换。
- `setFollowSystem(true)`：重新跟随系统主题。
- `selectThemeColor(option)`：切换主题色。

主题初始化时会读取系统主题：

```js
// 微信小程序优先使用 getAppBaseInfo
const appBaseInfo = uni.getAppBaseInfo()

// 其他平台使用 getSystemInfoSync
const systemInfo = uni.getSystemInfoSync()
```

并通过 `uni.onThemeChange` 监听系统主题变化。切换主题后，`manualThemeStore` 会调用 `uni.setNavigationBarColor` 同步导航栏颜色。

### 页面使用示例

```vue
<script setup>
import { useManualTheme } from "@/composables/useManualTheme"

const {
  theme,
  toggleTheme,
  currentThemeColor,
  showThemeColorSheet,
  themeColorOptions,
  openThemeColorPicker,
  closeThemeColorPicker,
  selectThemeColor,
  setFollowSystem
} = useManualTheme()

const isDark = computed({
  get() {
    return theme.value === "dark"
  },
  set() {
    toggleTheme()
  }
})
</script>

<template>
  <wd-cell-group border>
    <wd-cell title="暗黑模式">
      <wd-switch v-model="isDark" size="18px" />
    </wd-cell>
    <wd-cell title="跟随系统">
      <wd-button size="small" @click="setFollowSystem(true)">跟随系统</wd-button>
    </wd-cell>
    <wd-cell title="选择主题色" is-link @click="openThemeColorPicker">
      <view class="flex items-center justify-end gap-2">
        <view class="h-4 w-4 rounded-full" :style="{ backgroundColor: currentThemeColor.primary }" />
        <text>{{ currentThemeColor.name }}</text>
      </view>
    </wd-cell>
  </wd-cell-group>

  <wd-action-sheet v-model="showThemeColorSheet" title="选择主题色" @cancel="closeThemeColorPicker">
    <view class="px-4 pb-4">
      <view v-for="option in themeColorOptions" :key="option.value" @click="selectThemeColor(option)">
        <text>{{ option.name }}</text>
      </view>
    </view>
  </wd-action-sheet>
</template>
```

## Wot UI 适配

Wot UI 的深色模式由 `wd-config-provider` 的 `theme` 属性控制，主题色通过 `theme-vars` 覆盖 Wot UI 变量。

完整应用包裹示例参考 `src/App.ku.vue`：

```vue
<script setup>
import Tabbar from "@/tabbar/index.vue"
import { useManualTheme } from "./composables/useManualTheme"

const { themeVars, theme } = useManualTheme()
</script>

<template>
  <wd-config-provider :theme-vars="themeVars" :theme="theme" :custom-class="`page-wraper ${theme}`">
    <KuRootView />
    <Tabbar />
  </wd-config-provider>
</template>
```

注意：

- `theme="dark"` 只负责让 Wot UI 组件切换到深色变量。
- 自己写的 `view`、`text`、业务容器不会自动变暗，需要使用 Wot 变量或项目 Tailwind 语义类。
- `src/App.vue` 中的 `@use "@wot-ui/ui/styles/theme/index.scss" as *;` 需要保留，否则 Wot 的主题变量不完整。

## Tailwind v4 样式写法

工程使用 Tailwind v4，并在 `src/main.css` 里把 Wot 变量映射成语义色：

```css
@theme inline {
  --color-primary: var(--wot-primary-6);
  --color-text-main: var(--wot-text-main);
  --color-text-secondary: var(--wot-text-secondary);
  --color-fill-content: var(--wot-filled-content);
  --color-fill-bottom: var(--wot-filled-bottom);
  --color-fill-oppo: var(--wot-filled-oppo);
  --color-line-main: var(--wot-border-main);
  --color-line-light: var(--wot-border-light);
}
```

业务页面优先使用这些语义类：

```html
<view class="bg-fill-bottom text-text-main">
  <view class="bg-fill-oppo border-line-main border">
    <text class="text-text-secondary">内容</text>
  </view>
</view>
```

业务页面避免硬编码两套颜色：

```html
<!-- 避免 -->
<view class="bg-white text-black dark:bg-black dark:text-white"></view>

<!-- 使用语义色 -->
<view class="bg-fill-bottom text-text-main"></view>
```

如果某个颜色没有语义类，可以直接使用 Wot CSS 变量：

```html
<view class="bg-[var(--wot-filled-content)] text-[var(--wot-text-main)]"></view>
```

## CSS 媒体查询

业务样式优先走 `theme`、Wot 变量和 Tailwind 语义色。只有在处理无法被 `wd-config-provider` 覆盖的原生样式，或确实需要跟随系统媒体查询时，再使用 `prefers-color-scheme`：

```css
.some-background {
  background: #ffffff;
}

@media (prefers-color-scheme: dark) {
  .some-background {
    background: #1b1b1b;
  }
}
```

## 新增页面检查清单

新增页面时建议检查：

- 页面根容器是否使用 `bg-fill-bottom text-text-main` 等语义类。
- 卡片、分割线、弱文本是否使用 `bg-fill-oppo`、`border-line-main`、`text-text-secondary` 等语义类。
- Wot UI 组件是否处在 `wd-config-provider` 包裹范围内。
- 主题切换控件是否调用 `toggleTheme()` 或 `setFollowSystem(true)`。
- 主题色选择是否使用 `themeColorOptions` 和 `selectThemeColor(option)`。

## 移除暗黑模式

如果项目确定不需要暗黑模式，需要同步处理以下位置，不能只删除一个文件：

1. 在 `manifest.config.js` 中移除 H5 和微信小程序的 `darkmode`、`themeLocation`。
2. 在 `pages.config.js` 和 `src/tabbar/config.js` 中把 `@navBgColor`、`@bgColor`、`@tabBgColor` 等变量替换为固定颜色。
3. 删除或停用 `src/theme.json`。
4. 从应用入口中移除 `useManualTheme`、`wd-config-provider` 的 `theme` 绑定，以及依赖 `themeVars` 的逻辑。
5. 清理页面中的主题切换、主题色选择 UI。
6. 如果不再使用 Wot 主题变量，重新确认 `src/App.vue`、`src/main.css` 中的变量映射是否仍然需要。

示例：

```js
// manifest.config.js
export default defineManifestConfig({
  h5: {
    // darkmode: true,
    // themeLocation: "theme.json"
  },
  "mp-weixin": {
    // darkmode: true,
    // themeLocation: "theme.json"
  }
})
```

```js
// pages.config.js
export default defineUniPages({
  globalStyle: {
    navigationBarBackgroundColor: "#ffffff",
    navigationBarTextStyle: "black",
    backgroundColor: "#f8f8f8"
  }
})
```

## 参考链接

- [uni-app 暗黑模式适配指南](https://uniapp.dcloud.net.cn/tutorial/darkmode.html)
- [Wot UI ConfigProvider](https://wot-ui.cn/component/config-provider.html)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
