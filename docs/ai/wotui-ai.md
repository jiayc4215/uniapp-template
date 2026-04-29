# Wot UI 与 AI 编程

本项目使用 `@wot-ui/ui@^2.0.0`，AI 工具生成页面或组件时，建议优先参考 Wot UI 官方文档和本项目现有代码风格。

## 本项目中的 Wot UI

根目录 `package.json`：

```json
{
  "dependencies": {
    "@wot-ui/ui": "^2.0.0"
  }
}
```

`pages.config.js` 中已经配置 easycom：

```js
export default defineUniPages({
  easycom: {
    autoscan: true,
    custom: {
      "^wd-(.*)": "@wot-ui/ui/components/wd-$1/wd-$1.vue"
    }
  }
})
```

因此页面中可以直接使用 `wd-` 组件，例如：

```vue
<template>
  <wd-button type="primary">提交</wd-button>
</template>
```

## 给 AI 的上下文

使用 AI 工具生成 Wot UI 代码时，建议补充这些约束：

- 当前项目是 uni-app + Vue 3 + Vite。
- Wot UI 版本为 `^2.0.0`。
- 组件前缀使用 `wd-`。
- 项目已启用 easycom，不需要手动 import Wot UI 组件。
- 页面样式优先复用项目现有 Tailwind / CSS 变量风格。

## llms.txt

Wot UI 官方提供了适合 AI 读取的文档入口：

```text
https://wot-ui.cn/llms.txt
https://wot-ui.cn/llms-full.txt
```

可以把这些 URL 添加到支持文档索引的 AI 工具中，例如 Cursor Docs、TRAE 文档集，或其他支持从 URL 读取上下文的工具。

## Skills

本仓库已经内置 Wot UI 相关 Skills：

```text
.agents/skills/wot-ui/SKILL.md
.agents/skills/wot-ui-v2/SKILL.md
.agents/skills/create-wot-ui-theme/SKILL.md
```

当任务涉及 Wot UI 组件、主题或 `wd-` 组件 API 时，可以让 AI 使用这些 Skills，以减少 API 猜测和版本错配。

## 推荐提示词

```text
请基于当前 uni-app Vue3 项目生成页面，使用 Wot UI v2 的 wd- 组件。
项目已配置 easycom，不要手动 import Wot UI 组件。
样式请贴合现有页面，优先使用项目已有的 Tailwind 类和 CSS 变量。
```

如果要生成复杂表单，可以补充：

```text
请使用 wd-form、wd-input、wd-picker、wd-button，并补充校验规则和提交 loading 状态。
```
