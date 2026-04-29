# 项目结构

## 根目录

```text
.
├── docs/                    # VitePress 文档站点
├── env/                     # Vite 环境变量
├── scripts/                 # 构建、上传和 Vite 插件脚本
├── src/                     # 应用源码
├── manifest.config.js       # uni-app manifest 配置源文件
├── pages.config.js          # pages.json 配置源文件
├── unh.config.js            # @uni-helper/unh 配置
└── vite.config.js           # Vite 与 uni-app 插件配置
```

`pages.json` 和 `manifest.json` 由 `@uni-helper/unh` 根据 `pages.config.js`、页面内 `definePage` 和 `manifest.config.js` 自动生成。

## src 目录

```text
src/
├── api/                     # 接口定义
├── components/              # 自动注册的公共组件
├── composables/             # 组合式函数
├── echarts-modules/         # 图表分包
├── mock/                    # 本地 Mock
├── pages/                   # 主包页面
├── public-modules/          # 公共能力分包
├── router/                  # 路由拦截与权限控制
├── store/                   # Pinia 状态管理
├── tabbar/                  # 自定义 TabBar
├── utils/                   # 请求、路由、环境等工具
├── App.vue
└── main.js
```

## 页面与分包

主包页面位于 `src/pages`：

| 页面                          | 说明                                  | 权限             |
| ----------------------------- | ------------------------------------- | ---------------- |
| `pages/login/index`           | 登录页，当前也被标记为 `type: "home"` | 免登录           |
| `pages/index/index`           | 公共首页                              | `admin` / `user` |
| `pages/admin-dashboard/index` | 管理台示例                            | `admin`          |
| `pages/admin-profile/index`   | 管理端个人页                          | `admin`          |
| `pages/home/index`            | 用户端发现页，包含跨包图表示例        | `user`           |
| `pages/user-profile/index`    | 用户端个人页，包含扫码入口            | `user`           |
| `pages/error/index`           | 权限不足或异常提示页                  | 免登录           |

分包目录在 `vite.config.js` 的 `UniPages` 中声明：

```js
subPackages: ["src/echarts-modules", "src/public-modules"]
```

## 自动生成文件

开发或构建时会生成一些类型声明和 uni-app 配置文件，例如：

- `pages.json`
- `manifest.json`
- `src/types/pages.d.ts`
- `src/types/components.d.ts`
- `src/types/auto-imports.d.ts`
- `src/types/eslintrc-auto-import.json`

这些文件属于工具链产物，修改源配置或页面后通常需要重新运行开发命令让它们更新。
