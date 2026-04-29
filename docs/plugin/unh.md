# @uni-helper/unh

`@uni-helper/unh` 用于封装 uni-app 的开发、构建和配置生成流程。工程通过它在运行前生成 `pages.json` 和 `manifest.json`，并提供平台别名。

## 配置

配置文件位于根目录 `unh.config.js`：

```js
import { defineConfig } from "@uni-helper/unh"

export default defineConfig({
  platform: {
    default: "h5",
    alias: {
      h5: ["w", "h"],
      "mp-weixin": ["wx"]
    }
  },
  devtools: {
    open: true
  },
  autoGenerate: {
    pages: true,
    manifest: true
  }
})
```

## 常用命令

根目录 `package.json` 中已经配置好脚本：

```json
{
  "scripts": {
    "dev": "unh dev --mode development",
    "build": "unh build --mode production",
    "prepare": "unh prepare && husky",
    "dev:mp-weixin": "unh dev mp-weixin --mode development",
    "build:mp-weixin": "unh build  mp-weixin --mode production"
  }
}
```

常用命令：

```bash
# 默认平台 h5
pnpm dev

# 使用 mp-weixin 完整平台名
pnpm dev:mp-weixin

# 使用 unh 别名
pnpm dev wx

# 默认平台 h5 生产构建
pnpm build

# 微信小程序生产构建
pnpm build:mp-weixin
```

## 自动生成配置

`autoGenerate.pages` 和 `autoGenerate.manifest` 开启后，`unh` 会根据以下源文件生成 uni-app 需要的配置文件：

- `pages.config.js`
- 页面内 `definePage(...)`
- `manifest.config.js`

生成产物包括：

- `src/pages.json`
- `src/manifest.json`

修改页面配置、`pages.config.js`、`manifest.config.js` 或 `unh.config.js` 后，重新运行开发或构建命令即可更新产物。

## 平台别名

当前别名：

| 平台        | 别名     |
| ----------- | -------- |
| `h5`        | `w`、`h` |
| `mp-weixin` | `wx`     |

示例：

```bash
pnpm dev wx
pnpm build wx
```

## 参考

- [@uni-helper/unh](https://github.com/uni-helper/unh)
