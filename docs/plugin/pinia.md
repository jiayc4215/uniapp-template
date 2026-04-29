# Pinia 状态管理

本项目已集成 [Pinia](https://pinia.vuejs.org/zh/) 和 [pinia-plugin-persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate)，无需额外安装。

## 当前依赖

根目录 `package.json` 已包含：

```json
{
  "dependencies": {
    "pinia": "^3.0.4",
    "pinia-plugin-persistedstate": "^4.7.1"
  }
}
```

如果从空项目接入，可以执行：

```bash
pnpm add pinia pinia-plugin-persistedstate
```

## 项目配置

Pinia 实例位于 `src/store/index.js`：

```js
import { createPinia, setActivePinia } from "pinia"
import { createPersistedState } from "pinia-plugin-persistedstate"

const storage = {
  getItem: key => uni.getStorageSync(key),
  setItem: (key, value) => uni.setStorageSync(key, value),
  removeItem: key => uni.removeStorageSync(key)
}

const store = createPinia()

store.use(
  createPersistedState({
    auto: true,
    storage
  })
)

setActivePinia(store)

export default store

export * from "./token"
export * from "./user"
```

这里做了两件事：

- 使用 `uni.getStorageSync` / `uni.setStorageSync` 适配 uni-app 多端存储。
- 调用 `setActivePinia(store)`，保证部分场景在 `app.use(store)` 之前调用 Store 也能正常工作。

`src/main.js` 中已经挂载：

```js
import store from "./store"

export function createApp() {
  const app = createSSRApp(App)

  app.use(store)

  return {
    app
  }
}
```

## 定义 Store

模板使用组合式写法定义 Store，例如 `src/store/token.js`：

```js
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useTokenStore = defineStore(
  "token",
  () => {
    const tokenInfo = ref({
      token: ""
    })

    const validToken = computed(() => tokenInfo.value.token || "")
    const hasLogin = computed(() => !!tokenInfo.value.token)

    const setTokenInfo = val => {
      tokenInfo.value = val
    }

    return {
      tokenInfo,
      validToken,
      hasLogin,
      setTokenInfo
    }
  },
  {
    persist: true
  }
)
```

开启 `persist: true` 后，该 Store 会通过 `pinia-plugin-persistedstate` 自动持久化。

## 使用 Store

页面或业务模块中直接导入对应 Store：

```vue
<script setup>
import { useTokenStore } from "@/store/token"
import { useUserStore } from "@/store/user"

const tokenStore = useTokenStore()
const userStore = useUserStore()

function logout() {
  tokenStore.logout()
  userStore.clearUserInfo()
}
</script>
```

项目里已经有两个常用 Store：

| 文件                 | 说明                         |
| -------------------- | ---------------------------- |
| `src/store/token.js` | 登录、退出、token 信息       |
| `src/store/user.js`  | 用户信息获取、清理和头像更新 |

## 持久化说明

当前配置启用了 `auto: true`，并使用 uni-app storage 作为存储层。建议只给需要持久化的 Store 显式添加：

```js
{
  persist: true
}
```

如果某个 Store 只用于页面临时状态，不要添加 `persist`。

清理持久化数据时，可以使用 Store 内部动作统一处理。例如 `token.js` 的退出逻辑会清理 token 和用户信息：

```js
const logout = async () => {
  tokenInfo.value = { token: "" }
  uni.removeStorageSync("token")

  const userStore = useUserStore()
  userStore.clearUserInfo()
}
```

## 简单状态

对于很轻量的跨组件状态，也可以使用组合式函数或 `reactive`。这类状态适合 UI 偏好、一次性弹窗状态等，不一定需要放进 Pinia。

```js
const globalCount = ref(0)

export function useCount() {
  const increment = () => {
    globalCount.value++
  }

  return {
    globalCount,
    increment
  }
}
```

可复用、需要持久化或会参与权限/请求流程的状态，优先放入 `src/store`。
