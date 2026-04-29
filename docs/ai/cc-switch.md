# CC Switch 使用指南

CC Switch 可以集中管理 Claude Code、Codex、Gemini CLI 等 AI 编程工具的服务提供商、模型和 API Key。它适合需要在官方服务、代理服务或不同模型之间切换的开发者。

## 添加服务提供商

1. 打开 CC Switch。
2. 点击新增服务提供商。
3. 选择预设提供商，或选择自定义。
4. 填写 API Key、Base URL 和模型名。
5. 保存配置。

预设通常会自动填充 Base URL，自定义提供商则需要手动填写。

## 切换提供商

添加完成后，可以在主界面启用某个提供商，也可以通过系统托盘快速切换。

切换后不同 CLI 的生效方式可能不同：

| 工具        | 生效方式                   |
| ----------- | -------------------------- |
| Claude Code | 通常可直接生效             |
| Codex       | 建议重启终端或重新打开 CLI |
| Gemini CLI  | 通常在新请求时读取配置     |

如果切换后没有生效，优先关闭对应 CLI 进程并重新打开终端。

## 验证配置

在终端启动对应工具，并输入一个简单问题：

```bash
claude
```

```bash
codex
```

```bash
gemini
```

只需要测试你实际使用的工具。如果能正常返回回答，说明配置已生效。

## Codex 配置说明

Codex 常见配置位于用户目录的 `.codex` 下，通常包括：

```text
~/.codex/auth.json
~/.codex/config.toml
```

`auth.json` 存储密钥：

```json
{
  "OPENAI_API_KEY": "your-api-key"
}
```

`config.toml` 存储模型和服务端点：

```toml
model_provider = "custom"
model = "gpt-5.2"
model_reasoning_effort = "high"
disable_response_storage = true

[model_providers.custom]
name = "custom"
base_url = "https://api.example.com/v1"
wire_api = "responses"
requires_openai_auth = true
```

字段说明：

| 字段                       | 说明                                                |
| -------------------------- | --------------------------------------------------- |
| `model_provider`           | 模型提供商名称，需要和 `[model_providers.xxx]` 匹配 |
| `model`                    | 使用的模型                                          |
| `model_reasoning_effort`   | 推理强度，例如 `low`、`medium`、`high`              |
| `disable_response_storage` | 是否禁用响应存储                                    |
| `base_url`                 | API 服务地址                                        |
| `wire_api`                 | API 协议类型                                        |
| `requires_openai_auth`     | 是否使用 OpenAI 风格鉴权                            |

## 安全提醒

- 不要把 `auth.json`、API Key 或代理服务密钥提交到仓库。
- 不要把个人密钥写进 Markdown 示例。
- 团队协作时只共享配置结构，不共享真实密钥。
