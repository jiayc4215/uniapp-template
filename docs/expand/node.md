# 锁定项目 Node 版本

统一 Node.js 版本可以减少“我这里能跑、你那里报错”的环境问题。本项目已经在 `package.json` 中声明 Node 版本要求：

```json
{
  "engines": {
    "node": ">=20.19.0"
  }
}
```

## 推荐环境

- `Node.js >= 20.19.0`
- `pnpm`

安装依赖前先检查版本：

```bash
node --version
pnpm --version
```

如果本机 Node 版本不满足要求，建议使用 `nvm`、`fnm` 或 Volta 管理 Node 版本。

## 使用 nvm

可以在项目根目录新增 `.nvmrc`：

```text
20.19.0
```

之后切换版本：

```bash
nvm install
nvm use
```

## engines 的作用

`engines.node` 会告诉包管理器当前项目期望的 Node 版本范围。`pnpm` 会读取该字段，并在版本不匹配时给出提示或阻止安装。

如果希望 npm 也严格拦截不符合要求的 Node 版本，可以在 `.npmrc` 中加入：

```text
engine-strict=true
```

本项目已经通过 `preinstall` 强制使用 `pnpm`，通常不需要再用 npm 安装依赖。
