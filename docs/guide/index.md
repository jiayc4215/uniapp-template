# 介绍

`uniapp-template` 是一个基于 `uni-app + Vue 3 + Vite` 的多端项目模板。它更偏向“业务启动模板 + 多端能力示例”，不是单纯的空白脚手架。

## 已集成能力

- `@uni-helper/unh`：封装开发、构建和配置生成流程。
- `@uni-helper/vite-plugin-uni-pages`：基于文件约定和 `definePage` 生成页面配置。
- `@uni-helper/vite-plugin-uni-manifest`：通过 `manifest.config.js` 维护应用配置。
- `Pinia`：管理登录态、用户信息、TabBar 和主题相关状态。
- `Wot UI`：通过 `pages.config.js` 的 `easycom` 自动解析 `wd-*` 组件。
- `Tailwind CSS 4 + weapp-tailwindcss`：提供多端可用的原子类写法。
- `better-mock`：开发环境可开启本地 Mock。
- `@uni-ku/bundle-optimizer`：优化微信小程序分包体积，并支持跨包异步引用示例。

## 适合做什么

- 快速启动 H5 或微信小程序业务项目。
- 验证登录、角色权限、动态 TabBar、暗黑模式、字号切换等通用能力。
- 作为 uni-app 多端工程化配置的参考项目。

## 关键约定

- 使用 `pnpm` 安装依赖，项目通过 `only-allow pnpm` 限制包管理器。
- 环境变量集中放在 `env/` 目录，由 `vite.config.js` 和 `manifest.config.js` 读取。
- 主包页面放在 `src/pages`。
- 分包放在 `src/echarts-modules` 和 `src/public-modules`。
- 页面权限写在页面内的 `definePage({ rules: [...] })` 中。
