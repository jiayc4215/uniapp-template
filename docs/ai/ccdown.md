# CC Switch 安装指南

CC Switch 是一个用于管理 Claude Code、Codex、Gemini CLI 等 AI 编程工具配置的桌面应用。它不是本项目的运行依赖，只是辅助开发者在不同 AI 服务提供商之间切换。

## 前置环境

CC Switch 管理的 CLI 工具通常需要 Node.js 环境。建议本机 Node.js 版本和本项目保持一致：

```bash
node --version
```

本项目要求：

```json
{
  "engines": {
    "node": ">=20.19.0"
  }
}
```

## 安装 CLI 工具

按需安装你实际使用的 AI CLI。

Claude Code：

```bash
npm install -g @anthropic-ai/claude-code
```

Codex：

```bash
npm install -g @openai/codex
```

Gemini CLI：

```bash
npm install -g @google/gemini-cli
```

如果团队统一使用 Homebrew，也可以通过对应 tap 或 cask 安装，具体以各工具官方说明为准。

## 安装 CC Switch

访问 CC Switch 发布页下载对应平台安装包：

```text
https://github.com/farion1231/cc-switch/releases
```

常见平台：

- Windows：下载 `.msi` 安装包或 portable 压缩包。
- macOS：下载 `.zip` 后拖入 Applications，或使用 Homebrew cask。
- Linux：下载 `.deb`、AppImage，或使用 AUR 包。

## 验证

安装完成后打开 CC Switch，确认：

- 应用窗口可以正常打开。
- 系统托盘出现 CC Switch 图标。
- 能看到 Claude Code、Codex、Gemini CLI 等工具配置入口。

然后在终端分别验证 CLI 是否可用：

```bash
claude --version
codex --version
gemini --version
```

只需要验证你实际安装的工具。

## 注意事项

- API Key 不要写进项目代码、文档或提交记录。
- 如果需要配置密钥，请放在对应工具的用户目录配置中，或使用环境变量。
- CC Switch 只影响本机 AI 工具配置，不会改变本项目的构建、运行和依赖安装方式。
