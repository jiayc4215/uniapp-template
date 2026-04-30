# H5 持续集成

工程内置了 H5 构建脚本，并提供 `scripts/upload-h5.js` 用于通过 SFTP 上传 `dist/build/h5` 产物。

## 命令

根目录 `package.json` 已配置 H5 构建命令：

```json
{
  "scripts": {
    "build:h5": "uni build --mode production"
  }
}
```

构建 H5：

```bash
pnpm build:h5
```

构建后上传：

```bash
pnpm build:h5 && node ./scripts/upload-h5.js
```

默认上传测试环境；如需上传生产环境，追加 `--production`：

```bash
pnpm build:h5 && node ./scripts/upload-h5.js --production
```

## 部署配置

上传脚本读取根目录 `build/server.js`：

```js
export default [
  {
    nodeEnv: "test",
    host: "example.com",
    port: 22,
    username: "deploy",
    password: process.env.H5_DEPLOY_PASSWORD,
    path: "/var/www/html",
    postCmd: "chmod -R 755 /var/www/html"
  }
]
```

字段说明：

| 字段       | 说明                                      |
| ---------- | ----------------------------------------- |
| `nodeEnv`  | 部署环境，`test` 或 `production`          |
| `host`     | 服务器地址                                |
| `port`     | SSH / SFTP 端口                           |
| `username` | 登录用户名                                |
| `password` | 登录密码，建议从 CI Secret 或环境变量读取 |
| `path`     | 服务器上的 H5 部署目录                    |
| `postCmd`  | 上传后执行的远程命令，可选                |

::: warning
不要把服务器密码、私钥、Token 等敏感信息提交到仓库。CI 中建议使用 Secret / Variables 注入。
:::

## 上传流程

执行 `node ./scripts/upload-h5.js` 时会按顺序完成：

1. 根据参数选择环境，默认 `test`，传入 `--production` 时选择 `production`。
2. 从 `build/server.js` 中筛选对应 `nodeEnv` 的服务器配置。
3. 连接服务器并检查远程部署目录是否存在。
4. 如果远程目录存在，先备份到本地 `distbak/<host>/<date>/dist-<time>`。
5. 删除远程旧目录。
6. 上传本地 `dist/build/h5` 到远程 `path`。
7. 如果配置了 `postCmd`，上传完成后通过 SSH 执行远程命令。

## CI 示例

下面示例以 GitHub Actions 为例，提交到 `main` 分支后构建并部署生产环境：

```yaml
name: Deploy H5

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: Build H5
        run: pnpm build:h5

      - name: Deploy H5
        env:
          H5_DEPLOY_PASSWORD: ${{ secrets.H5_DEPLOY_PASSWORD }}
        run: node ./scripts/upload-h5.js --production
```

如果 `build/server.js` 不提交到仓库，可以在 CI 中生成该文件，但仍然不要把真实密钥写入日志：

```yaml
- name: Create deploy config
  run: |
    mkdir -p build
    cat > build/server.js <<'EOF'
    export default [
      {
        nodeEnv: "production",
        host: process.env.H5_DEPLOY_HOST,
        port: 22,
        username: process.env.H5_DEPLOY_USERNAME,
        password: process.env.H5_DEPLOY_PASSWORD,
        path: process.env.H5_DEPLOY_PATH
      }
    ]
    EOF
```

## 环境变量

H5 构建会读取生产环境变量：

- `env/.env`
- `env/.env.production`

常见需要检查的变量：

| 变量                   | 说明                                |
| ---------------------- | ----------------------------------- |
| `VITE_APP_PUBLIC_BASE` | H5 部署基础路径，会影响静态资源路径 |
| `VITE_SERVER_BASEURL`  | 接口服务地址                        |
| `VITE_DELETE_CONSOLE`  | 打包时是否移除 `console/debugger`   |
| `VITE_SHOW_SOURCEMAP`  | 是否生成 sourcemap                  |

## 注意事项

- 上传前确认 `pnpm build:h5` 已成功生成 `dist/build/h5`。
- `VITE_APP_PUBLIC_BASE` 需要和真实部署路径保持一致，例如部署到站点根目录通常使用 `/`。
- 服务器部署目录会被脚本删除后重新上传，确认 `path` 只指向当前 H5 应用目录。
- 生产环境建议使用独立部署账号，并限制该账号只能访问目标部署目录。
- 上传失败时先检查服务器网络、账号权限、部署目录权限和 `build/server.js` 中的 `nodeEnv` 是否匹配。
