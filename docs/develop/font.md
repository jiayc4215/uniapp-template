# uniapp动态设置应用字体大小

### 一、背景

最近在上线的 **微信小程序** 中遇到了一个 **需求** ，由于目标用户普遍年龄比较大，可能视力存在一些老花现象，所以要求对应用的字体调大一些，下图是产品反馈的需求：

项目是通过 `cli` 方式创建的 `vue3+vite` 的 `uniapp` 项目，为了项目能快速稳定地修改上线，下文通过编写两个 `vite` 插件 **快速实现调整应用字体大小** 的需求。

### 二、实现方法说明

从微信基础库 `2.9.0` 开始，新增了page-meta组件，它是一个特殊的标签，有点类似 `html` 里的 `header` 标签。在这个标签上可以设置一个 `root-font-size` 属性，以实现动态切换字体大小的效果。

了解了如何实现，下面就可以开始制定 **实现方法** 了：

> 1.由于相对的是 `rem` 单位，所以需要把页面当中的 `rpx` 和 `px` 的像素单位统一转换成 `rem` 。2.在 `page-meta` 组件上绑定 **全局响应式字体大小变量** ，并通过 `vite` 插件自动插入到每个页面顶部，避免手动一个个页面写入，提升开发效率。3.新增字体大小配置页面，动态调整 `page-meta` 标签的 `root-font-size` 属性字体大小。

### 三、开发两个vite插件开发

#### 1.px和rpx转换为rem

转换方法需要依赖 `postcss-pxtorem` 插件，先运行安装开发依赖

```csharp
pnpm add postcss-pxtorem -D
```

**pxtorem-plugin.js**

```cobol
import pxtorem from 'postcss-pxtorem';

export default function pxtoremPlugin(options = {}) {
  // 自定义默认配置
  const defaultOptions = {
    rootValue: 16, // 根元素字体大小，1rem = 16px
    unitPrecision: 5, // 转换精度
    propList: ["font", "font-size", "line-height", "letter-spacing"], // 需要转换的属性列表，*表示所有属性
    selectorBlackList: [], // 忽略的选择器
    replace: true,  // 是否替换
    mediaQuery: false,  // 是否转换媒体查询
    minPixelValue: 0, // 最小转换像素值
    exclude: null,  // 排除的文件
    unit: "px", // 转换单位
  };

  // 合并参数配置
  const mergedOptions = { ...defaultOptions, ...options };

  return {
    name: 'vite-pxtorem-plugin',
    enforce: 'post',

    // 配置PostCSS
    config: () => {
      return {
        css: {
          postcss: {
            plugins: [
              pxtorem(mergedOptions)
            ]
          }
        }
      };
    }
  };
}
```

#### 2.自动向页面顶部插入page-meta标签

**page-root-insert-element.js**

```cobol
import { parse } from '@vue/compiler-dom'

export default function pageRootinsertElementPlugin(content = '') {
  return {
    name: 'vite-pageRootInsertElement-plugin',
    enforce: 'pre',

    transform(code, id) {
      // 排除node_modules
      if (id.includes('node_modules')) return

      // 排除不是pages目录下的文件
      if (!/\/pages\//.test(id)) return

      // 排除components目录下的文件
      if (id.includes('components/')) return

      // 排除不是.vue结尾的文件
      if (!id.endsWith('.vue')) return

      console.log('id', id)

      try {
        // 解析文.vue文件内容为虚拟节点: code为.vue文件内容
        const parsed = parse(code, {
          comments: true,
          onError: (err) => {
            console.log('解析错误id', id)
            console.warn('code解析错误:', err.message)
          }
        })
        // 查找template虚拟节点，即虚拟dom
        const templateNode = parsed.children.find(node => node.tag === 'template')
        if (!templateNode) return

        // 获取template内容，即<template>...省略中间内容</template>模板字符串
        const templateContent = code.slice(templateNode.loc.start.offset, templateNode.loc.end.offset)

        /** 对template标签下的内容进行头尾拆分，方便在头部插入page-meta标签 */

        // 1.获取第一个template标签的>位置索引
        const insertPosition = templateContent.indexOf('>') + 1

        // 2.获取template标签的头部：<template>
        const beforeInsert = templateContent.slice(0, insertPosition)

        // 3.获取template标签的尾部
        const afterInsert = templateContent.slice(insertPosition)

        // 4.头部插入page-meta，拼接成新的template内容
        const newTemplateContent = beforeInsert + content + afterInsert

        // 替换原template内容
        const newCode = code.replace(templateContent, newTemplateContent)

        return newCode
      } catch (e) {
        console.warn('page-root-insert-element插件处理失败:', e.message)
        return code
      }
    }
  }
}
```

以上只是一个示例，可以根据自身 **项目结构** 修改需要向哪些文件 **插入内容** 或者排除哪些文件。

#### 3.调整全局字体大小页面

```cobol
<template>
  <view class="page">
    <view class="slider-box">
      <view class="label-box">
        <text class="label" v-for="item in fontSizeList" :key="item.label">{{ item.label }}</text>
      </view>
      <uv-slider :value="value" :step="step" :min="0" :max="100"
        @change="onChange"
      ></uv-slider>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue"
import { useFont } from "@/composables/useFont"

const { rootFontSize, setRootFontSize } = useFont()

const fontSizeList = [
  { label:  '超小号', fontSize: 10 },
  { label:  '小号', fontSize: 12 },
  { label:  '标准', fontSize: 16 },
  { label:  '大号', fontSize: 20 },
  { label:  '超大号', fontSize: 26 },
]

const step = 100 / (fontSizeList.length - 1)

const defaultIndex = fontSizeList.findIndex(item => item.fontSize === rootFontSize.value)

// 计算当前字体大小所在滑块值
const value = ref(defaultIndex >= 0 ? step * defaultIndex : step * 2 )

const onChange = val => {
  console.log('value', val)
  // 计算当前是fontSizeList的哪个索引
  const index = val / step
  setRootFontSize(fontSizeList[index].fontSize)
}
</script>

<style scoped lang="scss">
.logo {
  width: 200rpx;
  height: 200rpx;
}
.slider-box {
  padding: 20rpx;
  .label-box {
    display: flex;
    justify-content: space-between;
    .label {
      text-align: center;
    }
  }
}
</style>
```

### 四、vite插件用法

#### 1. vite.config.js

```js
import { defineConfig } from "vite"
import Uni from "@uni-helper/plugin-uni"
import pxtoremPlugin from "./scripts/pxtorem-plugin"
import PageRootInsertElement from "./scripts/page-root-insert-element"

export default defineConfig(() => ({
  plugins: [
    Uni(),
    // 转换 rpx 为 rem
    pxtoremPlugin({
      rootValue: 32, // 16px=32rpx默认根节点字体大小
      unit: "rpx"
      // 转换字体大小rpx为rem
      // propList: ['font-size']
    }),
    // 转换 px 为 rem
    pxtoremPlugin({
      rootValue: 16,
      unit: "px"
      // 转换字体大小rpx为rem
      // propList: ['font-size']
    }),
    PageRootInsertElement(`\n  <page-meta :root-font-size="$getRootFontSize()"></page-meta>`)
  ]
}))
```

项目当中 `rpx` 和 `px` 混用时，需要依次把这两个像素单位都转换成 `rem` ，以保持调整字体大小后页面的一致性； 接着向每个页面顶部插入 `\n <page-meta :root-font-size="$getRootFontSize()"></page-meta>` ，其中 `$getRootFontSize()` 为全局方法，获取动态跟字体大小，如下：

#### 2.挂载获取字体大小全局方法

```cobol
// src/main.js
import { initRootFontSize, useFont } from "./composables/useFont"

export function createApp() {
  initRootFontSize()
  const { rootFontSize } = useFont()
  app.config.globalProperties.$getRootFontSize = () => `${rootFontSize.value}px`
  return {
    app
  }
}
```

#### 3. `src/composables/useFont.js`

```cobol
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

### weapp-tailwindcss .rem 转 rpx (或 px)

> 此为可选步骤，根据你自己的需求进行配置。通常此配置的值，是由你拿到的设计稿尺寸决定的。

#### 为什么要配置 rem 转 rpx 呢？

这是因为 `tailwindcss` 里面工具类的长度单位，默认都是 `rem` ，比如:

```cobol
.m-4 {
  margin: 1rem;
}
.h-4 {
  height: 1rem;
}
/*......*/
```

`rem` 这个单位在 `h5` 环境下自适应良好，但小程序环境下，我们大部分都是使用 `rpx` 这个 `wxss` 单位来进行自适应，所以就需要把默认的 `rem` 单位转化成 `rpx` 。

#### 插件内置 rem 转 rpx 功能 (推荐)

在 `^3.0.0` 版本中，所有插件都内置了 `rem2rpx` 参数，默认不开启，要启用它只需将它设置成 `true` 即可

```cobol
// vite.config.js
import { UnifiedViteWeappTailwindcssPlugin } from 'weapp-tailwindcss/vite'
UnifiedViteWeappTailwindcssPlugin({
  // ...other-options
  rem2rpx: true
})
// webpack
const { UnifiedWebpackPluginV5 } = require('weapp-tailwindcss/webpack')
new UnifiedWebpackPluginV5({
  // ...other-options
  rem2rpx: true
})
```

设置为 `true` 相当于 `rem2rpx` 传入下方这样一个配置对象:

```cobol
{
  // 32 意味着 1rem = 16px = 32rpx
  rootValue: 32,
  // 默认所有属性都转化
  propList: ['*'],
  // 转化的单位,可以变成 px / rpx
  transformUnit: 'rpx'
}
```

> 为什么 `rootValue` 默认值是 `32` ?
>
> 这是因为开发微信小程序时, 设计师基本都使用 `iPhone6` 作为视觉稿的标准，此时 `1px = 2rpx` 。
>
> 然后默认情况下 `1rem = 16px` ，所以 `1rem = 16px = 32rpx` 。
>
> 详见 [WXSS 尺寸单位](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html#%E5%B0%BA%E5%AF%B8%E5%8D%95%E4%BD%8D) 章节，
>
> 当然你也可以自行传入一个 `object` 来进行更多配置，具体的配置项见 [postcss-rem-to-responsive-pixel](https://www.npmjs.com/package/postcss-rem-to-responsive-pixel)

#### **外置 postcss 插件**

首先我们安装 [postcss-rem-to-responsive-pixel](https://www.npmjs.com/package/postcss-rem-to-responsive-pixel)

```bash
pnpm add -D postcss-rem-to-responsive-pixel
```

工程没有单独创建 `postcss.config.js`，PostCSS 插件统一注册在 `vite.config.js` 的 `css.postcss.plugins` 中：

```js
import postcssRemToResponsivePixel from "postcss-rem-to-responsive-pixel"

export default defineConfig(() => ({
  css: {
    postcss: {
      plugins: [
        postcssRemToResponsivePixel({
          // 32 意味着 1rem = 32rpx
          rootValue: 32,
          // 默认所有属性都转化
          propList: ["*"],
          // 转化的单位，可以变成 px / rpx
          transformUnit: "rpx"
        })
      ]
    }
  }
}))
```

等价的插件配置项如下：

```js
{
      // 32 意味着 1rem = 32rpx
      rootValue: 32,
      // 默认所有属性都转化
      propList: ['*'],
      // 转化的单位,可以变成 px / rpx
      transformUnit: 'rpx'
      // postcss-rem-to-responsive-pixel@6 版本添加了 disabled 参数，用来禁止插件的转化
      // disabled: process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'rn'
}
```

#### 适配老龄化字体

> 因为vite 执行顺序 以及 转换规则应该除去font-\* 所以我们应该采用方式二，进行注册

关闭rem2rpx

```cobol
    // 此处不适应默认转换，需要自定义配置
      // 1.要忽略font
      // 2.要注意执行顺序，应该在rem转换之前
      UnifiedViteWeappTailwindcssPlugin({
        // rem2rpx: true,
        // disabled: WeappTailwindcssDisabled,
        cssEntries: [
          // tailwindcss@4 必须配置 cssEntries 并且使用绝对路径，否则 tailwindcss 生成的类名不会参与转译。
          path.resolve(__dirname, "src/main.css")
        ]
      }),
```

使用 外置 postcss 插件 进行配置 并忽略 font系列转换

```cobol
    css: {
      postcss: {
        plugins: [
          postcssRemToResponsivePixel({
            // 32 意味着 1rem = 32rpx
            rootValue: 32,
            // 这里使用的是白名单匹配，不支持 postcss-pxtorem 的 ! 排除语法 不处理font
            propList: [
              "margin",
              "padding",
              "width",
              "height",
              /^(top|right|bottom|left)$/,
              /^inset(?:-(?:inline|block))?$/,
              /^border(?:-(?:width|radius|top-width|right-width|bottom-width|left-width|top-left-radius|top-right-radius|bottom-right-radius|bottom-left-radius))?$/,
              /^(?:column-gap|row-gap|gap)$/,
              /^flex-basis$/,
              /^(?:transform|translate)$/,
              /^background-(?:size|position)$/
            ],
            // 转化的单位,可以变成 px / rpx
            transformUnit: "rpx",
            disabled: WeappTailwindcssDisabled
          })
        ]
      }
    },
```

> 因为插件内部只支持白名单 propList 暂时需要先吧转换的列出来

### wotui

> 作者使用了wotui 其他组件库同理，提取组件变量 定义到mian.css
>
> 因为上述使用了插件对px进行了转换 所以直接把组件内部转换成了rem

```css
page {
  --wot-fs-big: 24px;
  --wot-fs-important: 19px;
  --wot-fs-title: 16px;
  --wot-fs-content: 14px;
  --wot-fs-secondary: 12px;
  --wot-fs-aid: 10px;
  --wot-action-sheet-panel-img-fs: 40px;
  --wot-badge-fs: 12px;
  --wot-button-icon-fs: 18px;
  --wot-cell-title-fs: 14px;
  --wot-cell-label-fs: 12px;
  --wot-cell-value-fs: 14px;
  --wot-cell-value-fs-large: 16px;
  --wot-cell-title-fs-large: 16px;
  --wot-cell-label-fs-large: 14px;
  --wot-calendar-fs: 16px;
  --wot-calendar-panel-title-fs: 14px;
  --wot-calendar-week-fs: 12px;
  --wot-calendar-day-fs: 16px;
  --wot-calendar-info-fs: 10px;
  --wot-checkbox-label-fs: 14px;
  --wot-checkbox-large-label-fs: 16px;
  --wot-collapse-title-fs: 16px;
  --wot-collapse-body-fs: 14px;
  --wot-collapse-retract-fs: 14px;
  --wot-divider-fs: 14px;
  --wot-input-number-fs: 12px;
  --wot-input-count-fs: 14px;
  --wot-input-count-fs-large: 14px;
  --wot-textarea-count-fs: 14px;
  --wot-textarea-count-fs-large: 14px;
  --wot-loadmore-fs: 14px;
  --wot-message-box-title-fs: 16px;
  --wot-message-box-content-fs: 14px;
  --wot-notice-bar-fs: 12px;
  --wot-pagination-message-fs: 12px;
  --wot-pagination-nav-fs: 12px;
  --wot-pagination-nav-content-fs: 12px;
  --wot-picker-column-fs: 16px;
  --wot-picker-column-active-fs: 18px;
  --wot-picker-region-fs: 14px;
  --wot-col-picker-selected-fs: 14px;
  --wot-col-picker-list-fs: 14px;
  --wot-col-picker-list-fs-tip: 12px;
  --wot-progress-label-fs: 14px;
  --wot-progress-icon-fs: 18px;
  --wot-tabs-nav-arrow-fs: 18px;
  --wot-tabs-nav-arrow-open-fs: 14px;
  --wot-grid-item-fs: 12px;
  --wot-upload-progress-fs: 14px;
  --wot-upload-file-fs: 12px;
  --wot-upload-preview-name-fs: 12px;
  --wot-fab-icon-fs: 20px;
  --wot-checkbox-button-font-size: 14px;
  --wot-tabbar-item-title-font-size: 10px;
  --wot-navbar-desc-font-size: 16px;
  --wot-navbar-title-font-size: 18px;
  --wot-table-font-size: 13px;
  --wot-sidebar-font-size: 16px;
  --wot-keyboard-key-font-size: 28px;
  --wot-keyboard-delete-font-size: 16px;
  --wot-keyboard-title-font-size: 16px;
  --wot-keyboard-close-font-size: 14px;
  --wot-number-keyboard-key-font-size: 28px;
  --wot-number-keyboard-delete-font-size: 16px;
  --wot-number-keyboard-title-font-size: 16px;
  --wot-number-keyboard-close-font-size: 14px;
  --wot-video-preview-close-font-size: 20px;
  --wot-avatar-font-size: 20px;
  --wot-avatar-font-size-large: 28px;
  --wot-avatar-font-size-medium: 24px;
  --wot-avatar-font-size-small: 18px;
  --wot-avatar-group-collapse-font-size: 12px;
}
```

### 五、结语

如果 **需求** 是不需要动态调整字体大小页面，可以直接在 `page-meta` 组件指定一个具体的字体大小即可。

如果是其他 `vite` 项目， **思想** 依然是通用的，重要的是理解 `vite` 插件用法。

---
