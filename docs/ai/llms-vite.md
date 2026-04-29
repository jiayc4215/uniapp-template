# llms.txt 与 VitePress 文档

`llms.txt` 是面向 AI 工具的文档索引文件，作用类似给 AI 准备一份更容易读取的站点目录。对 VitePress 文档站来说，它通常会生成两个文件：

- `llms.txt`：站点说明和主要文档链接。
- `llms-full.txt`：整站 Markdown 内容汇总，便于 AI 一次性读取。

## 适用场景

- 希望 Cursor、Claude、Codex、TRAE 等 AI 工具更容易理解项目文档。
- 希望把文档站内容以纯文本形式暴露给 AI 检索。
- 希望在提问时直接引用项目文档，而不是让 AI 从页面 HTML 里提取内容。

## 本项目现状

当前文档站位于 `docs/`，使用 VitePress：

```text
docs/
├── .vitepress/
│   ├── config.mjs
│   └── sidebar.js
├── guide/
├── plugin/
├── develop/
├── expand/
└── ai/
```

`docs/package.json` 中暂未集成 `vitepress-plugin-llms`。如果需要生成 `llms.txt`，可以在 `docs` 目录安装并配置。

## 安装

```bash
cd docs
pnpm add -D vitepress-plugin-llms
```

## 配置

在 `docs/.vitepress/config.mjs` 中接入插件：

```js
import { defineConfig } from "vitepress"
import llmstxt from "vitepress-plugin-llms"
import { sidebar } from "./sidebar"

export default defineConfig({
  title: "uniapp-template",
  description: "uni-app + Vue 3 + Vite 多端项目模板文档",
  base: "/uniapp-template/",
  vite: {
    plugins: [
      llmstxt({
        title: "uniapp-template",
        description: "uni-app + Vue 3 + Vite 多端项目模板文档"
      })
    ]
  },
  themeConfig: {
    sidebar
  }
})
```

构建文档：

```bash
pnpm docs:build
```

生成文件会输出到 VitePress 构建目录中，部署后即可通过站点根路径访问。

## 使用建议

- 文档标题尽量清晰，避免只有“使用说明”“问题记录”这类泛标题。
- 复制外部文章时要改成项目真实路径、真实依赖版本和真实命令。
- 不适合暴露给 AI 的内容不要放进公开文档站。
- 如果 `llms-full.txt` 过大，可以通过插件配置排除不必要页面。

## 参考

- [vitepress-plugin-llms](https://www.npmjs.com/package/vitepress-plugin-llms)
- [llms.txt](https://llmstxt.org/)
