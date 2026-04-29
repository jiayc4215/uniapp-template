# @uni-helper 社区：让 uni-app 拥抱 ESM 时代

在现代前端开发中，模块系统是构建可维护应用程序的基石。随着JavaScript生态系统的发展，我们见证了从无模块到 CommonJS (CJS)，再到 ECMAScript Modules (ESM) 的演进历程。本文将探讨 ESM 的重要性，Vite 生态系统向纯 ESM 的转变趋势，以及 `@uni-helper/plugin-uni` 如何帮助uni-app开发者无缝过渡到 ESM 环境。

### CJS 与 ESM：两种模块系统的对比

在深入讨论 uni-app 的 ESM 转型之前，让我们先了解 CommonJS 和 ESM 这两种主流模块系统的区别。

#### CommonJS (CJS)

CommonJS 最初是为Node.js设计的模块系统，它使用 `require()` 和 `module.exports` 语法：

```cobol
// 导出模块
const myFunction = () => {
  console.log('Hello from CJS');
};

module.exports = {
  myFunction
};

// 导入模块
const { myFunction } = require('./my-module');
```

**特点：**

- 同步加载模块

- 运行时解析

- 模块是可变对象

- 循环依赖处理相对复杂

- 不支持静态分析

#### ECMAScriptModules(ESM)

ESM 是 JavaScript 官方的标准模块系统，使用 `import` 和 `export` 语法：

```typescript
// 导出模块
export const myFunction = () => {
  console.log("Hello from ESM")
}

// 导入模块
import { myFunction } from "./my-module.js"
```

**特点：**

- 支持异步加载

- 编译时（静态）解析

- 模块导出是不可变的

- 更优雅地处理循环依赖

- 支持静态分析，有利于 tree-shaking 和代码优化

- 浏览器原生支持

```typescript
// 导出模块
export const myFunction = () => {
  console.log("Hello from ESM")
}

// 导入模块
import { myFunction } from "./my-module.js"
```

### Vite生态系统的 ESM-only 趋势

#### 为什么 Vite 选择 ESM？

[Vite](https://link.juejin.cn/?target=https%3A%2F%2Fvitejs.dev%2F) 作为现代前端构建工具，从设计之初就选择了拥抱 ESM。这一决策带来了显著的性能优势：

1. **更快的开发服务器启动** ：Vite 利用浏览器原生 ESM 支持，无需打包整个应用即可启动开发服务器

2. **即时模块热更新** ：只需重新编译修改的模块，而非整个依赖图

3. **按需编译** ：仅在浏览器请求时编译所需模块

正如 [Anthony Fu 在他的文章](https://link.juejin.cn/?target=https%3A%2F%2Fantfu.me%2Fposts%2Fmove-on-to-esm-only) 中所述，Vite 生态系统正在全面转向 ESM-only 模式。这意味着 Vite 及其插件生态系统正在放弃对 CommonJS 的兼容性，转而完全采用 ESM。

#### Vite 4.x 到 5.x：ESM 转型的关键节点

Vite 5.0 标志着向纯 ESM 生态系统的重要转变。在此版本中，Vite 核心及其官方插件已全面采用 ESM 格式发布，不再提供 CommonJS 兼容层。这一变化带来了更好的性能和更简洁的代码库，但也意味着插件开发者需要适应这一新范式。

### uni-app 的 CJS 困境

#### 当前状况

uni-app 是流行的跨平台开发框架，但其官方插件 `@dcloudio/vite-plugin-uni` 仍然使用 CommonJS 格式发布。这在 Vite 的 ESM 优先环境中创造了一系列问题：

在使用 uni-app 官方插件时，如果遇到只提供 ESM 格式的插件（如 `UnoCSS` ），需要采用以下不直观的方式：

```csharp
import { defineConfig } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'

export default async () => {
  const UnoCSS = (await import('unocss/vite')).default

  return defineConfig({
    plugins: [
      Uni(),
      UnoCSS()
    ]
  })
}
```

这种混合使用 CJS 和 ESM 插件的方式存在几个明显问题：

1. **配置复杂化** ：需要使用异步函数和动态导入，增加配置复杂度

2. **开发体验下降** ：违反直觉的接入方式，增加认知负担

3. **生态兼容性风险** ：与 Vite 的 ESM 优先设计原则冲突

随着越来越多的 Vite 插件转向 ESM-only，这种兼容性问题将变得更加突出。

### @uni-helper/plugin-uni：桥接 ESM 与 uni-app 的解决方案

为解决上述问题，社区驱动的 `@uni-helper` 项目推出了 `@uni-helper/plugin-uni` ，这是一个为 uni-app 提供的原生 ESM Vite 插件，让你在 ESM-First 环境中零成本接入 uni-app 构建体系。

**值得一说的是@uni-helper/plugin-uni只是提供了一个ESM的选择，并非是Only ESM。**

#### ✨ 核心亮点

|       特性        |                                说明                                |
| :---------------: | :----------------------------------------------------------------: |
|  🚀 **原生 ESM**  |     完全遵循 `import` / `export` 规范，无需 `.default()` 适配      |
|  🛡️ **完整类型**  | TypeScript 类型与 `@dcloudio/vite-plugin-uni` 同步，IDE 提示零丢失 |
| 🪶 **零依赖转发** |  通过 `peerDependencies` 复用用户项目中的官方插件， **不锁版本**   |
|  🧩 **即装即用**  |               一行 `import` ，即可替换官方 CJS 插件                |

#### 🔧 工作原理

`@uni-helper/plugin-uni` 采用了巧妙的设计理念：

1. **零运行时影响** ：本包仅为 ESM 重导出，无额外逻辑，因此不会增加构建耗时或引入潜在缺陷

2. **版本控制灵活** ：通过 `peerDependencies` 复用用户项目中的 `@dcloudio/vite-plugin-uni` ，确保版本由用户掌控

3. **类型同步** ：手动导出 `.d.ts` 文件，确保类型与官方插件一致

这种设计确保了插件的稳定性和兼容性，同时为用户提供了最佳的开发体验。

#### 使用方法

使用 `@uni-helper/plugin-uni` 非常简单，完全符合 ESM 的使用习惯：

```typescript
import Uni from "@uni-helper/plugin-uni" // 符合 ESM 规范的标准导入
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [Uni()] // 直接调用，无需 .default()
})
```

#### 📦 安装

```bash
pnpm add -D @uni-helper/plugin-uni
```

> **重要提示** ：请确保已安装官方插件 `@dcloudio/vite-plugin-uni` ，否则本插件将无法正常工作。

#### 与官方插件的区别

`@uni-helper/plugin-uni` 本质上是对官方 `@dcloudio/vite-plugin-uni` 的 ESM 包装，它提供了相同的功能，但以符合 ESM 规范的方式导出。这意味着你可以获得与官方插件相同的功能，同时享受 ESM 带来的所有好处。

### 使用create-uni创建一个ESM的uniapp项目

`create-uni` 已经默认支持了ESM模式，所以你只需要一条命令就可以轻松创建一个基于uniapp的esm项目了！

关于 `create-uni` 的更多信息，可以查看 [这里](https://juejin.cn/post/7457808828605693988) 。

```sql
npm create uni
```

### 迁移指南：从官方插件到 @uni-helper/plugin-uni

如果你正在使用官方的 `@dcloudio/vite-plugin-uni` 插件，迁移到 `@uni-helper/plugin-uni` 非常简单：

#### 步骤 1：安装新插件

```bash
pnpm add -D @uni-helper/plugin-uni
```

#### 步骤 2：将项目设置为 ESM 模式

在 `package.json` 中添加 `"type": "module"` 字段，这将告诉 Node.js 将项目视为 ESM 模块：

```perl
{
  "name": "your-uni-app-project",
  "version": "1.0.0",
  "type": "module",
  "devDependencies": {
    "@dcloudio/vite-plugin-uni": "xxx",
    "@uni-helper/plugin-uni": "^0.1.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

这一步骤非常重要，因为它使 Node.js 将 `.js` 文件视为 ESM 模块而非 CommonJS 模块。在 ESM 项目中，你可以使用 `import/export` 语法而无需文件扩展名为 `.mjs` 。

#### 步骤 3：更新 Vite 配置

```cobol
// vite.config.js
import { defineConfig } from 'vite'
-import Uni from '@dcloudio/vite-plugin-uni'
+import Uni from '@uni-helper/plugin-uni'

export default defineConfig({
  plugins: [
    Uni({ /* 同官方配置 */ })
  ]
})
```

完成这些步骤后，你的项目就已经完全转换为 ESM 模式，并使用符合 ESM 规范的插件了。

#### 🔍 问题归属与维护计划

`@uni-helper` 是一个社区驱动的项目，欢迎所有开发者参与贡献。当前工具链在 ESM 边界场景仍存在一些兼容性问题，如果你遇到问题或有改进建议，可以通过 GitHub 提交 Issue 或 PR。

在使用过程中需要注意以下几点：

- **问题归属** ：如遇构建异常，请先确认是否由官方插件引起，并向 [dcloudio/uni-app](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fdcloudio%2Funi-app%2Fissues) 提交 issue；若可定位为转发层缺陷，请附最小复现仓库至 [@uni-helper/plugin-uni](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Funi-helper%2Fplugin-uni)

- **维护计划** ：将持续跟进官方 ESM 支持进度；一旦官方提供原生 ESM 版本，本项目将归档并停止维护

### 结论

ESM 代表了 JavaScript 模块系统的未来，而 Vite 生态系统已经明确表示将全面拥抱这一标准。通过 `@uni-helper/plugin-uni` ，uni-app 开发者可以无缝融入这一趋势，享受 ESM 带来的所有好处，同时保持与 uni-app 生态系统的兼容性。

无论你是刚开始使用 uni-app 的新手，还是经验丰富的开发者， `@uni-helper/plugin-uni` 都能帮助你构建更现代、更高效的跨平台应用。是时候拥抱 ESM，拥抱未来了！
