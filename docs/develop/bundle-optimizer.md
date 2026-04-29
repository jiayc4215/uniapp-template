# 分包优化

[@uni-ku/bundle-optimizer](https://github.com/uni-ku/bundle-optimizer) 用于优化 uni-app Vue3 项目的微信小程序分包体积。

> **Tip**
>
> 本章节基于 `@uni-ku/bundle-optimizer@2.x` 版本编写，`1.x` 版本请参考 [@uni-ku/bundle-optimizer](https://github.com/uni-ku/bundle-optimizer) 官方文档。

---

## 插件简介

### 为什么需要这个插件？

uni-app Vue3（Vite 构建）官方为了“简化配置”，移除了 Vue2（Webpack 构建）中内置的分包优化逻辑。

这导致所有第三方库、公共组件、工具函数全部被打进 `common/vendor.js`，主包体积很容易超出微信小程序 `2 MB` 限制。

`@uni-ku/bundle-optimizer` 将官方移除的“自动拆包”能力重新补回，并提供：

- **分包优化**：自动将公共依赖抽离到主包，各分包仅保留自身使用代码
- **模块异步跨包调用**：使用 `import()` 语法异步引用模块
- **组件异步跨包引用**：通过 `componentPlaceholder` 配置实现

---

### 功能特性

| 功能             | 说明                                                   |
| ---------------- | ------------------------------------------------------ |
| 分包优化         | 自动将公共依赖抽离到主包，控制主包体积                 |
| 模块异步跨包调用 | 允许使用 `import()` 语法异步引用 JS / TS 模块          |
| 组件异步跨包引用 | 通过 `componentPlaceholder` 配置，实现组件异步跨包引用 |

---

### 适用范围

> ⚠️ 暂时不支持 App 平台

适用于 uni-app CLI 或 HBuilderX 创建的 Vue3 项目。

---

## 快速上手

> 工程已集成 `@uni-ku/bundle-optimizer` 插件，无需额外安装。

### 1. 安装插件

```bash
pnpm add -D @uni-ku/bundle-optimizer
```

工程已安装该依赖，无需重复安装。

---

### 2. 配置 `vite.config.js`

```ts
import { defineConfig } from "vite"
import Uni from "@uni-helper/plugin-uni"
import Optimization from "@uni-ku/bundle-optimizer"
import { isMpWeixin } from "@uni-helper/uni-env"

export default defineConfig({
  plugins: [
    Uni(),
    Optimization({
      enable: isMpWeixin,
      logger: false
    })
  ]
})
```

---

### 3. 开启微信小程序分包优化

在 `manifest.json` 或 `manifest.config.js` 中配置：

```json
{
  "mp-weixin": {
    "optimization": {
      "subPackages": true
    }
  }
}
```

或使用 `@uni-helper/vite-plugin-uni-manifest`：

```js
// manifest.config.js

import { defineManifestConfig } from "@uni-helper/vite-plugin-uni-manifest"

export default defineManifestConfig({
  "mp-weixin": {
    optimization: {
      subPackages: true
    }
  }
})
```

---

## 使用示例

### 页面异步跳转

```js
uni.navigateTo({
  url: "/echarts-modules/index"
})
```

> ⚠️ 注意
>
> 不要使用 `import("./Comp.vue").then(...)` 动态导入 Vue 文件。
>
> 这会导致组件 / 页面空白，并与分包优化逻辑冲突。

---

### 组件异步跨包引用

通过 `componentPlaceholder` 配置实现组件异步跨包引用。

#### 方式一：使用 `<script setup>`（推荐）

```vue
<script setup>
import Chart from "@/echarts-modules/components/chart/chart.vue"

defineOptions({
  componentPlaceholder: {
    Chart: "view"
  }
})
</script>

<template>
  <Chart />
</template>
```

---

#### 方式二：使用选项式 API

```vue
<script>
import Chart from "@/echarts-modules/components/chart/chart.vue"

export default {
  components: {
    Chart
  },

  componentPlaceholder: {
    Chart: "view"
  }
}
</script>

<template>
  <Chart />
</template>
```

> 💡 提示
>
> `componentPlaceholder` 的值通常填写 `"view"` 即可。

---

## 本项目中的使用

### `vite.config.js` 配置

```js
import Optimization from "@uni-ku/bundle-optimizer"
import { isMpWeixin } from "@uni-helper/uni-env"

export default defineConfig({
  plugins: [
    // ...其他插件

    Optimization({
      enable: isMpWeixin,
      logger: false
    })
  ]
})
```

---

### `manifest.config.js` 配置

```js
export default defineManifestConfig({
  "mp-weixin": {
    optimization: {
      subPackages: true
    }
  }
})
```

---

### 分包配置

在 `vite.config.js` 中配置了两个分包：

```js
UniPages({
  exclude: ["**/components/**/**.*"],

  // pages 目录为 src/pages
  // 分包目录不能配置在 pages 目录下
  // 可配置多个分包目录，但不能是 pages 内部目录

  subPackages: ["src/echarts-modules", "src/public-modules"],

  dts: "src/types/pages.d.ts"
})
```

---

## 实际使用示例

### 异步组件跨包引用示例

在 `src/pages/home/index.vue` 中，展示了如何异步引用来自 `echarts-modules` 分包的图表组件：

```vue
<template>
  <view class="bg-fill-bottom text-text-main p-5">
    <!-- 异步 Echarts 入口 -->
    <view class="rounded-3 bg-fill-oppo mb-2 p-3 shadow-sm">
      <view
        class="rounded-2 bg-primary text-text-white hover:bg-primary/80 px-6 py-3 text-center font-medium transition-colors"
        @click="jumpSubEcharts"
      >
        跳转分包
      </view>
    </view>

    <!-- 饼图 -->
    <view class="rounded-3 bg-fill-oppo mb-5 p-5 shadow-sm">
      <view class="text-text-main mb-5 text-center text-base font-medium"> 异步分包Echarts </view>

      <Chart />
    </view>
  </view>
</template>

<script setup>
import Chart from "@/echarts-modules/components/chart/chart.vue"

definePage({
  style: {
    navigationBarTitleText: "发现"
  },

  rules: ["user"]
})

defineOptions({
  componentPlaceholder: {
    Chart: "view"
  }
})

const jumpSubEcharts = () => {
  uni.navigateTo({
    url: "/echarts-modules/index"
  })
}
</script>

<style lang="scss" scoped></style>
```

该示例展示了：

1. 从 `echarts-modules` 分包异步引用图表组件
2. 使用 `componentPlaceholder` 配置异步组件
3. 在模板中正常使用跨包组件

---

## 验证效果

构建项目并使用微信开发者工具查看主包大小：

```bash
pnpm build:mp-weixin
```

使用微信开发者工具的「构建分析」功能对比主包大小，即可看到分包优化带来的体积缩减效果。

---

## 常见问题

### Q：主包体积没有变化？

检查 `manifest.json` 或 `manifest.config.js` 中是否开启：

```json
{
  "mp-weixin": {
    "optimization": {
      "subPackages": true
    }
  }
}
```

---

### Q：组件或页面空白？

可能使用了：

```js
import("./Comp.vue").then(...)
```

请改为使用 `componentPlaceholder` 配置方案。

---

### Q：如何配置异步组件？

使用 `componentPlaceholder` 配置即可，通常填写：

```js
componentPlaceholder: {
  Chart: "view"
}
```

---

### Q：支持 App 平台吗？

暂不支持 App 平台，未来是否支持未知。

---

### Q：为什么推荐使用原生 `import()`？

原因如下：

- 降低学习成本
- 提供更好的 IDE 类型支持
- 更符合 ESM 标准生态

---

## 参考资料

- [@uni-ku/bundle-optimizer 官方文档](https://github.com/uni-ku/bundle-optimizer)
- [微信小程序分包异步加载](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/async.html)
