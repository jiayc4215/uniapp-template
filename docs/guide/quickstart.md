# 快速开始

## 环境要求

- `Node.js >= 20.19.0`
- `pnpm`

项目启用了 `only-allow pnpm`，请不要混用 `npm install` 或 `yarn install`。

## 安装依赖

```bash
pnpm install
```

安装后会执行 `postinstall` 中的 `weapp-tw patch`，用于适配小程序端 Tailwind 转换。

## 本地开发

```bash
# 默认使用 @uni-helper/unh，未指定平台时默认 h5
pnpm dev

# H5 开发
pnpm dev:h5

# 微信小程序开发
pnpm dev:mp-weixin

# 使用 unh 平台别名启动微信小程序
pnpm dev wx
```

`unh.config.js` 中配置了默认平台 `h5`，并提供了 `h5` 的 `w`、`h` 别名，以及 `mp-weixin` 的 `wx` 别名。

## 构建

```bash
# 通用生产构建，默认平台 h5
pnpm build

# H5 生产构建
pnpm build:h5

# 微信小程序生产构建
pnpm build:mp-weixin
```

## 文档开发

文档位于 `docs/` 目录，是一个独立的 VitePress 站点：

```bash
cd docs
pnpm install
pnpm docs:dev
```

## 代码检查

```bash
pnpm lint
pnpm lint:fix
pnpm lint:prettier
```

## 环境变量

环境变量文件位于 `env/`：

- `env/.env`
- `env/.env.development`
- `env/.env.test`
- `env/.env.production`

常见变量：

| 变量名                  | 说明                              |
| ----------------------- | --------------------------------- |
| `VITE_APP_TITLE`        | 应用标题                          |
| `VITE_UNI_APPID`        | uni-app 应用 AppID                |
| `VITE_WX_APPID`         | 微信小程序 AppID                  |
| `VITE_APP_PUBLIC_BASE`  | H5 部署基础路径                   |
| `VITE_APP_PORT`         | 本地开发端口                      |
| `VITE_APP_PROXY_ENABLE` | 是否启用 H5 代理                  |
| `VITE_APP_PROXY_PREFIX` | H5 代理前缀                       |
| `VITE_SERVER_BASEURL`   | 接口服务地址                      |
| `VITE_APP_MOCK`         | 是否启用 Mock                     |
| `VITE_DELETE_CONSOLE`   | 构建时是否移除 `console/debugger` |
| `VITE_SHOW_SOURCEMAP`   | 是否生成 sourcemap                |

## Mock

开发环境且 `VITE_APP_MOCK=true` 时，`src/main.js` 会动态导入 `src/mock`。当前 Mock 主要覆盖登录和用户信息演示流程。
