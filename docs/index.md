---
layout: home

hero:
  name: "uniapp-template"
  text: "uni-app 多端项目模板"
  tagline: 基于 Vue 3、Vite 5、Pinia、Wot UI、Tailwind CSS 和 Uni Helper 的业务项目启动模板。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quickstart
    - theme: alt
      text: 项目结构
      link: /guide/structure

features:
  - title: 多端构建
    details: 使用 uni-app 3、Vue 3 和 Vite 5，内置 H5、微信小程序及其他小程序平台脚本。
  - title: 路由与权限
    details: 通过 definePage、路由守卫、Pinia 登录态和角色规则实现页面访问控制。
  - title: UI 与样式
    details: 集成 Wot UI、Tailwind CSS 4、weapp-tailwindcss、暗黑模式和动态字体大小。
  - title: 分包示例
    details: 使用 @uni-ku/bundle-optimizer，提供 echarts-modules 与 public-modules 分包示例。
  - title: Mock 与请求
    details: 开发环境可开启 better-mock，配合 src/api 和 src/utils 下的请求封装演示登录流程。
  - title: 小程序上传
    details: 提供微信小程序构建与 CLI 上传脚本，便于接入发布流程。
---

## 从这里开始

- 新项目接入先看 [快速开始](/guide/quickstart)，确认 Node、pnpm、环境变量和常用命令。
- 熟悉代码边界先看 [项目结构](/guide/structure)，了解主包、分包、路由、状态和脚本位置。
- 扩展页面权限先看 [路由与权限](/guide/router-permission)，再修改页面内的 `definePage` 与 `src/tabbar/config.js`。
