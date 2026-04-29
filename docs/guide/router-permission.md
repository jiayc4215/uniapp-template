# 路由与权限

本项目的权限控制由三部分组成：

- 页面内 `definePage` 声明页面规则。
- `src/router/permission.js` 在路由跳转前校验登录态和角色。
- `src/tabbar/config.js` 根据角色生成自定义 TabBar。

## 页面配置

页面使用 `definePage` 写入导航栏、权限和免登录配置：

```vue
<script setup>
definePage({
  style: {
    navigationBarTitleText: "管理台"
  },
  rules: ["admin"]
})
</script>
```

常用字段：

| 字段                           | 说明                                       |
| ------------------------------ | ------------------------------------------ |
| `style.navigationBarTitleText` | 页面标题                                   |
| `rules`                        | 允许访问的角色列表                         |
| `excludeLoginPath`             | 是否免登录访问                             |
| `type: "home"`                 | 标记首页路径，`src/utils/router.js` 会读取 |

## 登录校验

`src/router/permission.js` 会在每次跳转时执行：

- 已登录访问登录页时，跳转到 `/`。
- 未登录访问非白名单页面时，跳转到登录页并携带 `redirect`。
- 已登录访问带 `rules` 的页面时，校验用户角色。
- 权限不足时，跳转到 `/pages/error/index`。

免登录页面可以通过两种方式配置：

- 写入 `src/router/config.js` 的静态白名单。
- 在开发环境下，在页面 `definePage` 中设置 `excludeLoginPath: true`。

## 角色与 TabBar

内置角色：

- `admin`
- `user`

`src/tabbar/config.js` 中的 `customTabbarList` 通过 `roles` 字段控制菜单显示：

```js
{
  pagePath: "pages/admin-dashboard/index",
  text: "管理台",
  icon: "i-mdi-view-dashboard",
  roles: ["admin"],
  iconType: "tailwind"
}
```

新增角色时，需要同步检查：

- 登录接口和 Mock 返回的角色信息。
- 页面内 `definePage({ rules: [...] })`。
- `src/tabbar/config.js` 的 `roles` 配置。
