# 强制使用 pnpm

本项目使用 `pnpm` 管理依赖，并通过 `only-allow` 阻止混用 `npm install` 或 `yarn install`。

## 项目配置

根目录 `package.json` 已配置：

```json
{
  "scripts": {
    "preinstall": "only-allow pnpm"
  },
  "devDependencies": {
    "only-allow": "^1.2.2"
  }
}
```

当开发者执行安装命令时，`preinstall` 会先运行。如果不是使用 `pnpm`，安装会被中断，并提示改用 `pnpm`。

## 正确安装方式

```bash
pnpm install
```

如果本机没有 `pnpm`，可以先通过 Corepack 或 npm 安装：

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

或：

```bash
npm install -g pnpm
```

## 为什么要统一包管理器

- 避免同时出现 `package-lock.json`、`yarn.lock` 和 `pnpm-lock.yaml`。
- 减少不同安装算法造成的依赖差异。
- 保持团队本地环境、CI 环境和锁文件一致。
- 配合 pnpm 的硬链接机制，减少磁盘占用并提升安装速度。

## 注意事项

- 本项目只提交并维护 `pnpm-lock.yaml`。
- 不要使用 `npm install` 或 `yarn install` 安装依赖。
- 新增依赖请使用 `pnpm add` 或 `pnpm add -D`。
