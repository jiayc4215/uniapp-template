# Eruda 调试插件

工程在 `scripts/vite-plugin-eruda.js` 中维护了一个轻量的本地 Vite 插件，用来在 H5 开发环境注入 Eruda 移动端调试面板。

## 项目中的配置

`vite.config.js` 中的用法：

```js
import eruda from "./scripts/vite-plugin-eruda"

export default defineConfig(({ mode }) => {
  const { UNI_PLATFORM } = process.env

  return {
    plugins: [
      eruda({
        open: UNI_PLATFORM === "h5" && mode !== "production"
      })
    ]
  }
})
```

当前逻辑只在 H5 且非生产模式下开启，避免影响生产包。

## 插件参数

```js
eruda({
  open: true,
  erudaUrl: "https://cdn.jsdelivr.net/npm/eruda",
  erudaOptions: {}
})
```

| 参数           | 类型      | 默认值                               | 说明                       |
| -------------- | --------- | ------------------------------------ | -------------------------- |
| `open`         | `boolean` | `true`                               | 是否注入 Eruda             |
| `erudaUrl`     | `string`  | `https://cdn.jsdelivr.net/npm/eruda` | Eruda 脚本地址             |
| `erudaOptions` | `object`  | `{}`                                 | 传给 `eruda.init()` 的配置 |

## 临时关闭

如需临时关闭 H5 调试面板，可以在 `vite.config.js` 中把 `open` 改为 `false`，或调整为更严格的环境判断。
