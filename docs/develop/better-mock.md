# 小程序的mock数据【better-mock】

### better-mock是什么

`better-mock` fork 了 [Mock.js (opens new window)](https://github.com/nuysoft/Mock) ，在代码实现、构建脚本、单元测试上都选择了更加现代化的技术方案进行重构，所以使用者无需更改代码，可以 `100%` 兼容Mock.js。

### 为什么会有这个库

虽然 `Mock.js` 已经很长时间已经没有维护了，但是还是会一些使用者在提 `issue` ，提 `PR` ，所以 `better-mock` 的规划是：重构 `Mock.js` ，在不改变 `Mock.js` API 的基础上进行长期迭代，并且解决一些 `Mock.js` 的 `issue` 和 `PR` 。

### 一些说明

`better-mock` 的定位是 **开发** 环境下和 **Node.js** 中的数据 mock，不会着重考虑浏览器兼容性，所以在重构 Mock.js 的过程中，移除了一些浏览器兼容性代码，但是得益于 `babel` ，构建后的代码会兼容 `IE9+` 。

### 安装

```bash
pnpm add better-mock
```

工程已安装 `better-mock`，开发环境通过 `VITE_APP_MOCK=true` 开启。

### 使用

#### 使用 Webpack

```cobol
import Mock from 'better-mock'
const data = Mock.mock({
  // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
  'list|1-10': [
    {
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'id|+1': 1
    }
  ]
})
console.log(data)
```

#### 使用Node.js

```cobol
const Mock = require('better-mock')
const data = Mock.mock({
  'list|1-10': [
    {
      'id|+1': 1
    }
  ]
})
console.log(data)
```

#### 在浏览器中直接引用

```cobol
<script type="text/javascript" src="https://unpkg.com/better-mock/dist/mock.browser.js"></script>
```

#### RequireJS (AMD)

```cobol
require.config({
  paths: {
    mock: 'path/to/better-mock'
  }
})

require(['mock'], function(Mock) {
  var data = Mock.mock({
    'list|1-10': [
      {
        'id|+1': 1
      }
    ]
  })
  // 输出结果
  document.body.innerHTML += '<pre>' + JSON.stringify(data, null, 4) + '</pre>'
})
```

## 在小程序使用

### 介绍

`better-mock` 会针对各个小程序平台，对其 `request` 方法进行拦截，返回自定义的 mock 数据。

### 如何使用

#### 可以使用npm的情况

安装 `better-mock` 后直接引入 `dist/mock.mp.js` 文件：

```cobol
const Mock = require('better-mock/dist/mock.mp.js')

Mock.mock('http://example.com/path/to', {
  phone: '@PHONE'
})

wx.request({
  url: 'http://example.com/path/to',
  success (res) {
    console.log(res.data.phone) // 13687529123
  }
})
```

#### 不能使用 npm 的情况

如果不能使用 npm，可以下载 release 文件到本地，然后引入。

[https://unpkg.com/better-mock/dist/mock.mp.js](https://unpkg.com/better-mock/dist/mock.mp.js)

## 项目中的用法

Mock 入口位于 `src/mock/index.js`：

```js
import "./modules/login"
```

`src/mock/modules/mock.js` 会根据运行平台选择 H5 或小程序版本：

```js
// #ifdef H5
import Mock from "better-mock"
const mockBrowser = Mock.mock
// #endif

// #ifdef MP-WEIXIN
import { mock as mockMP } from "better-mock/dist/mock.mp"
// #endif

import { isMp } from "@uni-helper/uni-env"

const mock = isMp ? mockMP : mockBrowser

export default mock
```

`src/main.js` 只在开发环境且 `VITE_APP_MOCK=true` 时动态加载 Mock：

```js
const NODE_ENV = import.meta.env.MODE
const isMock = import.meta.env.VITE_APP_MOCK

if (NODE_ENV === "development" && isMock === "true") {
  import("@/mock")
}
```
