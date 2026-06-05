import extendApi from "./utils/extendApi"
import store from "./store"
import { createSSRApp } from "vue"
import { routeInterceptor } from "./router/interceptor"
import { initRootFontSize, useFont } from "./composables/useFont"
import "./main.css"
import App from "./App.vue"
import i18n from "./locale"
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
  // 初始化字体
  initRootFontSize()
  //挂载获取字体的方法
  const { rootFontSize } = useFont()
  app.config.globalProperties.$getRootFontSize = () => `${rootFontSize.value}px`
  app.use(store)
  app.use(routeInterceptor)
  app.use(i18n)
  return {
    app
  }
}
