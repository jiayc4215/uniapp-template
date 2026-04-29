# 微信小程序上传

工程使用 `uni-mini-ci` 上传微信小程序，上传入口为根目录脚本 `scripts/upload-weixin.js`。

## 命令

根目录 `package.json` 已配置：

```json
{
  "scripts": {
    "upload:mp": "npm run build:mp-weixin && node ./scripts/upload-weixin.js"
  }
}
```

执行上传：

```bash
pnpm upload:mp
```

这里保持展示 `package.json` 中的真实脚本内容；日常执行仍使用 `pnpm upload:mp`。

可选参数：

```bash
# 指定版本号，默认读取 package.json version
pnpm upload:mp --version=1.0.1

# 指定版本描述，默认读取最新 Git commit
pnpm upload:mp --desc="修复登录问题"

# 指定微信开发者工具机器人编号，范围 1-30，默认 1
pnpm upload:mp --robot=2
```

## 环境变量

上传脚本会读取生产环境变量：

- `env/.env`
- `env/.env.production`

必须配置：

| 变量            | 说明             |
| --------------- | ---------------- |
| `VITE_WX_APPID` | 微信小程序 AppID |

## 私钥文件

脚本会按顺序查找私钥：

- `build/key/private.${appid}.key`
- `build/ci_keys/private.key`

私钥文件不要提交到仓库。上传前需要在微信公众平台开启“小程序代码上传”权限，并配置上传 IP 白名单。

## 上传流程

`pnpm upload:mp` 会执行：

1. `build:mp-weixin` 构建微信小程序产物。
2. 读取 `env/.env.production` 中的 `VITE_WX_APPID`。
3. 查找上传私钥。
4. 临时生成 `.minicirc`。
5. 执行 `minici --platform weixin`。
6. 上传结束后删除临时 `.minicirc`。

构建产物目录：

```text
dist/build/mp-weixin
```

## 上传配置

上传脚本会生成类似配置：

```json
{
  "version": "0.0.0",
  "desc": "commit message",
  "weixin": {
    "appid": "VITE_WX_APPID",
    "projectPath": "dist/build/mp-weixin",
    "privateKeyPath": "build/key/private.xxx.key",
    "robot": 1,
    "ignores": ["node_modules/**/*"],
    "setting": {
      "es6": false,
      "es7": false,
      "minify": true,
      "autoPrefixWXSS": true,
      "minifyWXML": true,
      "minifyWXSS": true,
      "minifyJS": true
    }
  }
}
```

## 注意事项

- 当前脚本只覆盖微信小程序上传。
- 支付宝、钉钉等平台如需上传，需要新增对应构建脚本和 `uni-mini-ci` 配置。
- 上传失败时先检查 `VITE_WX_APPID`、私钥路径、IP 白名单和 `dist/build/mp-weixin` 是否存在。
