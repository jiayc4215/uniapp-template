# uni-app 弹窗总被父元素“绑架”？3招破局，H5/小程序/APP一招通杀！

### 背景介绍

在uni-app开发中，弹窗、抽屉、下拉菜单等覆盖型组件是非常常见的交互元素。这些组件通常需要相对于视口定位，不受父元素影响。然而，在某些场景下 Position: Fixed 会有不符合预期的表现题。而且 uni-app 一次编码，多端报错的特性，导致这个问题十分棘手，因此今天我们就要探讨一个跨端的解决方案来处理这些定位问题。

### CSSPosition: Fixed 的失效问题

#### 问题描述

根据 CSS 规范， `position: fixed` 元素的定位上下文默认是相对于视口（viewport）的。但在以下情况下，定位上下文会发生改变：

1. **Transform 属性** ：当祖先元素应用了 `transform` 属性时

2. **Filter 效果** ：当祖先元素设置了 `filter` 或 `backdrop-filter` 属性时

3. **3D 渲染上下文** ：当祖先元素设置了 `perspective` 属性时

4. **will-change** ：当祖先元素的 `will-change` 属性设置为上述值时

这种行为在 MDN 文档中有明确说明：

> "当元素祖先的 transform、perspective、filter 或 backdrop-filter 属性非 none 时，容器由视口改为该祖先。"
>
> —— [MDN - position: fixed](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FCSS%2Fposition%23fixed)

#### 实际开发中的影响

这个问题在实际开发中经常会带来以下困扰：

1. **模态框定位异常**
   - 在带有变换效果的容器中，模态框无法相对于视口居中

   - 弹窗位置会随父容器滚动而改变

2. **固定导航失效**
   - 使用 CSS transform 实现动画效果的页面中，固定导航栏会失去固定效果

   - 在滚动时导航栏可能会跟随内容移动

3. **交互组件错位**
   - 下拉菜单、提示框等定位不准确

   - 遮罩层无法完全覆盖视口

#### 问题示例

```cobol
<template>
	<view style="transform: scale(1.8)">
		<view style="position: fixed; top: 0; left: 0;">
			这个元素不会固定在视口顶部1
		</view>
	</view>
</template>
```

### uni-appVue3中的跨平台解决方案

我们期望针对 uni-app Vue3 提供了一个优雅的跨平台解决方案。通过条件编译和平台特定的实现，组件能够在不同端完美运行。核心思路是将内容传送到应用根节点，从而避免中间层级的 CSS 上下文影响。

#### 条件编译实现

使用 uni-app 的条件编译特性，我们可以为不同平台提供最优的实现方案：

```xml
<template>
	<!-- #ifdef H5 -->
	<teleport to="body">
		<slot />
	</teleport>
	<!-- #endif -->

	<!-- #ifdef MP-WEIXIN || MP-ALIPAY -->
	<root-portal>
		<slot />
	</root-portal>
	<!-- #endif -->
	<slot />
</template>


<script module="render" lang="renderjs">
	export default {
		mounted() {
			// 获取根节点
			const root = document.querySelector('uni-app') || document.body
			if (this.$ownerInstance.$el) {
				root.appendChild(this.$ownerInstance.$el)
			}
		}
	}
</script>


<style>
</style>
```

#### 各端实现原理与细节

##### 1. H5 环境 - Teleport 实现原理

`<Teleport>` 是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的DOM结构外层的位置去。

`<Teleport>` 接收一个 `to` prop 来指定传送的目标。 `to` 的值可以是一个 CSS 选择器字符串，也可以是一个 DOM 元素对象。这段代码的作用就是告诉 Vue“把以下模板片段 **传送到 `body`** 标签下”。

```cobol
// teleport 在 uni-app H5 端的工作方式
// 1. 组件逻辑
const show = ref(false)
// 2. 模板中使用
<teleport to="body">
  <view v-if="show" class="popup">
    <slot />
  </view>
</teleport>
```

> TIP
>
> `<Teleport>` 挂载时，传送的 `to` 目标必须已经存在于 DOM 中。理想情况下，这应该是整个 Vue 应用 DOM 树外部的一个元素。如果目标元素也是由 Vue 渲染的，你需要确保在挂载 `<Teleport>` 之前先挂载该元素。

`<Teleport>` 只改变了渲染的 DOM 结构，它不会影响组件间的逻辑关系。也就是说，如果 `<Teleport>` 包含了一个组件，那么该组件始终和这个使用了 `<Teleport>` 的组件保持逻辑上的父子关系。传入的 props 和触发的事件也会照常工作。

这也意味着来自父组件的注入也会按预期工作，子组件将在 VueDevtools中嵌套在父级组件下面，而不是放在实际内容移动到的地方。

优点：

- 完全复用 Vue3 的能力

- 支持动态目标节点

- 保持组件状态和事件绑定

##### 2. 小程序环境 - root-portal 实现原理

使整个子树从页面中脱离出来，类似于在 CSS 中使用 fixed position 的效果。主要用于制作弹窗、弹出层等。

|     属性      |  类型   | 默认值 | 必填 |         说明         |                                        最低版本                                         |
| :-----------: | :-----: | :----: | :--: | :------------------: | :-------------------------------------------------------------------------------------: |
|    enable     | boolean |  true  |  否  | 是否从页面中脱离出来 | [2.26.1](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) |
| externalClass | string  |        |  否  |      外部样式类      | [3.9.2](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)  |

```
在开发者工具中预览效果https://developers.weixin.qq.com/s/1XCYEQmb7UJy
```

```cobol
<root-portal>
  <view class="popup">
    <slot />
  </view>
</root-portal>
```

##### 3. App 环境 - renderjs 实现原理

App 端使用 `renderjs` 实现节点操作，这是一个强大的跨平台解决方案：

- 直接运行在视图层（Webview）中

- 可以访问完整的浏览器 API

- 支持直接 DOM 操作

设置 script 节点的 lang 为 renderjs

视图层和逻辑层通讯方式与 [WXS](https://uniapp.dcloud.net.cn/tutorial/miniprogram-subject.html#wxs) 一致，另外可以通过this.$ownerInstance 获取当前组件的 ComponentDescriptor 实例。

this.$ownerInstance.callMethod() 仅支持调用逻辑层vue选项式中的 methods 中定义的方法。

```xml
// App 端的实现
<script module="render" lang="renderjs">
export default {
  mounted() {
    // 获取根节点
    const root = document.querySelector('uni-app') || document.body
    if (this.$ownerInstance.$el) {
      root.appendChild(this.$ownerInstance.$el)
    }
  }
}
</script>

```

**优点：**

大幅降低逻辑层和视图层的通讯损耗，提供高性能视图交互能力

uni-app的app端逻辑层和视图层是分离的，这种机制有很多好处，但也有一个副作用是在造成了两层之间通信阻塞。尤其是App的Android端阻塞问题影响了高性能应用的制作。

`renderjs` 运行在视图层，可以直接操作视图层的元素，避免通信折损。

在hello uni-app的canvas示例中，App端使用了 `renderjs` ，由运行在视图层的 `renderjs` 直接操作视图层的canvas，实现了远超微信小程序的流畅canvas动画示例。具体在 [hello uni-app](https://m3w.cn/uniapp) 示例中体验，对比App端和小程序端的性能差异。

在视图层操作dom，运行for<span style="color: #3391E5">web</span>的js库

官方不建议在uni-app里操作dom，但如果你不开发小程序，想使用一些操作了dom、window的库，其实可以使用 `renderjs` 来解决。

在app-vue环境下，视图层由webview渲染，而 `renderjs` 运行在视图层，自然可以操作dom和window。

这是一个基于 `renderjs` 运行echart完整版的示例： [renderjs版echart](https://ext.dcloud.net.cn/plugin?id=1207)

同理， `f2` 、 `threejs` 等库都可以这么用。

> nvue的视图层是原生的，无法运行js。但提供了bindingx技术来解决通信阻塞。 [详见](https://uniapp.dcloud.net.cn/tutorial/nvue-api.html#bindingx)
>
> 微信小程序下替代方案是wxs，这是微信提供的一个裁剪版renderjs。 [详见](https://uniapp.dcloud.net.cn/tutorial/miniprogram-subject.html#wxs)
>
> web下不存在逻辑层和视图层的通信阻塞，也可以直接操作dom，所以在web端使用renderjs主要是为了跨端复用代码。如果只开发web端，没有必要使用renderjs。

#### 统一封装实现

为了统一管理这三种实现方式，我们会将其封装一个统一的组件，在 WotUI 组件库中提供。

这个统一封装：

1. 使用条件编译区分平台

2. 保持一致的 API 和使用方式

3. 解决了跨平台兼容性问题

4. 支持微信小程序、支付宝小程序、APP和h5
