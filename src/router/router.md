# vite-plugin-uni-pages

得益于 `@uni-helper/vite-plugin-uni-pages`，约定式路由（文件路由）的实现变得非常简单。

在 `src/pages` 目录下：

- 每个 `.vue` 文件都会自动生成一个页面路由
- 插件会自动生成 `pages.json`
- 无需手动维护 `pages.json`

> ⚠️ **注意**
>
> - `pages.json` 是自动生成的，请不要手动修改
> - 全局配置请写在 `pages.config.ts`
> - 页面级配置请写在 `.vue` 文件中的 `route` 代码块

---

## 基础示例

## 设置首页

通过在 `route` 代码块中配置 `type="home"` 即可设置首页。

> 建议整个项目 **只配置一个** `type="home"`  
> 如果配置多个，会按字母顺序排序，可能导致首页不是预期页面。

```vue
<!-- 使用 type="home" 属性设置首页 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: "custom",
    navigationBarTitleText: "首页"
  }
}
</route>

<template>
  <div>
    <wd-button type="primary">主要按钮</wd-button>
  </div>
</template>
```

---

## 普通页面示例

```vue
<route lang="json5">
{
  style: {
    navigationBarTitleText: "关于"
  }
}
</route>

<template>
  <view>
    <view>通过 `/pages/about` 来访问这个页面</view>
  </view>
</template>
```

---

## 页面过滤与分包

### 1️⃣ 过滤页面

默认情况下，`src/pages` 目录下的所有 `.vue` 文件都会被自动注册为页面。

如果某些文件不需要生成页面，可以在 `vite.config.ts` 中通过 `exclude` 配置排除：

```ts
import UniPages from "@uni-helper/vite-plugin-uni-pages"

UniPages({
  exclude: ["**/components/**/**.*"]
})
```

---

### 2️⃣ 配置分包

如果需要使用分包，可以通过 `subPackages` 进行配置。

> ⚠️ 注意
>
> - `subPackages` 是一个数组，可以配置多个分包
> - 分包目录 **不能是 `src/pages` 的子目录**

```ts
import UniPages from "@uni-helper/vite-plugin-uni-pages"

UniPages({
  subPackages: ["src/pages-sub"]
})
```

---

## 总结

- `src/pages` = 自动生成路由
- `route` 代码块 = 页面配置
- `pages.json` = 自动生成（不要手动改）
- `pages.config.ts` = 全局配置
- `exclude` = 页面过滤
- `subPackages` = 分包配置

通过文件结构即可轻松实现约定式路由 🚀
