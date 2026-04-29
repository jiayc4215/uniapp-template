# Tailwind OKLCH 兼容处理

Tailwind CSS 4 默认会生成 OKLCH 颜色。为了兼容不支持 OKLCH 的运行环境，工程在 Vite 的 PostCSS 配置中接入了 `@csstools/postcss-oklab-function`。

## 项目配置

依赖已在根目录 `package.json` 中声明：

```json
{
  "devDependencies": {
    "@csstools/postcss-oklab-function": "^5.0.3"
  }
}
```

插件在 `vite.config.js` 中注册：

```js
import tailwindcss from "@tailwindcss/postcss"
import postcssOKLabFunction from "@csstools/postcss-oklab-function"

export default defineConfig(() => ({
  css: {
    postcss: {
      plugins: [tailwindcss(), postcssOKLabFunction()]
    }
  }
}))
```

## 作用

构建 CSS 时，插件会为 OKLCH 颜色补充兼容色值。处理后的 CSS 会同时保留兼容颜色和 OKLCH 颜色，让不支持 OKLCH 的环境可以回退到兼容写法。

示例：

```css
.bg-primary {
  background-color: rgb(0, 176, 86);
  background-color: oklch(66.28% 0.24 151.4);
}
```

## 使用约定

- 业务代码无需单独引入该插件。
- 不需要额外创建 `postcss.config.js`，工程已在 `vite.config.js` 内配置 PostCSS。
- 新增 Tailwind 颜色时，优先使用 `src/main.css` 中的语义变量映射。
