# uniapp-template

基于 `uni-app + Vue 3 + Vite` 的多端项目示例，当前项目集成了角色登录、权限路由、角色化 TabBar、Wot Design Uni、Tailwind/weapp-tailwindcss、Mock、本地扫码页面、二维码保存和异步分包图表等能力，可用于业务项目初始化或多端能力演示。

## 项目特性

- 基于 `uni-app 3`、`Vue 3`、`Vite 5` 构建，支持 H5、微信小程序等多端输出
- 使用 `Pinia` 管理登录态与用户信息，并启用持久化
- 通过 `definePage + 路由守卫` 实现登录校验与角色权限控制
- 基于角色动态切换自定义 `TabBar`
- 集成 `wot-design-uni` 组件库
- 集成 `Tailwind CSS 4 + weapp-tailwindcss`，统一多端样式书写方式
- 支持开发环境 `Mock` 数据
- 提供字体版本切换（标准版 / 关怀版）
- 提供扫码、二维码生成与保存、异步图表分包示例
- 提供微信小程序 CLI 上传脚本

## 技术栈

- `uni-app`
- `Vue 3`
- `Vite 5`
- `Pinia`
- `Wot Design Uni`
- `Tailwind CSS 4`
- `weapp-tailwindcss`
- `uni-echarts / echarts`
- `better-mock`

## 运行环境

- `Node.js >= 20.19.0`
- `pnpm`

> 项目启用了 `only-allow pnpm`，请使用 `pnpm` 安装依赖。

## 快速开始

```bash
pnpm install
```

### 本地开发

```bash
# H5 开发
pnpm dev:h5

# 微信小程序开发
pnpm dev:mp-weixin

# 使用 unh 开发模式
pnpm dev
```

### 打包构建

```bash
# H5 生产构建
pnpm build:h5

# 微信小程序生产构建
pnpm build:mp-weixin

# 通用生产构建
pnpm build
```

### 代码检查与格式化

```bash
pnpm lint
pnpm lint:fix
pnpm lint:prettier
```

## 环境变量

环境文件位于 `env/` 目录：

- `env/.env`
- `env/.env.development`
- `env/.env.test`
- `env/.env.production`

当前项目中用到的主要变量如下：

| 变量名                  | 说明                              |
| ----------------------- | --------------------------------- |
| `VITE_APP_TITLE`        | 应用标题                          |
| `VITE_UNI_APPID`        | uni-app 应用 AppID                |
| `VITE_WX_APPID`         | 微信小程序 AppID                  |
| `VITE_APP_PUBLIC_BASE`  | H5 部署基础路径                   |
| `VITE_APP_PORT`         | 本地开发端口                      |
| `VITE_APP_PROXY_ENABLE` | 是否开启 H5 代理                  |
| `VITE_APP_PROXY_PREFIX` | 代理前缀                          |
| `VITE_SERVER_BASEURL`   | 接口服务地址                      |
| `VITE_APP_MOCK`         | 是否启用 Mock                     |
| `VITE_DELETE_CONSOLE`   | 打包时是否移除 `console/debugger` |
| `VITE_SHOW_SOURCEMAP`   | 是否生成 sourcemap                |

### Mock 说明

- 开发环境且 `VITE_APP_MOCK=true` 时，会启用本地 Mock
- 登录接口会根据角色返回不同 token
- 用户信息接口会返回对应角色的演示数据

## 角色与页面

当前项目内置两个角色：

- `admin`
- `user`

登录页支持直接切换角色进行演示。页面权限和 TabBar 会随角色变化。

### 页面能力

| 页面                          | 说明                                 | 权限             |
| ----------------------------- | ------------------------------------ | ---------------- |
| `pages/login/index`           | 账号密码登录、角色切换               | 免登录           |
| `pages/index/index`           | 公共首页                             | `admin` / `user` |
| `pages/admin-dashboard/index` | 管理端二维码保存示例                 | `admin`          |
| `pages/admin-profile/index`   | 管理端个人页、字号版本切换、退出登录 | `admin`          |
| `pages/home/index`            | 用户端发现页、异步图表示例           | `user`           |
| `pages/user-profile/index`    | 用户端个人页、扫一扫、退出登录       | `user`           |
| `pages/error/index`           | 权限不足/异常兜底页                  | 免登录           |

## 目录结构

```text
.
├── env/                         # 环境变量
├── scripts/                     # 构建与上传脚本
├── src/
│   ├── api/                     # 接口定义
│   ├── components/              # 公共业务组件
│   ├── composables/             # 组合式函数
│   ├── echarts-modules/         # 图表异步分包
│   ├── mock/                    # Mock 数据
│   ├── pages/                   # 主包页面
│   ├── public-modules/          # 公共功能分包（扫码、二维码等）
│   ├── router/                  # 路由与权限控制
│   ├── store/                   # Pinia 状态管理
│   ├── tabbar/                  # 自定义 TabBar
│   ├── utils/                   # 工具方法与请求封装
│   ├── App.vue
│   └── main.js
├── manifest.config.js           # uni-app manifest 配置
├── pages.config.js              # 页面与 tabBar 配置
└── vite.config.js               # Vite 构建配置
```

## 权限与路由约定

- 页面通过 `definePage` 声明 `rules` 实现角色权限控制
- `src/router/permission.js` 负责统一登录校验与页面放行
- 白名单页通过 `excludeLoginPath` 或静态白名单配置实现免登录访问
- `src/tabbar/config.js` 按角色定义不同的底部导航

## 样式与 UI 约定

- 组件库使用 `wot-design-uni`
- 项目支持 `Tailwind CSS` 原子类写法
- 通过自定义插件处理 `px/rem/rpx` 转换
- 通过 `page-meta` 动态注入根字体大小，支撑字号版本切换

## 微信小程序上传

项目提供了微信小程序 CLI 上传脚本：

```bash
pnpm upload:mp
pnpm upload:mp --version=1.0.1
pnpm upload:mp --desc="修复问题"
pnpm upload:mp --version=1.0.1 --desc="版本说明" --robot=2
```

上传前请确认：

- 已完成 `pnpm build:mp-weixin`
- `env/.env.production` 中已配置 `VITE_WX_APPID`
- 私钥文件存在于以下任一位置：
  - `build/key/private.<appid>.key`
  - `build/ci_keys/private.key`
- 微信公众平台已开通小程序代码上传能力，并配置上传 IP 白名单

## 说明

- 当前仓库更偏向“项目模板 + 能力示例”，适合作为 uni-app 多端项目启动基础
- 如果要接真实后端，优先检查 `env/`、`src/utils/env.js`、`src/utils/http.js`、`src/api/`
- 如果要扩展角色权限，优先检查 `src/router/permission.js`、`src/tabbar/config.js`、各页面内的 `definePage`
