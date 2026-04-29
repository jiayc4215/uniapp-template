# Uni Helper 插件

Uni Helper 是一个旨在增强 uni-app 系列产品的开发体验为爱发电的非官方组织。作为靠爱发电的非官方项目，Uni Helper 提供了打包工具插件支持、编辑器扩展支持、NPM 包等并尽力维护它们，而他们提供的众多插件组成了本项目的核心插件库。

## Components 组件

大多数组件都是用户界面的可重用部分，如按钮和菜单。

得益于 [@uni-helper/vite-plugin-uni-components](https://github.com/uni-helper/vite-plugin-uni-components)，组件会自动注册到全局。工程扫描以下目录：

- `src/components`
- `src/public-modules/components`
- `src/echarts-modules/components`

:::code-group

```vue [src/pages/index.vue]
<template>
  <view>
    <text>欢迎使用 uniapp-template</text>
    <AppAlert> 这个组件会自动导入 </AppAlert>
  </view>
</template>
```

```vue [src/components/AppAlert.vue]
<template>
  <view>
    <slot />
  </view>
</template>
```

:::

## Pages 页面

通过组合使用组件，我们可以得到展示给用户的页面。

得益于 [@uni-helper/vite-plugin-uni-pages](https://github.com/uni-helper/vite-plugin-uni-pages)，约定式路由（文件路由）的实现轻而易举。`src/pages` 目录下的每个文件都代表着一个路由。要创建新页面，只需要在这个目录里新增 `.vue` 文件。

:::code-group

```vue [src/pages/index.vue]
<template>
  <view>
    <text>欢迎使用 uniapp-template</text>
    <AppAlert> 这个组件会自动导入 </AppAlert>
  </view>
</template>
```

```vue [src/pages/about.vue]
<template>
  <view>
    <text>通过 `/pages/about` 来访问这个页面</text>
  </view>
</template>
```

[@uni-helper/vite-plugin-uni-pages](https://github.com/uni-helper/vite-plugin-uni-pages) 支持排除指定目录的页面。工程在 `vite.config.js` 中排除了组件目录：

```js
// vite.config.js
...
UniPages({
  exclude: ["**/components/**/**.*"],
  subPackages: ["src/echarts-modules", "src/public-modules"],
  dts: "src/types/pages.d.ts",
  /**
   * 排除的页面，相对于 dir 和 subPackages
   * @default []
   */
})
...
```

:::

## manifest 应用配置

`manifest.json` 文件是应用的配置文件，用于指定应用的名称、图标、权限等。

得益于 [@uni-helper/vite-plugin-uni-manifest](https://github.com/uni-helper/vite-plugin-uni-manifest)，应用配置可以维护在 `manifest.config.js` 中，再由工具链生成 `manifest.json`。

```js
// vite.config.js
import Uni from "@uni-helper/plugin-uni"
import UniManifest from "@uni-helper/vite-plugin-uni-manifest"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [UniManifest(), Uni()]
})
```

工程使用 `manifest.config.js`：

```js
// manifest.config.js
import { defineManifestConfig } from "@uni-helper/vite-plugin-uni-manifest"

export default defineManifestConfig({
  name: VITE_APP_TITLE,
  vueVersion: "3"
})
```

更多配置可参考 [@uni-helper/vite-plugin-uni-manifest](https://github.com/uni-helper/vite-plugin-uni-manifest)。
