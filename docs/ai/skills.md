# 彻底带你搞懂Skills(技能)：什么是Skills？如何用Skills？

### **<span style="color:#1a1a1a">概述</span>**

一种简单、开放的模式，旨在赋予agents新的能力和专业知识

<span style="color: #3391E5">Agent</span>Skills 是包含指令、脚本和资源的文件夹，agents可以发现并使用它们来更准确、更高效地完成任务。

Skills是一种用于扩展Agent功能的 `SKILL.md` 。skills是一个文件夹，其中包含一个文件，该文件规定了Agent在执行特定任务时可以遵循的指令。

### <span style="color:#111827">为什么需要</span>agent<span style="color:#111827">Skills？</span>

Agents<span style="color:#424242">的能力日益增强，但往往缺乏可靠完成实际工作所需的上下文信息。</span><span style="color:#111827">Skills</span><span style="color:#424242">通过赋予</span>Agents<span style="color:#424242">访问程序性知识以及公司、团队和用户特定上下文信息的权限来解决这个问题，这些知识和上下文信息可以按需加载。拥有特定</span><span style="color:#111827">Skills</span><span style="color:#424242">的</span>agents可以根据正在执行的任务扩展自身能力。 **对于** <span style="color:#111827">Skills</span> **开发者** ：只需构建一次功能，即可将其部署到多个agents中。 **对于兼容的** agents<span style="color:#424242">：</span><span style="color:#111827">Skills</span><span style="color:#424242">支持允许最终用户为</span>agent提供开箱即用的新功能。 **对于团队和企业** ：以可移植、版本控制的软件包形式捕获组织知识。

### Agent<span style="color:#111827">Skills</span>可以实现哪些功能？

- **领域专业知识** ：将专业知识打包成可重用的指令，涵盖从法律审查流程到数据分析流程等各个方面。

- **新功能** ：赋予Agent新功能（例如创建演示文稿、构建 MCP 服务器、分析数据集）。

- **可重复的工作流程** ：将多步骤任务转化为一致且可审计的工作流程。

- **互操作性** ：在不同的、<span style="color:#111827">Skills</span>兼容的Agent产品中重复使用相同的<span style="color:#111827">Skills</span>

### <span style="color:#121317">什么是</span>skills

Skills是可重用的知识包，用于扩展agent的功能。每个skills包含：

- 针对特定类型任务的处理方法 **说明**

- **最佳实践** 和惯例应遵循

- agent可以使用的 **可选脚本和资源**

当您发起对话时，agent会看到一个包含skills名称和描述的可用skills列表。如果某个skills看起来与您的任务相关，agent会阅读完整的说明并执行。

### Where skillslive

反重力支持两种类型的skills：

|                       地点                        |        范围        |
| :-----------------------------------------------: | :----------------: |
| `<workspace-root>/.agents/skills/<skill-folder>/` |     工作区特定     |
|  `~/.gemini/antigravity/skills/<skill-folder>/`   | 全局（所有工作区） |

**工作区** skills非常适合项目特定的工作流程，例如团队的部署流程或测试规范。

**全局** skills适用于您的所有项目。您可以将它们用于个人实用工具或您希望在任何地方使用的通用工具。

> 注意：Antigravity 现在默认使用 .agents/skills，但仍然保留对 .agent/skills 的向后支持。

### Creating askill

创建一项skills：

1. 在某个skills目录中创建一个用于存放您skills的文件夹。

2. `SKILL.md` 在该文件夹中添加一个文件

```cobol
.agents/skills/
└─── my-skill/
    └─── SKILL.md
```

每个skill都需要一个 `SKILL.md` 文件，其顶部包含 YAML frontmatter：

```vbnet
---
name: my-skill
description: Helps with a specific task. Use when you need to do X or Y.
---

# My Skill

Detailed instructions for the agent go here.

## When to use this skill

- Use this when...
- This is helpful for...

## How to use it

Step-by-step guidance, conventions, and patterns the agent should follow.
```

### 前言字段

|     场地      | 必需的 |                                        描述                                         |
| :-----------: | :----: | :---------------------------------------------------------------------------------: |
|    `name`     |   不   |   skills的唯一标识符（小写，空格用连字符表示）。如果未提供，则默认为文件夹名称。    |
| `description` |  是的  | 对skills的功能及其适用场景的清晰描述。这是agent在决定是否应用该skills能时所看到的。 |

提示：请使用第三人称撰写描述，并包含关键词，以便agent能够识别该skills的适用场景。例如：“Generates unit tests for Python code using pytest conventions.。”

### skills文件夹结构

虽然 `SKILL.md` 这是唯一必需的文件，但您也可以添加其他资源：

```cobol
.agents/skills/my-skill/
├─── SKILL.md       # 主要说明文档（必需）
├─── scripts/       # 辅助脚本（可选）
├─── examples/      # 参考实现示例（可选）
└─── resources/     # 模板和其他资源文件（可选）
```

agent可以按照你的skills指示读取这些文件。

### agent如何运用skills

skills的展现遵循 **渐进式** 模式：

1. **发现** ：对话开始时，agent会看到一个可用skills列表，其中包含skills名称和描述。

2. **激活** ：如果某项skills看起来与您的任务相关，agent将读取其全部 `SKILL.md` 内容。

3. **执行** ：agent在执行您的任务时会遵循skills指令。

你不需要明确告诉agent使用某个skills——它会根据上下文做出判断。但是，如果你想确保某个skills被使用，你可以直接提及它的名称。

### 最佳实践

#### 保持skills专注

每项skills都应该专注于做好一件事。与其创建“万能skills”，不如为不同的任务创建单独的skills。

#### 请写出清晰的描述。

skills描述是agent决定是否使用你的skills的依据。务必具体说明skills的作用以及适用场景。

#### 将脚本用作黑盒

如果你的skills包含脚本，请鼓励agent先运行脚本， `--help` 而不是阅读整个源代码。这样可以使agent的注意力集中在任务上。

#### 包括决策树

对于复杂的skills，添加一个部分，帮助agent根据情况选择正确的方法。

#### <span style="color:#121317">例如：代码审查</span>skills

这里介绍一项可以帮助agent审核代码的简单skills：

```markdown
---
name: code-review
description: Reviews code changes for bugs, style issues, and best practices. Use when reviewing PRs or checking code quality.
---

# Code Review Skill

When reviewing code, follow these steps:

## Review checklist

1. **Correctness**: Does the code do what it's supposed to?
2. **Edge cases**: Are error conditions handled?
3. **Style**: Does it follow project conventions?
4. **Performance**: Are there obvious inefficiencies?

## How to provide feedback

- Be specific about what needs to change
- Explain why, not just what
- Suggest alternatives when possible
```
