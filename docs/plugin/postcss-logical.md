# npm 包 postcss-logical 使用教程

### 简介

在编写前端样式时，我们经常会遇到需要使用逻辑属性（LogicalProperties）和逻辑值（Logical Values）的情况。逻辑属性主要包括 `margin-inline` 、 `padding-inline` 、 `border-inline-start` 等，逻辑值主要包括 `inline-start` 、 `block-start` 、 `inline-end` 、 `block-end` 等。然而，这些属性和值在一些老版本的浏览器中并不支持。为了解决这个问题，我们可以使用 postcss-logical 这个 npm 包。

CSS逻辑属性是 CSS 国际化的未来趋势，它使用方向无关的概念来描述布局和间距，特别适用于需要支持多语言方向的现代 Web 应用。

#### 基本概念

CSS 逻辑属性引入了以下概念：

- **inline** : 行内方向（在 LTR 中是左右，在 RTL 中相反）

- **block** : 块级方向（通常是上下）

- **start/end** : 开始/结束位置（方向相关）

常用的逻辑属性包括：

```cobol
/* 间距 */
margin-inline-start: 16px;    /* 替代 margin-left */
margin-inline-end: 16px;      /* 替代 margin-right */
padding-block-start: 8px;     /* 替代 padding-top */

/* 边框 */
border-inline-start: 1px solid #ccc;  /* 替代 border-left */

/* 定位 */
inset-inline-start: 0;        /* 替代 left */
inset-inline-end: 0;          /* 替代 right */

/* 文本对齐 */
text-align: start;            /* 替代 text-align: left */
```

#### ✅ 优点

- **语义化** ：写法更符合逻辑，方向无关，行为可预期

- **自动适配** ：在 `dir="rtl"` 环境下自动翻转，无需额外代码

- **支持垂直文本** ：完美配合 `writing-mode` 属性

- **原生支持** ：无需构建工具，现代浏览器原生支持

#### 兼容性现状

- **主流逻辑属性** （如 `margin-inline-*` , `padding-inline-*` ）在现代浏览器中支持良好

- **Chrome/Edge** : 89+, **Firefox** : 66+, **Safari** : 15+, **Opera** : 76+

- 查看最新兼容性： [Can I Use - CSS Logical Properties](https://caniuse.com/css-logical-props)

### 安装

新项目可通过 pnpm 安装：

```bash
pnpm add -D postcss postcss-logical
```

工程已安装 `postcss-logical`，无需重复安装。

### 使用

工程没有单独创建 `postcss.config.js`，PostCSS 插件统一注册在 `vite.config.js`：

```js
import postcssLogical from "postcss-logical"

export default defineConfig(() => ({
  css: {
    postcss: {
      plugins: [postcssLogical()]
    }
  }
}))
```

接着，在 CSS 文件中使用逻辑属性和逻辑值：

```css
.example {
  margin-inline-start: 20px;
  padding-inline-end: 10px;
  border-block-start: 1px solid #000;
}
```

运行开发或构建命令时，Vite 会自动执行 PostCSS 处理。

### 示例代码

以下是一个简单的示例代码，展示了如何使用 postcss-logical：

```cobol
/* input.css */

.example {
  margin-inline-start: 20px;
  padding-inline-end: 10px;
  border-block-start: 1px solid #000;
}
```

```cobol
.example {
  /* margin */
  margin-left: 20px;

  /* padding */
  padding-right: 10px;

  /* border */
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #000;
}
```

### 总结

通过使用 postcss-logical，我们可以轻松地在前端项目中使用逻辑属性和逻辑值，而不需要考虑旧版本浏览器的兼容性问题。希望这篇教程能够对你有所帮助。
