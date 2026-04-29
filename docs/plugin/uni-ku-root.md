# uni-app 也能使用 App.vue？解决 uni-app 无法使用公共组件问题

借助 Vite 模拟出虚拟根组件（支持 SFC 的 `App.vue`），解决 uni-app 无法使用公共组件问题。

- 自定义虚拟根组件文件命名（`App.ku.vue` 文件命名支持更换）
- 更高灵活度地获取虚拟根组件实例（获取 `KuRootView` 的 Ref）
- 自动提取 `PageMeta` 到页面顶层（自动提升小程序 `PageMeta` 组件，用于阻止滚动穿透）

---

## 📦 安装

```bash
pnpm add -D @uni-ku/root
```

---

## 🚀 使用

### 1. 引入 `@uni-ku/root`

```ts
// vite.config.(js|ts)

import Uni from "@uni-helper/plugin-uni"
import UniKuRoot from "@uni-ku/root"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    // 若存在改变 pages.json 的插件，请将 UniKuRoot 放置其后
    UniKuRoot(),
    Uni()
  ]
})
```

> **Note**
>
> **CLI**：直接编写根目录下的 `vite.config.(js|ts)`
>
> **HBuilderX**：在根目录下创建 `vite.config.(js|ts)` 并写入

---

### 2. 创建 `App.ku.vue`

（可自定义此根组件名称，请下拉至功能参考设置）

通过标签 `<KuRootView />` 或 `<ku-root-view />` 指定视图存放位置，并且可以将该标签放置到 `template` 内任意位置，**但仅可有一个**。

```vue
<!-- src/App.ku.vue | App.ku.vue -->

<script setup lang="ts">
import { ref } from "vue"

const helloKuRoot = ref("Hello AppKuVue")
</script>

<template>
  <div>{{ helloKuRoot }}</div>

  <!-- 顶级 KuRootView -->
  <KuRootView />

  <!-- 或内部 KuRootView，无论放置哪一个层级都被允许，但仅可有一个！ -->
  <div>
    <KuRootView />
  </div>
</template>
```

> **Note**
>
> **CLI**：需要在 `src` 目录下创建 `App.ku.vue`（或自定义名称）
>
> **HBuilderX**：直接在根目录下创建 `App.ku.vue`（或自定义名称）

> **Important**
>
> 该标签与 Vue Router 中的 `RouterView` 功能类似，但请注意，由于 uni-app Vue 的局限性，该功能并不完全等同于 Vue Router 的 `RouterView`

---

## 功能

### 功能一：自定义虚拟根组件名称（默认：`App.ku.vue`）

#### 1. 通过 `rootFileName` 自定义虚拟根组件名称

```ts
// vite.config.(js|ts)

import Uni from "@uni-helper/plugin-uni"
import UniKuRoot from "@uni-ku/root"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    UniKuRoot({
      // 默认含后缀 .vue，直接设置命名即可
      rootFileName: "KuRoot"
    })

    // ...other plugins
  ]
})
```

#### 2. 创建 / 修改虚拟根组件为 `KuRoot.vue`

```txt
// 将 App.ku.vue 重命名为 KuRoot.vue
```

---

### 功能二：使用虚拟根组件实例（即：`App.ku.vue`）

> 有两种启用方式：局部启用 或 全局启用

---

#### 一、局部启用

##### 1. 暴露 `App.ku.vue` 中需要被使用的变量或方法

```vue
<!-- src/App.ku.vue | App.ku.vue -->

<script setup lang="ts">
import { ref } from "vue"

const helloKuRoot = ref("Hello AppKuVue")

const exposeRef = ref("this is from App.ku.vue")

defineExpose({
  exposeRef
})
</script>

<template>
  <div>
    <div>{{ helloKuRoot }}</div>
    <KuRootView />
  </div>
</template>
```

##### 2. 在 `template` 内编写 `root="uniKuRoot"`

并通过 `const uniKuRoot = ref()` 获取模板引用。

> `uniKuRoot` 只是一个变量名，你可以根据习惯自行命名。

```vue
<!-- src/pages/*.vue -->

<script setup lang="ts">
import { ref } from "vue"

const uniKuRoot = ref()
</script>

<template root="uniKuRoot">
  <view> Hello UniKuRoot </view>
</template>
```

---

#### 二、全局启用

##### 1. 通过配置 `enabledGlobalRef` 开启全局自动注入 `App.ku` 实例

```ts
// vite.config.(js|ts)

import Uni from "@uni-helper/plugin-uni"
import UniKuRoot from "@uni-ku/root"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    UniKuRoot({
      enabledGlobalRef: true
    }),

    Uni()
  ]
})
```

##### 2. 暴露 `App.ku.vue` 中需要被使用的变量或方法

```vue
<!-- src/App.ku.vue | App.ku.vue -->

<script setup lang="ts">
import { ref } from "vue"

const helloKuRoot = ref("Hello UniKuRoot")

const exposeRef = ref("this is from App.ku.vue")

defineExpose({
  exposeRef
})
</script>

<template>
  <div>
    <div>{{ helloKuRoot }}</div>
    <KuRootView />
  </div>
</template>
```

##### 3. 通过 uni-app 内置方法 `getCurrentPages()` 获取暴露的数据

```vue
<!-- src/pages/*.vue -->

<script setup lang="ts">
import { onMounted, ref } from "vue"

const pagesStack = getCurrentPages()
const uniKuRoot = ref()

onMounted(() => {
  uniKuRoot.value = pagesStack[pagesStack.length - 1].$vm.$refs.uniKuRoot
})
</script>

<template>
  <view> Hello UniKuRoot </view>
</template>
```

---

### 功能三：过滤掉不需要根组件的页面

如果遇到一些不需要根组件的页面，可以设置 `excludePages` 选项进行过滤。

> `excludePages` 支持 glob 模式。

```ts
// vite.config.(js|ts)

import Uni from "@uni-helper/plugin-uni"
import UniKuRoot from "@uni-ku/root"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    UniKuRoot({
      excludePages: ["pages/exclude.vue", "pages/exclude/**/*.vue"]
    }),

    Uni()
  ]
})
```

---

## ✨ 示例

以下示例均以 **CLI** 创建项目为例。

> HBuilderX 项目配置同理，只需注意是否需要包含 `src` 目录。

不仅是 Toast 组件，还可以是 Message、LoginPopup 等等。

---

### 1. 编写 Toast 组件

```vue
<!-- src/components/GlobalToast.vue -->

<script setup lang="ts">
import { useToast } from "@/composables/useToast"

const { globalToastState, hideToast } = useToast()
</script>

<template>
  <div v-if="globalToastState" class="toast-wrapper" @click="hideToast">
    <div class="toast-box">welcome to use @uni-ku/root</div>
  </div>
</template>

<style scoped>
.toast-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-box {
  background: white;
  color: black;
}
</style>
```

---

### 2. 实现 Toast 组合式 API

```ts
// src/composables/useToast.ts

import { ref } from "vue"

const globalToastState = ref(false)

export function useToast() {
  function showToast() {
    globalToastState.value = true
  }

  function hideToast() {
    globalToastState.value = false
  }

  return {
    globalToastState,
    showToast,
    hideToast
  }
}
```

---

### 3. 挂载至 `App.ku.vue`

```vue
<!-- src/App.ku.vue -->

<script setup lang="ts">
import GlobalToast from "@/components/GlobalToast.vue"
</script>

<template>
  <KuRootView />
  <GlobalToast />
</template>
```

---

### 4. 在页面内部触发全局 Toast 组件

```vue
<!-- src/pages/*.vue -->

<script setup lang="ts">
import { useToast } from "@/composables/useToast"

const { showToast } = useToast()
</script>

<template>
  <view> Hello UniKuRoot </view>

  <button @click="showToast">视图内触发展示 Toast</button>
</template>
```

---

## 与 uni-helper-layouts 的区别

`root` 的核心理念是尽可能贴近 Vue 中的 `App.vue`，而 `layouts` 更偏向于类似 Nuxt 的布局系统。

- `root` 位于 `layouts` 之上，提供更高自由度
- `root` 能够实现 `layouts` 的效果，并且更容易控制布局组件
- `root` 支持 `PageMeta`，并自动提取到页面顶层节点
- `root` 提供多种方式使用模板引用
