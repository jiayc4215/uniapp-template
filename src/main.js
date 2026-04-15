import extendApi from "./utils/extendApi"
import store from "./store"
import { createSSRApp } from "vue"
import { routeInterceptor } from "./router/interceptor"
import "./main.css"
import App from "./App.vue"
const NODE_ENV = import.meta.env.MODE
const isMock = import.meta.env.VITE_APP_MOCK

// 开发环境引入mock 小程序不支持import(),借助 UniOptimization
if (NODE_ENV === "development" && isMock === "true") {
  import("@/mock").then(res => {
    console.log("mock文件初始化", res)
  })
}

export function createApp() {
  uni.toast = extendApi.toast
  uni.modal = extendApi.modal
  const app = createSSRApp(App)
  app.use(store)
  app.use(routeInterceptor)
  return {
    app
  }
}
