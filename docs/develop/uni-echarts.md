# uni-echarts

本项目已经集成 [uni-echarts](https://github.com/xiaohe0601/uni-echarts) 和 `echarts`，用于在 uni-app Vue 3 项目中渲染图表。当前模板里的演示页面放在 `src/echarts-modules` 分包中，避免图表相关代码长期挤在主包里。

## 当前依赖

根目录 `package.json` 已包含依赖，无需重复安装：

```json
{
  "dependencies": {
    "echarts": "^6.0.0",
    "uni-echarts": "^2.5.1"
  }
}
```

如果从空项目接入，可以执行：

```bash
pnpm add echarts uni-echarts
```

## Vite 配置

模板已在 `vite.config.js` 中启用 `uni-echarts` 插件和组件解析器：

```js
import { UniEcharts } from "uni-echarts/vite"
import { UniEchartsResolver } from "uni-echarts/resolver"
import Components from "@uni-helper/vite-plugin-uni-components"

export default defineConfig({
  plugins: [
    UniEcharts(),
    Components({
      resolvers: [UniEchartsResolver()],
      dirs: ["src/components", "src/public-modules/components", "src/echarts-modules/components"],
      deep: true,
      dts: "src/types/components.d.ts",
      directoryAsNamespace: false
    })
  ]
})
```

因此页面里可以直接使用 `<uni-echarts />`，无需手动引入组件。

## 分包配置

图表示例位于 `src/echarts-modules`：

```text
src/
├── echarts-modules/
│   ├── index.vue
│   └── components/
│       └── chart/
│           └── chart.vue
├── pages/
└── public-modules/
```

`vite.config.js` 通过 `@uni-helper/vite-plugin-uni-pages` 注册分包：

```js
UniPages({
  exclude: ["**/components/**/**.*"],
  subPackages: ["src/echarts-modules", "src/public-modules"],
  dts: "src/types/pages.d.ts"
})
```

`manifest.config.js` 已为微信小程序开启分包优化：

```js
export default defineManifestConfig({
  "mp-weixin": {
    optimization: {
      subPackages: true
    }
  }
})
```

同时 `@uni-ku/bundle-optimizer` 只在微信小程序端启用：

```js
import Optimization from "@uni-ku/bundle-optimizer"
import { isMpWeixin } from "@uni-helper/uni-env"

Optimization({
  enable: isMpWeixin,
  logger: false
})
```

## 页面示例

分包入口 `src/echarts-modules/index.vue` 引用图表组件：

```vue
<template>
  <view class="bg-fill-bottom text-text-main p-5">
    <view class="rounded-3 bg-fill-oppo mb-5 p-5 shadow-sm">
      <view class="text-text-main mb-5 text-center text-base font-medium"> 饼图示例 </view>
      <Chart />
    </view>
  </view>
</template>

<script setup>
import Chart from "./components/chart/chart.vue"
</script>
```

图表组件按需注册 ECharts 模块：

```vue
<template>
  <uni-echarts custom-class="h-[300px]" :option="option" />
</template>

<script setup>
import { PieChart } from "echarts/charts"
import { DatasetComponent, LegendComponent, TooltipComponent } from "echarts/components"
import * as echarts from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"

echarts.use([LegendComponent, TooltipComponent, DatasetComponent, PieChart, CanvasRenderer])

const option = ref({
  legend: {
    top: 10,
    left: "center"
  },
  tooltip: {
    trigger: "item",
    textStyle: {
      // #ifdef MP-WEIXIN
      // 临时解决微信小程序 tooltip 文字阴影问题
      textShadowBlur: 1
      // #endif
    }
  },
  series: [
    {
      type: "pie",
      radius: ["30%", "52%"],
      label: {
        show: false,
        position: "center"
      },
      itemStyle: {
        borderWidth: 2,
        borderColor: "var(--wot-filled-oppo)",
        borderRadius: 10
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20
        }
      }
    }
  ],
  dataset: {
    dimensions: ["来源", "数量"],
    source: [
      ["Search Engine", 1048],
      ["Direct", 735],
      ["Email", 580],
      ["Union Ads", 484],
      ["Video Ads", 300]
    ]
  }
})
</script>
```

## 使用建议

- 优先使用 `echarts/core` 按需导入图表、组件和渲染器，避免引入完整包。
- 图表容器必须有明确高度，模板中推荐通过 `custom-class` 传入 Tailwind / UnoCSS 类名，例如 `h-[300px]`。
- 小程序端 tooltip 样式可能和 H5 不完全一致，可以用条件编译做端差异处理。
- 图表页面建议放在分包中。当前模板已把演示放在 `src/echarts-modules`，微信小程序构建时配合 `@uni-ku/bundle-optimizer` 控制主包体积。

## 验证

开发调试：

```bash
pnpm dev:h5
pnpm dev:mp-weixin
```

微信小程序构建：

```bash
pnpm build:mp-weixin
```

构建后可在微信开发者工具的「构建分析」中查看主包和 `echarts-modules` 分包体积。

## 移除 ECharts

如果项目不再需要图表能力，需要同步移除依赖、Vite 配置和分包目录：

```bash
pnpm remove echarts uni-echarts
```

同时从 `vite.config.js` 中移除：

- `UniEcharts` 插件
- `UniEchartsResolver`
- `src/echarts-modules/components` 组件扫描目录
- `UniPages.subPackages` 中的 `src/echarts-modules`

最后删除 `src/echarts-modules` 目录即可。

## 参考

- [uni-echarts 官方文档](https://uni-echarts.xiaohe.ink)
- [Apache ECharts](https://echarts.apache.org/zh/index.html)
- [@uni-ku/bundle-optimizer](https://github.com/uni-ku/bundle-optimizer)
