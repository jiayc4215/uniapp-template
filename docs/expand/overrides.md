# pnpm overrides

`pnpm.overrides` 用于覆盖依赖树中的子依赖版本，常见用途包括修复间接依赖漏洞、统一某个包的版本、临时替换有问题的依赖版本。

## 项目配置

本项目根目录 `package.json` 已配置：

```json
{
  "pnpm": {
    "overrides": {
      "miniprogram-ci>less": "4.5.1"
    }
  }
}
```

这表示只覆盖 `miniprogram-ci` 依赖链下面的 `less` 版本为 `4.5.1`。

## 基本写法

覆盖所有依赖中的某个包：

```json
{
  "pnpm": {
    "overrides": {
      "foo": "^1.0.0"
    }
  }
}
```

只覆盖某个父依赖下的子依赖：

```json
{
  "pnpm": {
    "overrides": {
      "parent-package>child-package": "1.2.3"
    }
  }
}
```

替换为 npm 别名包：

```json
{
  "pnpm": {
    "overrides": {
      "quux": "npm:@myorg/quux@^1.0.0"
    }
  }
}
```

## 使用建议

- 优先只覆盖具体依赖链，例如 `miniprogram-ci>less`，避免影响范围过大。
- 每次新增 overrides 都要写清原因，方便后续升级依赖时判断能否删除。
- 修改 overrides 后重新执行 `pnpm install`，让 `pnpm-lock.yaml` 同步更新。
- 如果上游依赖已经修复，优先升级上游依赖并移除 overrides。
